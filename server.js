const express = require('express');
const session = require('express-session');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// Session middleware
app.use(session({
    secret: 'whatsapp-bulk-sender-secret-' + Math.random().toString(36),
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session ID oluştur
app.use((req, res, next) => {
    if (!req.session.userId) {
        req.session.userId = uuidv4();
        console.log('✨ Yeni kullanıcı:', req.session.userId.substring(0, 8));
    }
    next();
});

// Multer yapılandırması
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userDir = path.join('uploads', req.session.userId);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Her kullanıcı için veriler
const userClients = new Map();
const userQRCodes = new Map();
const userAuthStatus = new Map();

// Kullanıcı client'ı al veya oluştur
function getUserClient(userId) {
    if (!userClients.has(userId)) {
        console.log('🔧 Yeni WhatsApp client:', userId.substring(0, 8));
        
        const client = new Client({
            authStrategy: new LocalAuth({ clientId: userId }),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        client.on('qr', (qr) => {
            console.log('📱 QR Kod:', userId.substring(0, 8));
            userQRCodes.set(userId, qr);
        });

        client.on('ready', () => {
            console.log('✅ WhatsApp bağlandı:', userId.substring(0, 8));
            userAuthStatus.set(userId, true);
            userQRCodes.delete(userId);
        });

        client.on('disconnected', (reason) => {
            console.log('❌ Bağlantı kesildi:', userId.substring(0, 8), reason);
            userAuthStatus.set(userId, false);
            userQRCodes.delete(userId);
        });

        client.on('auth_failure', () => {
            console.log('⚠️ Auth hatası:', userId.substring(0, 8));
            userAuthStatus.set(userId, false);
        });

        client.initialize();
        userClients.set(userId, client);
        userAuthStatus.set(userId, false);
    }
    
    return userClients.get(userId);
}

// Ana sayfa
app.get('/', (req, res) => {
    const userId = req.session.userId;
    const isAuthenticated = userAuthStatus.get(userId) || false;
    
    res.render('index', { 
        authenticated: isAuthenticated,
        userId: userId.substring(0, 8)
    });
});

// QR Kod isteği
app.get('/qr', (req, res) => {
    const userId = req.session.userId;
    getUserClient(userId);
    
    const qrCode = userQRCodes.get(userId);
    const isAuthenticated = userAuthStatus.get(userId);
    
    if (qrCode) {
        qrcode.toDataURL(qrCode, (err, url) => {
            if (err) {
                res.json({ error: err.message });
            } else {
                res.json({ qr: url });
            }
        });
    } else if (isAuthenticated) {
        res.json({ authenticated: true });
    } else {
        res.json({ qr: null, status: 'initializing' });
    }
});

// Kişileri getir
app.get('/contacts', async (req, res) => {
    const userId = req.session.userId;
    const client = userClients.get(userId);
    const isAuthenticated = userAuthStatus.get(userId);
    
    if (!client || !isAuthenticated) {
        return res.json({ error: 'WhatsApp bağlı değil' });
    }
    
    try {
        const chats = await client.getChats();
        const contacts = chats
            .filter(chat => chat.isGroup === false)
            .map(chat => ({
                id: chat.id._serialized,
                name: chat.name || chat.id.user,
                number: chat.id.user
            }));
        res.json(contacts);
    } catch (error) {
        res.json({ error: error.message });
    }
});

// Mesaj gönder
app.post('/send', upload.single('photo'), async (req, res) => {
    const userId = req.session.userId;
    const client = userClients.get(userId);
    const isAuthenticated = userAuthStatus.get(userId);
    
    if (!client || !isAuthenticated) {
        return res.json({ error: 'WhatsApp bağlı değil' });
    }
    
    const { selectedContacts, message } = req.body;
    
    let contactsArray;
    try {
        contactsArray = JSON.parse(selectedContacts);
    } catch (e) {
        return res.json({ error: 'Geçersiz kişi listesi' });
    }
    
    if (!contactsArray || contactsArray.length === 0) {
        return res.json({ error: 'Kişi seçilmedi' });
    }
    
    if (contactsArray.length > 10) {
        return res.json({ error: 'Maksimum 10 kişi seçebilirsiniz' });
    }
    
    if (!message && !req.file) {
        return res.json({ error: 'Mesaj veya fotoğraf göndermelisiniz' });
    }
    
    try {
        const results = [];
        
        for (const contactId of contactsArray) {
            try {
                if (message && !req.file) {
                    await client.sendMessage(contactId, message);
                    results.push({ contact: contactId, status: 'Mesaj gönderildi' });
                }
                
                if (req.file) {
                    const media = MessageMedia.fromFilePath(req.file.path);
                    await client.sendMessage(contactId, media, { caption: message || '' });
                    results.push({ contact: contactId, status: 'Fotoğraf gönderildi' });
                }
                
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (err) {
                results.push({ contact: contactId, status: 'Hata: ' + err.message });
            }
        }
        
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Dosya silinemedi:', err);
            });
        }
        
        res.json({ success: true, results });
    } catch (error) {
        res.json({ error: error.message });
    }
});

// Çıkış yap
app.post('/logout', async (req, res) => {
    const userId = req.session.userId;
    const client = userClients.get(userId);
    
    if (client) {
        try {
            await client.logout();
            await client.destroy();
            userClients.delete(userId);
            userAuthStatus.delete(userId);
            userQRCodes.delete(userId);
            req.session.destroy();
            res.json({ success: true });
        } catch (error) {
            res.json({ error: error.message });
        }
    } else {
        res.json({ success: true });
    }
});

// Durum kontrolü
app.get('/status', (req, res) => {
    const userId = req.session.userId;
    res.json({ 
        authenticated: userAuthStatus.get(userId) || false,
        userId: userId.substring(0, 8)
    });
});

app.listen(port, () => {
    console.log('╔═══════════════════════════════════════════════╗');
    console.log('║  WhatsApp Toplu Mesaj - ÇOK KULLANICILI       ║');
    console.log('╚═══════════════════════════════════════════════╝');
    console.log(`📡 Server: http://localhost:${port}`);
    console.log(`👥 Her kullanıcı kendi hesabını bağlayabilir`);
    console.log(`🔒 Session: 24 saat`);
    console.log(`📊 Aktif kullanıcı: ${userClients.size}`);
    console.log('═══════════════════════════════════════════════');
});

process.on('SIGINT', async () => {
    console.log('\n🛑 Kapatılıyor...');
    for (const [userId, client] of userClients) {
        try {
            await client.destroy();
            console.log(`✅ Temizlendi: ${userId.substring(0, 8)}`);
        } catch (error) {
            console.error(`❌ Hata: ${userId.substring(0, 8)}`);
        }
    }
    process.exit(0);
});