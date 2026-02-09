@echo off
echo ========================================
echo 🍽️ ДОБАВЛЕНИЕ ТЕСТОВЫХ БЛЮД
echo ========================================

echo.
echo 1. Авторизация администратора...
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"login\":\"admin\",\"password\":\"admin123\"}" > login_response.json

echo.
echo 2. Извлекаем токен...
for /f "tokens=2 delims=:," %%a in ('type login_response.json ^| findstr "token"') do (
  set "token=%%a"
)
set "token=%token:"=%"
set "token=%token: =%"
echo Токен: %token:~0,20%...

echo.
echo 3. Добавляем тестовые блюда...

rem Завтраки
curl -X POST http://localhost:3000/api/meals ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %token%" ^
  -d "{\"name\":\"Омлет классический\",\"description\":\"С яйцом и молоком\",\"price\":120,\"category\":\"breakfast\",\"type\":\"main\",\"calories\":250,\"ingredients\":\"яйца, молоко, соль\",\"allergens\":\"яйца, молоко\",\"stock\":50}"
echo ✅ Омлет добавлен

curl -X POST http://localhost:3000/api/meals ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %token%" ^
  -d "{\"name\":\"Каша овсяная\",\"description\":\"С маслом и ягодами\",\"price\":90,\"category\":\"breakfast\",\"type\":\"main\",\"calories\":180,\"ingredients\":\"овсянка, молоко, масло, ягоды\",\"allergens\":\"молоко\",\"stock\":80}"
echo ✅ Каша добавлена

rem Обеды
curl -X POST http://localhost:3000/api/meals ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %token%" ^
  -d "{\"name\":\"Борщ\",\"description\":\"Свекольный суп со сметаной\",\"price\":190,\"category\":\"lunch\",\"type\":\"soup\",\"calories\":200,\"ingredients\":\"свекла, картофель, капуста, мясо\",\"allergens\":\"\",\"stock\":100}"
echo ✅ Борщ добавлен

curl -X POST http://localhost:3000/api/meals ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %token%" ^
  -d "{\"name\":\"Пюре с котлетой\",\"description\":\"Картофельное пюре с куриной котлетой\",\"price\":210,\"category\":\"lunch\",\"type\":\"main\",\"calories\":320,\"ingredients\":\"картофель, курица, молоко\",\"allergens\":\"молоко\",\"stock\":70}"
echo ✅ Пюре с котлетой добавлено

rem Напитки и десерты
curl -X POST http://localhost:3000/api/meals ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %token%" ^
  -d "{\"name\":\"Компот\",\"description\":\"Из сухофруктов\",\"price\":50,\"category\":\"lunch\",\"type\":\"drink\",\"calories\":80,\"ingredients\":\"сухофрукты, сахар\",\"allergens\":\"\",\"stock\":200}"
echo ✅ Компот добавлен

curl -X POST http://localhost:3000/api/meals ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %token%" ^
  -d "{\"name\":\"Шарлотка\",\"description\":\"Яблочный пирог\",\"price\":110,\"category\":\"lunch\",\"type\":\"dessert\",\"calories\":280,\"ingredients\":\"яблоки, мука, яйца, сахар\",\"allergens\":\"яйца, глютен\",\"stock\":40}"
echo ✅ Шарлотка добавлена

echo.
echo 4. Удаляем временный файл...
del login_response.json

echo.
echo ========================================
echo ✅ ГОТОВО! 6 тестовых блюд добавлено!
echo Проверь: http://localhost:3000/api/meals
echo ========================================
pause