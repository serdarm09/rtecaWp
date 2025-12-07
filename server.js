const express = require('express');const express = require('express');const express = require('express');

const session = require('express-session');

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');const session = require('express-session');const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const qrcode = require('qrcode');

const multer = require('multer');const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');const qrcode = require('qrcode');

const path = require('path');

const fs = require('fs');const qrcode = require('qrcode');const multer = require('multer');

const { v4: uuidv4 } = require('uuid');

const multer = require('multer');const path = require('path');

const app = express();

const port = process.env.PORT || 3000;const path = require('path');const fs = require('fs');



// Session middleware (en başta olmalı)const fs = require('fs');

app.use(session({

    secret: 'whatsapp-bulk-sender-secret-' + Math.random().toString(36),const { v4: uuidv4 } = require('uuid');// Multer yapılandırması (upload'dan önce tanımlanmalı)

    resave: false,

    saveUninitialized: true,const storage = multer.diskStorage({

    cookie: { 

        maxAge: 24 * 60 * 60 * 1000,// Multer yapılandırması    destination: (req, file, cb) => {

        httpOnly: true

    }const storage = multer.diskStorage({        cb(null, 'uploads/');

}));

    destination: (req, file, cb) => {    },

// Middleware

app.use(express.json());        const userDir = path.join('uploads', req.session.userId);    filename: (req, file, cb) => {

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));        if (!fs.existsSync(userDir)) {        cb(null, Date.now() + path.extname(file.originalname));

app.set('view engine', 'ejs');

            fs.mkdirSync(userDir, { recursive: true });    }

// Session ID oluştur

app.use((req, res, next) => {        }});

    if (!req.session.userId) {

        req.session.userId = uuidv4();        cb(null, userDir);const upload = multer({ storage });

        console.log('✨ Yeni kullanıcı:', req.session.userId.substring(0, 8));

    }    },

    next();

});    filename: (req, file, cb) => {const app = express();



// Multer yapılandırması        cb(null, Date.now() + path.extname(file.originalname));const port = 3000;

const storage = multer.diskStorage({

    destination: (req, file, cb) => {    }

        const userDir = path.join('uploads', req.session.userId);

        if (!fs.existsSync(userDir)) {});// Middleware

            fs.mkdirSync(userDir, { recursive: true });

        }const upload = multer({ storage });app.use(express.json());

        cb(null, userDir);

    },app.use(express.urlencoded({ extended: true }));

    filename: (req, file, cb) => {

        cb(null, Date.now() + path.extname(file.originalname));const app = express();app.use(express.static('public'));

    }

});const port = process.env.PORT || 3000;app.set('view engine', 'ejs');

const upload = multer({ storage });



// Her kullanıcı için veriler

const userClients = new Map();// Session middleware// WhatsApp Client

const userQRCodes = new Map();

const userAuthStatus = new Map();app.use(session({const client = new Client({



// Kullanıcı client'ı al veya oluştur    secret: 'whatsapp-bulk-sender-secret-key-' + Math.random(),    authStrategy: new LocalAuth()

function getUserClient(userId) {

    if (!userClients.has(userId)) {    resave: false,});

        console.log('🔧 Yeni WhatsApp client:', userId.substring(0, 8));

            saveUninitialized: true,

        const client = new Client({

            authStrategy: new LocalAuth({ clientId: userId }),    cookie: { let qrCodeData = null;

            puppeteer: {

                headless: true,        maxAge: 24 * 60 * 60 * 1000, // 24 saatlet isAuthenticated = false;

                args: ['--no-sandbox', '--disable-setuid-sandbox']

            }        httpOnly: truelet contacts = [];

        });

    }

        client.on('qr', (qr) => {

            console.log('📱 QR Kod:', userId.substring(0, 8));}));// QR Kod oluşturma

            userQRCodes.set(userId, qr);

        });client.on('qr', (qr) => {



        client.on('ready', () => {// Middleware    console.log('QR Kod alındı');

            console.log('✅ WhatsApp bağlandı:', userId.substring(0, 8));

            userAuthStatus.set(userId, true);app.use(express.json());    qrCodeData = qr;

            userQRCodes.delete(userId);

        });app.use(express.urlencoded({ extended: true }));});



        client.on('disconnected', (reason) => {app.use(express.static('public'));

            console.log('❌ Bağlantı kesildi:', userId.substring(0, 8), reason);

            userAuthStatus.set(userId, false);app.set('view engine', 'ejs');// WhatsApp bağlandığında

            userQRCodes.delete(userId);

        });client.on('ready', () => {



        client.on('auth_failure', () => {// Her kullanıcı için client saklama    console.log('WhatsApp client hazır!');

            console.log('⚠️ Auth hatası:', userId.substring(0, 8));

            userAuthStatus.set(userId, false);const userClients = new Map();    isAuthenticated = true;

        });

const userQRCodes = new Map();    qrCodeData = null;

        client.initialize();

        userClients.set(userId, client);const userAuthStatus = new Map();});

        userAuthStatus.set(userId, false);

    }

    

    return userClients.get(userId);// Session ID oluştur// Bağlantı koptuğunda

}

