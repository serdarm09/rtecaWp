# 🚀 Hızlı Başlangıç - Sunucuya Kurulum

## ⚡ Hızlı Kurulum (3 Komut)

```bash
# 1. Otomatik kurulum
chmod +x setup.sh
./setup.sh

# 2. Başlat
npm start
```

Hepsi bu! `http://sunucu-ip:3000` adresinden erişebilirsiniz.

---

## 🐳 Docker ile Kurulum (EN KOLAY - ÖNERİLEN)

```bash
# 1. Docker compose ile başlat
docker-compose up -d

# 2. Logları izle
docker-compose logs -f

# 3. Durdur
docker-compose down
```

**Avantajları:**
- ✅ Tüm bağımlılıklar hazır
- ✅ Sistem paketlerine gerek yok
- ✅ İzole çalışır
- ✅ Kolay yönetim

---

## 📋 Manuel Kurulum

### Adım 1: Sistem Paketleri (Linux)

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
    libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2
```

**CentOS/RHEL:**
```bash
sudo yum install -y nss nspr atk cups-libs gtk3 libXScrnSaver alsa-lib
```

### Adım 2: Node Bağımlılıkları

```bash
npm install
node node_modules/puppeteer/install.js
```

### Adım 3: Başlat

```bash
# Geliştirme
npm start

# Production (PM2)
npm install -g pm2
pm2 start server.js --name whatsapp
pm2 save
pm2 startup
```

---

## 🔧 Sorun Çözümleri

### Hata: `libnss3.so: cannot open shared object file`

```bash
# Çözüm 1: Sistem paketlerini yükle
./install-dependencies.sh

# Çözüm 2: Docker kullan
docker-compose up -d
```

### Hata: `Failed to launch browser`

```bash
# Chromium'u yeniden indir
rm -rf node_modules/puppeteer/.local-chromium
node node_modules/puppeteer/install.js
```

### Port zaten kullanımda

```bash
# Farklı port kullan
PORT=8080 npm start
```

---

## 🌐 Sunucu Yapılandırması

### Nginx Reverse Proxy

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

### SSL/HTTPS (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Firewall

```bash
# Port aç
sudo ufw allow 3000

# Veya Nginx kullanıyorsanız
sudo ufw allow 'Nginx Full'
```

---

## 📊 İzleme ve Yönetim

### PM2 ile

```bash
# Başlat
pm2 start server.js --name whatsapp

# Durumu gör
pm2 status

# Logları izle
pm2 logs whatsapp

# Yeniden başlat
pm2 restart whatsapp

# Durdur
pm2 stop whatsapp

# Otomatik başlatma
pm2 startup
pm2 save
```

### Docker ile

```bash
# Logları izle
docker-compose logs -f

# Durumu gör
docker-compose ps

# Yeniden başlat
docker-compose restart

# Durdur ve sil
docker-compose down

# Güncelleme
docker-compose pull
docker-compose up -d
```

---

## 🎯 Test Etme

```bash
# Sunucu çalışıyor mu?
curl http://localhost:3000

# Port dinliyor mu?
netstat -tulpn | grep 3000

# Chromium çalışıyor mu?
ps aux | grep chrome
```

---

## 📦 Yedekleme

### Önemli Dosyalar

```bash
# Auth verilerini yedekle
tar -czf backup-auth.tar.gz .wwebjs_auth/

# Tüm projeyi yedekle
tar -czf backup-full.tar.gz --exclude=node_modules --exclude=.git .
```

### Geri Yükleme

```bash
# Auth verilerini geri yükle
tar -xzf backup-auth.tar.gz

# Sunucuyu yeniden başlat
pm2 restart whatsapp
```

---

## ✅ Kontrol Listesi

- [ ] Node.js yüklü (v16+)
- [ ] Sistem bağımlılıkları yüklü
- [ ] npm install yapıldı
- [ ] Chromium indirildi
- [ ] Port açıldı (firewall)
- [ ] PM2 veya Docker ile başlatıldı
- [ ] Tarayıcıda açıldı ve test edildi
- [ ] QR kod tarandı
- [ ] Mesaj gönderme test edildi

---

## 🆘 Yardım

- **Detaylı dokümantasyon:** `README.md`
- **Chromium sorunları:** `CHROMIUM_FIX.md`
- **GitHub Issues:** Projenin GitHub sayfası

---

**Not:** Production ortamında mutlaka HTTPS kullanın ve güvenlik ayarlarını yapın!
