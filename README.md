# WhatsApp Toplu Mesaj Gönderici - ÇOK KULLANICILI ✨

Bu uygulama, **birden fazla kullanıcının** aynı anda kendi WhatsApp hesaplarını bağlamalarını ve seçtikleri kişilere toplu mesaj veya fotoğraf göndermelerini sağlar.

## 🚀 Özellikler

### 👥 Çok Kullanıcılı Sistem
- **Her kullanıcı kendi WhatsApp hesabını bağlar**
- Session tabanlı izolasyon (24 saat)
- Kullanıcılar birbirinden bağımsız çalışır
- Sunucuda merkezi olarak çalışır

### 📱 WhatsApp Özellikleri
- QR kod ile kolay bağlantı
- Kişi listeleme
- Toplu mesaj gönderme (maksimum 10 kişi)
- Fotoğraf gönderme
- WhatsApp Business gerekmez

### 🔒 Güvenlik
- Her kullanıcı için ayrı session
- Her kullanıcı için ayrı auth dosyaları
- Her kullanıcı için ayrı upload klasörü
- Otomatik dosya temizleme

## 📦 Kurulum

### 1. Gereksinimler
- Node.js v16 veya üzeri
- npm veya yarn
- **Linux Sunucu için:** Chromium bağımlılıkları (otomatik yüklenir)

### 2. Bağımlılıkları Yükle
```bash
npm install
```

### 3. Linux Sunucuda: Chromium Bağımlılıklarını Yükle

**Otomatik (önerilen):**
```bash
chmod +x install-dependencies.sh
./install-dependencies.sh
```