app.use((req, res, next) => {client.on('disconnected', () => {

// Ana sayfa

app.get('/', (req, res) => {    if (!req.session.userId) {    console.log('WhatsApp bağlantısı kesildi');

    const userId = req.session.userId;

    const isAuthenticated = userAuthStatus.get(userId) || false;        req.session.userId = uuidv4();    isAuthenticated = false;

    

    res.render('index', {         console.log('Yeni kullanıcı oluşturuldu:', req.session.userId);});

        authenticated: isAuthenticated,

        userId: userId.substring(0, 8)    }

    });

});    next();// Ana sayfa



// QR Kod isteği});app.get('/', (req, res) => {

app.get('/qr', (req, res) => {

    const userId = req.session.userId;    res.render('index', { 

    getUserClient(userId);

    // Kullanıcı client'ı al veya oluştur        qrCode: qrCodeData, 

    const qrCode = userQRCodes.get(userId);

    const isAuthenticated = userAuthStatus.get(userId);function getUserClient(userId) {        authenticated: isAuthenticated 

    

    if (qrCode) {    if (!userClients.has(userId)) {    });

        qrcode.toDataURL(qrCode, (err, url) => {

            if (err) {        console.log('Yeni WhatsApp client oluşturuluyor:', userId);});

                res.json({ error: err.message });

            } else {        

                res.json({ qr: url });

            }        const clientDir = path.join('.wwebjs_auth', userId);// QR Kod isteği

        });

    } else if (isAuthenticated) {        app.get('/qr', async (req, res) => {

        res.json({ authenticated: true });

    } else {        const client = new Client({    if (qrCodeData) {

        res.json({ qr: null, status: 'initializing' });

    }            authStrategy: new LocalAuth({ clientId: userId }),        try {

});

            puppeteer: {            const qrImage = await qrcode.toDataURL(qrCodeData);

// Kişileri getir

app.get('/contacts', async (req, res) => {                headless: true,            res.json({ qr: qrImage });

    const userId = req.session.userId;

    const client = userClients.get(userId);                args: ['--no-sandbox', '--disable-setuid-sandbox']        } catch (error) {

    const isAuthenticated = userAuthStatus.get(userId);

                }            res.json({ error: error.message });

    if (!client || !isAuthenticated) {

        return res.json({ error: 'WhatsApp bağlı değil' });        });        }

    }

        } else if (isAuthenticated) {

    try {

        const chats = await client.getChats();        // QR Kod event        res.json({ authenticated: true });

        const contacts = chats

            .filter(chat => chat.isGroup === false)        client.on('qr', (qr) => {    } else {

            .map(chat => ({

                id: chat.id._serialized,            console.log('QR Kod alındı:', userId);        res.json({ qr: null });

                name: chat.name || chat.id.user,

                number: chat.id.user            userQRCodes.set(userId, qr);    }

            }));

        res.json(contacts);        });});

    } catch (error) {

        res.json({ error: error.message });

    }

});        // Hazır event// Kişileri getir



// Mesaj gönder        client.on('ready', () => {app.get('/contacts', async (req, res) => {

app.post('/send', upload.single('photo'), async (req, res) => {

    const userId = req.session.userId;            console.log('WhatsApp hazır:', userId);    if (!isAuthenticated) {

    const client = userClients.get(userId);

    const isAuthenticated = userAuthStatus.get(userId);            userAuthStatus.set(userId, true);        return res.json({ error: 'WhatsApp bağlı değil' });

    

    if (!client || !isAuthenticated) {            userQRCodes.delete(userId);    }

        return res.json({ error: 'WhatsApp bağlı değil' });

    }        });    

    

    const { selectedContacts, message } = req.body;    try {

    

    let contactsArray;        // Bağlantı koptuğunda        const chats = await client.getChats();

    try {

        contactsArray = JSON.parse(selectedContacts);        client.on('disconnected', (reason) => {        contacts = chats

    } catch (e) {

        return res.json({ error: 'Geçersiz kişi listesi' });            console.log('WhatsApp bağlantısı kesildi:', userId, reason);            .filter(chat => chat.isGroup === false)

    }

                userAuthStatus.set(userId, false);            .map(chat => ({

    if (!contactsArray || contactsArray.length === 0) {

        return res.json({ error: 'Kişi seçilmedi' });            userQRCodes.delete(userId);                id: chat.id._serialized,

    }

            });                name: chat.name || chat.id.user,

    if (contactsArray.length > 10) {

        return res.json({ error: 'Maksimum 10 kişi seçebilirsiniz' });                number: chat.id.user

    }

            // Auth başarısız            }));

    if (!message && !req.file) {

        return res.json({ error: 'Mesaj veya fotoğraf göndermelisiniz' });        client.on('auth_failure', () => {        res.json(contacts);

    }

                console.log('Auth başarısız:', userId);    } catch (error) {

    try {

        const results = [];            userAuthStatus.set(userId, false);        res.json({ error: error.message });

        

        for (const contactId of contactsArray) {        });    }

            try {

                if (message && !req.file) {});

                    await client.sendMessage(contactId, message);

                    results.push({ contact: contactId, status: 'Mesaj gönderildi' });        client.initialize();

                }

                        userClients.set(userId, client);// Mesaj gönder

                if (req.file) {

                    const media = MessageMedia.fromFilePath(req.file.path);        userAuthStatus.set(userId, false);app.post('/send', upload.single('photo'), async (req, res) => {

                    await client.sendMessage(contactId, media, { caption: message || '' });

                    results.push({ contact: contactId, status: 'Fotoğraf gönderildi' });    }    if (!isAuthenticated) {

                }

                            return res.json({ error: 'WhatsApp bağlı değil' });

                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (err) {    return userClients.get(userId);    }

                results.push({ contact: contactId, status: 'Hata: ' + err.message });

            }}    

        }

            const { selectedContacts, message } = req.body;

        if (req.file) {

            fs.unlink(req.file.path, (err) => {// Ana sayfa    

                if (err) console.error('Dosya silinemedi:', err);

            });app.get('/', (req, res) => {    // selectedContacts'i parse et

        }

            const userId = req.session.userId;    let contactsArray;

        res.json({ success: true, results });

    } catch (error) {    const isAuthenticated = userAuthStatus.get(userId) || false;    try {

        res.json({ error: error.message });

    }    const qrCode = userQRCodes.get(userId) || null;        contactsArray = JSON.parse(selectedContacts);

});

        } catch (e) {

// Çıkış yap

app.post('/logout', async (req, res) => {    res.render('index', {         return res.json({ error: 'Geçersiz kişi listesi' });

    const userId = req.session.userId;

    const client = userClients.get(userId);        authenticated: isAuthenticated,    }

    

    if (client) {        qrCode: qrCode,    

        try {

            await client.logout();        userId: userId.substring(0, 8) // İlk 8 karakter    if (!contactsArray || contactsArray.length === 0) {

            await client.destroy();

            userClients.delete(userId);    });        return res.json({ error: 'Kişi seçilmedi' });

            userAuthStatus.delete(userId);

            userQRCodes.delete(userId);});    }

            req.session.destroy();

            res.json({ success: true });    

        } catch (error) {

            res.json({ error: error.message });// QR Kod isteği    if (contactsArray.length > 10) {

        }

    } else {app.get('/qr', (req, res) => {        return res.json({ error: 'Maksimum 10 kişi seçebilirsiniz' });

        res.json({ success: true });

    }    const userId = req.session.userId;    }

});

        

// Durum kontrolü

app.get('/status', (req, res) => {    // Client başlat    if (!message && !req.file) {

    const userId = req.session.userId;

    res.json({     getUserClient(userId);        return res.json({ error: 'Mesaj veya fotoğraf göndermelisiniz' });

        authenticated: userAuthStatus.get(userId) || false,

        userId: userId.substring(0, 8)        }

    });

});    const qrCode = userQRCodes.get(userId);    



app.listen(port, () => {    const isAuthenticated = userAuthStatus.get(userId);    try {

    console.log('╔═══════════════════════════════════════════════╗');

    console.log('║  WhatsApp Toplu Mesaj - ÇOK KULLANICILI       ║');            const results = [];

    console.log('╚═══════════════════════════════════════════════╝');

    console.log(`📡 Server: http://localhost:${port}`);    if (qrCode) {        

    console.log(`👥 Her kullanıcı kendi hesabını bağlayabilir`);

    console.log(`🔒 Session: 24 saat`);        qrcode.toDataURL(qrCode, (err, url) => {        for (const contactId of contactsArray) {

    console.log(`📊 Aktif kullanıcı: ${userClients.size}`);

    console.log('═══════════════════════════════════════════════');            if (err) {            try {

});

                res.json({ error: err.message });                // Mesaj gönder

process.on('SIGINT', async () => {

    console.log('\n🛑 Kapatılıyor...');            } else {                if (message) {

    for (const [userId, client] of userClients) {

        try {                res.json({ qr: url });                    await client.sendMessage(contactId, message);

            await client.destroy();

            console.log(`✅ Temizlendi: ${userId.substring(0, 8)}`);            }                    results.push({ 

        } catch (error) {

            console.error(`❌ Hata: ${userId.substring(0, 8)}`);        });                        contact: contactId, 

        }

    }    } else if (isAuthenticated) {                        status: 'Mesaj gönderildi' 

    process.exit(0);

});        res.json({ authenticated: true });                    });


    } else {                }

        res.json({ qr: null, status: 'initializing' });                

    }                // Fotoğraf gönder

});                if (req.file) {

                    const media = MessageMedia.fromFilePath(req.file.path);

// Kişileri getir                    await client.sendMessage(contactId, media, { caption: message || '' });

app.get('/contacts', async (req, res) => {                    results.push({ 

    const userId = req.session.userId;                        contact: contactId, 

    const client = userClients.get(userId);                        status: 'Fotoğraf gönderildi' 

    const isAuthenticated = userAuthStatus.get(userId);                    });

                    }

    if (!client || !isAuthenticated) {                

        return res.json({ error: 'WhatsApp bağlı değil' });                // Mesajlar arası küçük gecikme (spam önleme)

    }                await new Promise(resolve => setTimeout(resolve, 1000));

                } catch (err) {

    try {                results.push({ 

        const chats = await client.getChats();                    contact: contactId, 

        const contacts = chats                    status: 'Hata: ' + err.message 

            .filter(chat => chat.isGroup === false)                });

            .map(chat => ({            }

                id: chat.id._serialized,        }

                name: chat.name || chat.id.user,        

                number: chat.id.user        // Yüklenen dosyayı sil

            }));        if (req.file) {

        res.json(contacts);            fs.unlink(req.file.path, (err) => {

    } catch (error) {                if (err) console.error('Dosya silinemedi:', err);

        res.json({ error: error.message });            });

    }        }

});        

        res.json({ success: true, results });

