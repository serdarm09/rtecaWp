#!/bin/bash

echo "═══════════════════════════════════════════════"
echo "  WhatsApp Toplu Mesaj - Hızlı Kurulum"
echo "═══════════════════════════════════════════════"
echo ""

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Node.js kontrolü
echo "📋 Node.js kontrol ediliyor..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js bulunamadı!${NC}"
    echo "Node.js kurulumu: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

# 2. npm bağımlılıklarını yükle
echo ""
echo "📦 npm bağımlılıkları yükleniyor..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install başarısız!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Bağımlılıklar yüklendi${NC}"

# 3. Chromium'u indir
echo ""
echo "🌐 Chromium indiriliyor..."
node node_modules/puppeteer/install.js
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️ Chromium indirme başarısız, devam ediliyor...${NC}"
fi

# 4. Linux sistem bağımlılıkları
echo ""
echo "🔧 Sistem bağımlılıkları kontrol ediliyor..."

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Linux tespit edildi, sistem paketleri kontrol ediliyor..."
    
    # Ubuntu/Debian
    if command -v apt-get &> /dev/null; then
        echo "Ubuntu/Debian sistemi"
        echo -e "${YELLOW}Chromium bağımlılıkları yükleniyor (sudo gerekli)...${NC}"
        
        sudo apt-get update
        sudo apt-get install -y \
            libnss3 \
            libnspr4 \
            libatk1.0-0 \
            libatk-bridge2.0-0 \
            libcups2 \
            libdrm2 \
            libxkbcommon0 \
            libxcomposite1 \
            libxdamage1 \
            libxfixes3 \
            libxrandr2 \
            libgbm1 \
            libpango-1.0-0 \
            libcairo2 \
            libasound2 \
            libxss1 \
            fonts-liberation
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Sistem bağımlılıkları yüklendi${NC}"
        else
            echo -e "${RED}❌ Sistem bağımlılıkları yüklenemedi!${NC}"
            echo "Manuel yükleme için: ./install-dependencies.sh"
        fi
    
    # CentOS/RHEL
    elif command -v yum &> /dev/null; then
        echo "CentOS/RHEL sistemi"
        echo -e "${YELLOW}Chromium bağımlılıkları yükleniyor (sudo gerekli)...${NC}"
        
        sudo yum install -y \
            nss \
            nspr \
            atk \
            cups-libs \
            gtk3 \
            libXScrnSaver \
            alsa-lib
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Sistem bağımlılıkları yüklendi${NC}"
        else
            echo -e "${RED}❌ Sistem bağımlılıkları yüklenemedi!${NC}"
        fi
    fi
else
    echo "Windows/Mac tespit edildi, sistem paketleri atlanıyor"
fi

# 5. Gerekli klasörleri oluştur
echo ""
echo "📁 Klasörler oluşturuluyor..."
mkdir -p uploads public

# 6. Test
echo ""
echo "🧪 Kurulum testi..."
if [ -f "server.js" ]; then
    echo -e "${GREEN}✅ server.js bulundu${NC}"
else
    echo -e "${RED}❌ server.js bulunamadı!${NC}"
    exit 1
fi

# Başarılı
echo ""
echo "═══════════════════════════════════════════════"
echo -e "${GREEN}✅ KURULUM TAMAMLANDI!${NC}"
echo "═══════════════════════════════════════════════"
echo ""
echo "🚀 Sunucuyu başlatmak için:"
echo "   npm start"
echo ""
echo "🐳 Docker ile çalıştırmak için:"
echo "   docker-compose up -d"
echo ""
echo "📖 Daha fazla bilgi: README.md"
echo "🔧 Sorun giderme: CHROMIUM_FIX.md"
echo ""
