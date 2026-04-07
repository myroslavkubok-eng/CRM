#!/bin/bash

# 🚀 Автоматический Push в GitHub (Bash)
# Запустите: ./push.sh

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

echo -e "${MAGENTA}🚀 Katia Platform - Auto Push to GitHub${NC}"
echo -e "${MAGENTA}========================================${NC}"
echo ""

# Проверка что находимся в git репозитории
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Ошибка: Это не Git репозиторий!${NC}"
    echo -e "${YELLOW}   Перейдите в папку проекта и попробуйте снова.${NC}"
    exit 1
fi

# Показать статус
echo -e "${CYAN}📊 Git статус:${NC}"
git status --short

echo ""
echo -e "${CYAN}📦 Файлы для коммита:${NC}"

# Добавить все изменения
git add .

# Получить список staged файлов
STAGED_FILES=$(git diff --cached --name-only)
if [ -n "$STAGED_FILES" ]; then
    echo "$STAGED_FILES" | while read -r file; do
        echo -e "${GREEN}   ✅ $file${NC}"
    done
else
    echo -e "${YELLOW}   ⚠️  Нет изменений для коммита${NC}"
    echo ""
    echo -e "${GREEN}✨ Всё уже в актуальном состоянии!${NC}"
    exit 0
fi

echo ""

# Генерация commit сообщения с датой
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
COMMIT_MESSAGE="🚀 Auto Deploy: Update from Figma Make ($TIMESTAMP)"

echo -e "${CYAN}💬 Commit сообщение:${NC}"
echo -e "${WHITE}   $COMMIT_MESSAGE${NC}"
echo ""

# Коммит
echo -e "${CYAN}📝 Создание коммита...${NC}"
git commit -m "$COMMIT_MESSAGE"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при создании коммита!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Коммит создан успешно!${NC}"
echo ""

# Push в GitHub
echo -e "${CYAN}🚀 Push в GitHub...${NC}"
echo ""

git push origin main

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Ошибка при push!${NC}"
    echo ""
    echo -e "${YELLOW}💡 Возможные причины:${NC}"
    echo -e "${WHITE}   1. Нет подключения к интернету${NC}"
    echo -e "${WHITE}   2. Неправильные credentials для GitHub${NC}"
    echo -e "${WHITE}   3. Нет прав доступа к репозиторию${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Попробуйте:${NC}"
    echo -e "${WHITE}   git config --global credential.helper store${NC}"
    echo -e "${WHITE}   git push origin main${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ ✅ ✅ УСПЕШНО! ✅ ✅ ✅${NC}"
echo ""
echo -e "${MAGENTA}🎉 Изменения запушены в GitHub!${NC}"
echo ""
echo -e "${CYAN}📍 Следующий шаг:${NC}"
echo -e "${WHITE}   Откройте GitHub Actions для проверки деплоя:${NC}"
echo -e "${BLUE}   https://github.com/YOUR_USERNAME/Katiabooking/actions${NC}"
echo ""
echo -e "${YELLOW}⏱️  Деплой займёт ~2-3 минуты${NC}"
echo ""
echo -e "${CYAN}🌐 После деплоя сайт будет доступен:${NC}"
echo -e "${BLUE}   https://YOUR_USERNAME.github.io/Katiabooking/${NC}"
echo ""
echo -e "${MAGENTA}💜 Katia Platform - успешно обновлён!${NC}"
echo ""
