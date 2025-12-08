# Chromium Hata Çözümü - Linux Sunucu

## Hata: `libnss3.so: cannot open shared object file`

Bu hata, Linux sunucusunda Chromium'un çalışması için gerekli sistem kütüphanelerinin eksik olduğunu gösterir.

## 🔧 Hızlı Çözüm

### Ubuntu/Debian Sunucular için:

```bash
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    wget \
    xdg-utils
```

### CentOS/RHEL Sunucular için:

```bash
sudo yum install -y \
    alsa-lib \
    atk \
    cups-libs \
    gtk3 \
    libXcomposite \
    libXcursor \
    libXdamage \
    libXext \
    libXi \
    libXrandr \
    libXScrnSaver \
    libXtst \
    pango \
    xorg-x11-fonts-100dpi \
    xorg-x11-fonts-75dpi \
    xorg-x11-fonts-cyrillic \
    xorg-x11-fonts-misc \
    xorg-x11-fonts-Type1 \
    xorg-x11-utils \
    nss \
    nspr
```

## 📝 Otomatik Kurulum

Proje klasöründeki `install-dependencies.sh` dosyasını çalıştırın:

```bash
chmod +x install-dependencies.sh
./install-dependencies.sh
```

## 🔍 Sorun Devam Ederse

### 1. Chromium'u Manuel Test Edin

```bash
/root/whatsapp/rtecaWp/node_modules/puppeteer/node_modules/puppeteer-core/.local-chromium/linux-1045629/chrome-linux/chrome --version
```

### 2. Eksik Kütüphaneleri Kontrol Edin

```bash
ldd /root/whatsapp/rtecaWp/node_modules/puppeteer/node_modules/puppeteer-core/.local-chromium/linux-1045629/chrome-linux/chrome | grep "not found"
```

### 3. Alternatif: Docker Kullanın

Docker ile çalıştırırsanız tüm bağımlılıklar otomatik gelir:

```dockerfile
FROM node:18

# Chromium bağımlılıklarını yükle
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t whatsapp-bulk .
docker run -p 3000:3000 whatsapp-bulk
```

## 🚀 Kurulum Sonrası

Bağımlılıkları yükledikten sonra:

```bash
# Node modüllerini yeniden yükle (opsiyonel)
npm install

# Chromium'u indir
node node_modules/puppeteer/install.js

# Sunucuyu başlat
npm start
```

## ⚠️ Önemli Notlar

- **Root olarak çalıştırmayın**: Puppeteer root kullanıcı ile çalışmaz
- **Çözüm**: `--no-sandbox` bayrağı kullanın (zaten kodda var)
- **RAM**: Minimum 1GB RAM gerekli
- **CPU**: Her kullanıcı için ayrı Chromium instance açılır

## 🛡️ Güvenlik

`--no-sandbox` kullanıyorsanız, güvenlik için:
- Güvenilmeyen kullanıcılara erişim vermeyin
- Firewall kuralları ayarlayın
- Docker container içinde çalıştırın (önerilen)
