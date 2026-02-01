#!/bin/bash
# 将棋の縁台 アクセス統計
echo "=== 将棋の縁台 アクセス統計 ==="
echo "$(date '+%Y-%m-%d %H:%M:%S')"
echo ""

LOG="/var/log/nginx/access.log"

if [ ! -f "$LOG" ]; then
  echo "ログファイルがありません"
  exit 1
fi

echo "📊 ページ別アクセス数（外部アクセスのみ）:"
grep -v "curl\|127.0.0.1\|45.76.49.140 - -.*curl" "$LOG" | \
  grep "GET /" | \
  awk '{print $7}' | \
  grep -v "/_next\|/favicon\|/manifest\|/icon\|/robots\|/sitemap" | \
  sort | uniq -c | sort -rn | head -10

echo ""
echo "👥 ユニークIP数:"
grep -v "127.0.0.1" "$LOG" | \
  grep "GET /" | \
  grep -v "/_next" | \
  awk '{print $1}' | sort -u | wc -l

echo ""
echo "📅 時間帯別アクセス:"
grep -v "127.0.0.1" "$LOG" | \
  grep "GET /" | \
  grep -v "/_next" | \
  awk '{print substr($4,14,2)":00"}' | sort | uniq -c | sort -rn | head -10

echo ""
echo "📱 User-Agent（上位5）:"
grep -v "curl\|127.0.0.1" "$LOG" | \
  awk -F'"' '{print $6}' | \
  sort | uniq -c | sort -rn | head -5