**Manuel (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
    libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2
```

**Manuel (CentOS/RHEL):**
```bash
sudo yum install -y nss nspr atk cups-libs gtk3 libXScrnSaver alsa-lib
```

### 4. Sunucuyu Başlat
```bash
npm start
```

Sunucu `http://localhost:3000` adresinde çalışacak.

### 5. Docker ile Çalıştırma (En Kolay - Önerilen)

Tüm bağımlılıklar Docker image'inde hazır gelir:

```bash
# Docker Compose ile
docker-compose up -d

# Veya Docker ile manuel
docker build -t whatsapp-bulk .
docker run -d -p 3000:3000 \
    -v $(pwd)/uploads:/app/uploads \
    -v $(pwd)/.wwebjs_auth:/app/.wwebjs_auth \
    whatsapp-bulk
```

### 6. Sunucuda Çalıştırma (Production)
```bash
# PM2 ile çalıştırma (önerilen)
npm install -g pm2
pm2 start server.js --name "whatsapp-bulk"
pm2 save
pm2 startup

# Veya screen ile
screen -S whatsapp
npm start
# Ctrl+A+D ile çık
```

## 💻 Kullanım

### Adım 1: Tarayıcıda Aç
Sunucu adresine git: `http://sunucu-ip:3000`

### Adım 2: WhatsApp Bağla
- QR kodu telefonunuzla taratın
- WhatsApp Web'den QR kod okutun

### Adım 3: Kişileri Yükle
- "Kişileri Yükle" butonuna tıklayın
- İstediğiniz kişileri seçin (maks 10)

### Adım 4: Mesaj Gönder
- Mesaj yazın veya fotoğraf yükleyin
- "Gönder" butonuna tıklayın
- Sonuçları görün

## 🌐 Sunucuya Yükleme

### VPS/Bulut Sunucu için:

```bash
# Sunucuya bağlan
ssh kullanici@sunucu-ip

# Proje klasörü oluştur
mkdir whatsapp-bulk
cd whatsapp-bulk

# Dosyaları yükle (FTP/SCP ile)
# Veya git clone

# Bağımlılıkları yükle
npm install

# Chromium'u indir
node node_modules/puppeteer/install.js

# Port ayarı (opsiyonel)
export PORT=3000

# PM2 ile başlat
pm2 start server.js --name whatsapp-bulk
pm2 save
pm2 startup

# Firewall'da port aç
sudo ufw allow 3000
```

### Nginx Reverse Proxy (önerilen):

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Nasıl Çalışır?

### Session Sistemi
1. Her kullanıcı siteye girdiğinde benzersiz bir **session ID** alır
2. Bu ID cookie'de saklanır (24 saat)
3. Her kullanıcı için ayrı:
   - WhatsApp client instance
   - QR kod
   - Auth dosyaları (`.wwebjs_auth/user-id/`)
   - Upload klasörü (`uploads/user-id/`)

### Çok Kullanıcı Desteği
```
User 1 (Session: abc123)
├── WhatsApp Client 1
├── Auth: .wwebjs_auth/abc123/
└── Uploads: uploads/abc123/

User 2 (Session: xyz789)
├── WhatsApp Client 2
├── Auth: .wwebjs_auth/xyz789/
└── Uploads: uploads/xyz789/
```

## ⚙️ Yapılandırma

### Port Değiştirme
```javascript
// server.js
const port = process.env.PORT || 3000;
```

Veya:
```bash
PORT=8080 npm start
```

### Session Süresi Değiştirme
```javascript
// server.js - session middleware
cookie: { 
    maxAge: 24 * 60 * 60 * 1000  // 24 saat (milisaniye)
}
```

### Maksimum Kişi Sayısını Değiştirme
```javascript
// server.js - /send route
if (contactsArray.length > 10) {  // Burayı değiştir
    return res.json({ error: 'Maksimum 10 kişi' });
}
```

## 📁 Proje Yapısı
```
whatsapp-bulk/
├── server.js              # Ana sunucu dosyası
├── package.json           # Bağımlılıklar
├── views/
│   └── index.ejs          # Web arayüzü
├── public/                # Statik dosyalar
├── uploads/               # Kullanıcı upload klasörleri
│   ├── user-id-1/
│   └── user-id-2/
├── .wwebjs_auth/          # WhatsApp auth dosyaları
│   ├── user-id-1/
│   └── user-id-2/
└── README.md              # Bu dosya
```

## 🛡️ Güvenlik Notları

1. **Production'da mutlaka HTTPS kullanın**
2. Session secret'ı güçlü yapın
3. Rate limiting ekleyin (isteğe bağlı)
4. Firewall kuralları ayarlayın
5. Düzenli yedek alın (özellikle `.wwebjs_auth/`)

## ⚠️ Önemli Uyarılar

- Bu uygulama **resmi WhatsApp API'sini KULLANMAZ**
- WhatsApp Web protokolünü kullanır
- WhatsApp'ın kullanım şartlarına dikkat edin
- **SPAM yapmayın** - hesabınız banlanabilir
- Kendi sorumluluğunuzda kullanın
- Ticari kullanım için WhatsApp Business API önerilir

## 🐛 Sorun Giderme

### "libnss3.so: cannot open shared object file"
Bu Linux sunucularda Chromium bağımlılıkları eksik olduğunda oluşur:

```bash
# Ubuntu/Debian
sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
    libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2

# CentOS/RHEL
sudo yum install -y nss nspr atk cups-libs gtk3 libXScrnSaver alsa-lib
```

Detaylı çözüm için `CHROMIUM_FIX.md` dosyasına bakın.

### "Cannot connect to WhatsApp"
- Chromium'un yüklendiğinden emin olun
- `node node_modules/puppeteer/install.js` çalıştırın

### Session kayboldu
- Cookie'ler temizlenmiş olabilir
- 24 saat süresi dolmuş olabilir
- Yeniden QR kod taratın

### Mesajlar gönderilmiyor
- WhatsApp bağlantısını kontrol edin
- Telefon internete bağlı mı?
- WhatsApp Web aktif mi?

## 📝 Lisans

Bu proje eğitim amaçlıdır. Ticari kullanım için uygun değildir.
