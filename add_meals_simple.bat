@echo off
echo ========================================
echo 🍽️ ПРОСТОЕ ДОБАВЛЕНИЕ ТЕСТОВЫХ БЛЮД
echo ========================================

echo.
echo ВНИМАНИЕ! Сначала убедись что есть пользователь admin
echo Если нет - создай:
echo POST /api/auth/register {login:admin, password:admin123, role:admin}
echo.
pause

echo.
echo 1. Авторизация (вручную введи токен)...
echo.
set /p token="Введи токен админа (из ответа /api/auth/login): "

echo.
echo 2. Добавляем тестовые блюда...

echo.
echo 🍳 ЗАВТРАКИ:
curl -X POST http://localhost:3000/api/meals ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %token%" ^
  -d "{\"name\":\"Омлет\",\"description\":\"С яйцом и молоком\",\"price\":120,\"category\":\"breakfast\",\"type\":\"main\",\"calories\":250}"
echo.

curl -X POST http://localhost:3000/api/meals ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %token%" ^
  -d "{\"name\":\"Каша овсяная\",\"description\":\"С ягодами\",\"price\":90,\"category\":\"breakfast\",\"type\":\"main\",\"calories\":180}"
echo.

echo.
echo 🍲 ОБЕДЫ:
curl -X POST http://localhost:3000/api/meals ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %token%" ^
  -d "{\"name\":\"Борщ\",\"description\":\"Свекольный суп\",\"price\":190,\"category\":\"lunch\",\"type\":\"soup\",\"calories\":200}"
echo.

curl -X POST http://localhost:3000/api/meals ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %token%" ^
  -d "{\"name\":\"Котлета с пюре\",\"description\":\"Куриная котлета\",\"price\":210,\"category\":\"lunch\",\"type\":\"main\",\"calories\":320}"
echo.

echo.
echo 🍰 ДЕСЕРТЫ:
curl -X POST http://localhost:3000/api/meals ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %token%" ^
  -d "{\"name\":\"Шарлотка\",\"description\":\"Яблочный пирог\",\"price\":110,\"category\":\"lunch\",\"type\":\"dessert\",\"calories\":280}"
echo.

echo.
echo ========================================
echo ✅ Команды отправлены!
echo.
echo Проверь блюда: http://localhost:3000/api/meals
echo Или меню: http://localhost:3000/api/meals/today
echo ========================================
pause