// Mesaj gönder    } catch (error) {

app.post('/send', upload.single('photo'), async (req, res) => {        res.json({ error: error.message });

    const userId = req.session.userId;    }

    const client = userClients.get(userId);});

    const isAuthenticated = userAuthStatus.get(userId);

    // Durum kontrolü

    if (!client || !isAuthenticated) {app.get('/status', (req, res) => {

        return res.json({ error: 'WhatsApp bağlı değil' });    res.json({ authenticated: isAuthenticated });

    }});

    

    const { selectedContacts, message } = req.body;// WhatsApp client'ı başlat

    client.initialize();

    let contactsArray;

    try {app.listen(port, () => {

        contactsArray = JSON.parse(selectedContacts);    console.log(`🚀 Server çalışıyor: http://localhost:${port}`);

    } catch (e) {    console.log('📱 WhatsApp bağlantısı için tarayıcıda QR kodu taratın');

        return res.json({ error: 'Geçersiz kişi listesi' });});

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
                    results.push({ 
                        contact: contactId, 
                        status: 'Mesaj gönderildi' 
                    });
                }
                
                if (req.file) {
                    const media = MessageMedia.fromFilePath(req.file.path);
                    await client.sendMessage(contactId, media, { caption: message || '' });
                    results.push({ 
                        contact: contactId, 
                        status: 'Fotoğraf gönderildi' 
                    });
                }
                
                // Spam önleme
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (err) {
                results.push({ 
                    contact: contactId, 
                    status: 'Hata: ' + err.message 
                });
            }
        }
        
        // Dosyayı sil
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

