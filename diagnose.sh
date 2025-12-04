#!/bin/bash
echo "📊 DIAGNÓSTICO DO VPS"
echo "--------------------------------"
echo "1. Status do Nginx:"
systemctl status nginx --no-pager | head -n 10
echo ""
echo "2. Status do PocketBase:"
systemctl status pocketbase --no-pager | head -n 10
echo ""
echo "3. Portas Ouvindo (80/443/8090):"
ss -tuln | grep -E ":80|:443|:8090"
echo ""
echo "4. Firewall (UFW):"
ufw status
echo ""
echo "5. Teste Local (curl localhost):"
curl -I http://localhost 2>/dev/null | head -n 1
echo "--------------------------------"
