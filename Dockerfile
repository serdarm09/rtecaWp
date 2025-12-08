FROM node:18-slim

# Chromium ve bağımlılıklarını yükle
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Chromium'un environment değişkenlerini ayarla
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Çalışma dizini
WORKDIR /app

# Önce package.json'ı kopyala (cache için)
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm ci --only=production

# Uygulama dosyalarını kopyala
COPY . .

# Gerekli klasörleri oluştur
RUN mkdir -p uploads public .wwebjs_auth

# Port
EXPOSE 3000

# Kullanıcı oluştur (güvenlik için)
RUN useradd -m -u 1001 whatsapp && \
    chown -R whatsapp:whatsapp /app

USER whatsapp

# Başlat
CMD ["npm", "start"]
