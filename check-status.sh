#!/bin/bash

echo "═══════════════════════════════════════════════"
echo "  WhatsApp Toplu Mesaj - Durum Kontrolü"
echo "═══════════════════════════════════════════════"
echo ""

# Container durumu
echo "📦 Container Durumu:"
docker-compose ps

echo ""
echo "─────────────────────────────────────────────"
echo ""

# Logları göster
echo "📋 Son 20 Log Satırı:"
docker-compose logs --tail=20 whatsapp-bulk

echo ""
echo "─────────────────────────────────────────────"
echo ""

# IP adresini bul
echo "🌐 Sunucu IP Adresi:"
hostname -I | awk '{print $1}'

echo ""
echo "─────────────────────────────────────────────"
echo ""

# Port kontrolü
echo "🔌 Port Kontrolü:"
netstat -tulpn | grep :3000 || ss -tulpn | grep :3000

echo ""
echo "═══════════════════════════════════════════════"
echo "✅ Erişim Bilgileri:"
echo "═══════════════════════════════════════════════"
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "🌍 Tarayıcıda açın: http://${SERVER_IP}:3000"
echo ""
echo "📊 Logları canlı izle: docker-compose logs -f"
echo "🔄 Yeniden başlat: docker-compose restart"
echo "🛑 Durdur: docker-compose down"
echo "═══════════════════════════════════════════════"
