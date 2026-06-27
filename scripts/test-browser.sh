#!/usr/bin/env bash
#
# Запуск выделенного браузера для тестирования расширения через Chrome DevTools MCP.
#
# Использует Google Chrome for Developers (Dev-канал) с ОТДЕЛЬНЫМ профилем и
# remote-debugging-портом 9222 — к нему подключается chrome-devtools-mcp
# (см. .mcp.json). Основной Google Chrome при этом остаётся свободным.
#
# ВАЖНО про расширение:
# В брендированном Google Chrome (включая Dev-канал) флаг --load-extension
# запрещён ("--load-extension is not allowed in Google Chrome, ignoring").
# Поэтому расширение грузится ОДИН РАЗ вручную и остаётся в этом профиле навсегда:
#   1) открой chrome://extensions
#   2) включи "Developer mode" (правый верхний угол)
#   3) "Load unpacked" -> выбери папку dist этого репозитория
# После пересборки dist жми кнопку перезагрузки на карточке расширения
# и обнови вкладку SmartSender.
#
set -euo pipefail

CHROME="/Applications/Google Chrome Dev.app/Contents/MacOS/Google Chrome Dev"
PORT=9222
PROFILE="$HOME/.mysmart-test-chrome"           # отдельный профиль, логин сохраняется
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXT_DIR="$REPO_DIR/dist"

if [ ! -x "$CHROME" ]; then
  echo "❌ Не найден Chrome for Developers: $CHROME"
  echo "   Установить: brew install --cask google-chrome@dev"
  exit 1
fi

if [ ! -d "$EXT_DIR/icons" ] || [ ! -f "$EXT_DIR/manifest.json" ]; then
  echo "⚠️  В $EXT_DIR нет собранного расширения (manifest.json). Сначала собери проект."
fi

# Если этот профиль уже запущен — флаги не применятся к новому окну.
if pgrep -f "user-data-dir=$PROFILE" >/dev/null 2>&1; then
  echo "ℹ️  Тестовый Chrome Dev уже запущен (профиль $PROFILE)."
  echo "    Чтобы перезапустить с обновлёнными флагами — закрой его и запусти скрипт снова."
  exit 0
fi

echo "🚀 Запускаю Chrome Dev для тестирования:"
echo "    порт отладки : $PORT"
echo "    профиль      : $PROFILE"
echo "    расширение   : $EXT_DIR"

exec "$CHROME" \
  --remote-debugging-port="$PORT" \
  --user-data-dir="$PROFILE" \
  --no-first-run \
  --no-default-browser-check \
  "https://console.smartsender.com/" \
  >/dev/null 2>&1 &
