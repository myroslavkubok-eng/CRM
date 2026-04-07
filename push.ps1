# 🚀 Автоматический Push в GitHub (PowerShell)
# Запустите: .\push.ps1

Write-Host "🚀 Katia Platform - Auto Push to GitHub" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Проверка что находимся в git репозитории
if (-Not (Test-Path ".git")) {
    Write-Host "❌ Ошибка: Это не Git репозиторий!" -ForegroundColor Red
    Write-Host "   Перейдите в папку проекта и попробуйте снова." -ForegroundColor Yellow
    exit 1
}

# Показать статус
Write-Host "📊 Git статус:" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "📦 Файлы для коммита:" -ForegroundColor Cyan

# Добавить все изменения
git add .

# Получить список staged файлов
$stagedFiles = git diff --cached --name-only
if ($stagedFiles) {
    $stagedFiles | ForEach-Object { Write-Host "   ✅ $_" -ForegroundColor Green }
} else {
    Write-Host "   ⚠️  Нет изменений для коммита" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "✨ Всё уже в актуальном состоянии!" -ForegroundColor Green
    exit 0
}

Write-Host ""

# Генерация commit сообщения с датой
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "🚀 Auto Deploy: Update from Figma Make ($timestamp)"

Write-Host "💬 Commit сообщение:" -ForegroundColor Cyan
Write-Host "   $commitMessage" -ForegroundColor White
Write-Host ""

# Коммит
Write-Host "📝 Создание коммита..." -ForegroundColor Cyan
git commit -m "$commitMessage"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка при создании коммита!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Коммит создан успешно!" -ForegroundColor Green
Write-Host ""

# Push в GitHub
Write-Host "🚀 Push в GitHub..." -ForegroundColor Cyan
Write-Host ""

git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Ошибка при push!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Возможные причины:" -ForegroundColor Yellow
    Write-Host "   1. Нет подключения к интернету" -ForegroundColor White
    Write-Host "   2. Неправильные credentials для GitHub" -ForegroundColor White
    Write-Host "   3. Нет прав доступа к репозиторию" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Попробуйте:" -ForegroundColor Yellow
    Write-Host "   git config --global credential.helper wincred" -ForegroundColor White
    Write-Host "   git push origin main" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "✅ ✅ ✅ УСПЕШНО! ✅ ✅ ✅" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Изменения запушены в GitHub!" -ForegroundColor Magenta
Write-Host ""
Write-Host "📍 Следующий шаг:" -ForegroundColor Cyan
Write-Host "   Откройте GitHub Actions для проверки деплоя:" -ForegroundColor White
Write-Host "   https://github.com/YOUR_USERNAME/Katiabooking/actions" -ForegroundColor Blue
Write-Host ""
Write-Host "⏱️  Деплой займёт ~2-3 минуты" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 После деплоя сайт будет доступен:" -ForegroundColor Cyan
Write-Host "   https://YOUR_USERNAME.github.io/Katiabooking/" -ForegroundColor Blue
Write-Host ""
Write-Host "💜 Katia Platform - успешно обновлён!" -ForegroundColor Magenta
Write-Host ""