// Çıkış yap / Bağlantıyı kes
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
            
            // Session'ı temizle
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
    const isAuthenticated = userAuthStatus.get(userId) || false;
    res.json({ 
        authenticated: isAuthenticated,
        userId: userId.substring(0, 8)
    });
});

// Sunucu başlatma
app.listen(port, () => {
    console.log('═══════════════════════════════════════════════');
    console.log('🚀 WhatsApp Toplu Mesaj Gönderici - ÇOK KULLANICILI');
    console.log('═══════════════════════════════════════════════');
    console.log(`📡 Server: http://localhost:${port}`);
    console.log(`👥 Her kullanıcı kendi WhatsApp'ını bağlayabilir`);
    console.log(`🔒 Session tabanlı güvenli sistem`);
    console.log('═══════════════════════════════════════════════');
});

// Temizlik işlemi (uygulama kapanırken)
process.on('SIGINT', async () => {
    console.log('\n🛑 Sunucu kapatılıyor...');
    
    for (const [userId, client] of userClients) {
        try {
            await client.destroy();
            console.log(`✅ Client temizlendi: ${userId.substring(0, 8)}`);
        } catch (error) {
            console.error(`❌ Client temizleme hatası: ${userId.substring(0, 8)}`);
        }
    }
    
    process.exit(0);
});