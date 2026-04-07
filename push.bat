@echo off
REM 🚀 Автоматический Push в GitHub (Windows Batch)
REM Запустите двойным кликом или из cmd: push.bat

chcp 65001 >nul
color 0D

echo.
echo ========================================
echo 🚀 Katia Platform - Auto Push to GitHub
echo ========================================
echo.

REM Проверка git репозитория
if not exist ".git" (
    echo ❌ Ошибка: Это не Git репозиторий!
    echo    Перейдите в папку проекта и попробуйте снова.
    pause
    exit /b 1
)

REM Показать статус
echo 📊 Git статус:
git status --short
echo.

echo 📦 Добавление файлов...
git add .

REM Генерация commit сообщения
set timestamp=%date:~-4%-%date:~3,2%-%date:~0,2% %time:~0,8%
set commit_msg=🚀 Auto Deploy: Update from Figma Make (%timestamp%)

echo.
echo 💬 Commit сообщение:
echo    %commit_msg%
echo.

echo 📝 Создание коммита...
git commit -m "%commit_msg%"

if errorlevel 1 (
    if errorlevel 2 (
        echo ❌ Ошибка при создании коммита!
        pause
        exit /b 1
    ) else (
        echo ⚠️  Нет изменений для коммита
        echo ✨ Всё уже в актуальном состоянии!
        pause
        exit /b 0
    )
)

echo ✅ Коммит создан успешно!
echo.

echo 🚀 Push в GitHub...
echo.
git push origin main

if errorlevel 1 (
    echo.
    echo ❌ Ошибка при push!
    echo.
    echo 💡 Возможные причины:
    echo    1. Нет подключения к интернету
    echo    2. Неправильные credentials для GitHub
    echo    3. Нет прав доступа к репозиторию
    echo.
    pause
    exit /b 1
)

echo.
color 0A
echo ✅✅✅ УСПЕШНО! ✅✅✅
echo.
echo 🎉 Изменения запушены в GitHub!
echo.
echo 📍 Следующий шаг:
echo    Откройте GitHub Actions для проверки деплоя:
echo    https://github.com/YOUR_USERNAME/Katiabooking/actions
echo.
echo ⏱️  Деплой займёт ~2-3 минуты
echo.
echo 🌐 После деплоя сайт будет доступен:
echo    https://YOUR_USERNAME.github.io/Katiabooking/
echo.
echo 💜 Katia Platform - успешно обновлён!
echo.
pause
