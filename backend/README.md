# FurnitureSpace Backend API

Бэкенд для приложения FurnitureSpace, построенный с использованием чистой архитектуры на ASP.NET Core и Entity Framework Core с PostgreSQL.

## Архитектура

Проект организован по принципам Clean Architecture:

- **FurnitureSpace.Domain** - Сущности и интерфейсы бизнес-логики
- **FurnitureSpace.Application** - Use cases, DTOs, сервисы и маппинг
- **FurnitureSpace.Infrastructure** - Реализация репозиториев, DbContext
- **FurnitureSpace.API** - Web API контроллеры и конфигурация

## Требования

- .NET 8.0 SDK
- PostgreSQL 12+

## Настройка

1. **Клонируйте репозиторий и перейдите в папку backend:**
   ```bash
   cd backend
   ```

2. **Настройте строку подключения к базе данных:**
   
   Отредактируйте файл `FurnitureSpace.API/appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=furniture_space;Username=your_username;Password=your_password"
     }
   }
   ```

3. **Восстановите пакеты:**
   ```bash
   dotnet restore
   ```

4. **Убедитесь, что база данных PostgreSQL запущена и содержит таблицы:**
   
   Ваша база данных должна содержать таблицы `categories` и `products` со структурой, описанной в вашем запросе.

## Запуск

1. **Запустите API:**
   ```bash
   dotnet run --project FurnitureSpace.API
   ```

2. **API будет доступно по адресу:**
   - HTTP: `http://localhost:5000`
   - HTTPS: `https://localhost:5001`
   - Swagger UI: `https://localhost:5001/swagger`

## API Endpoints

### Categories
- `GET /api/categories` - Получить все категории
- `GET /api/categories/{id}` - Получить категорию по ID
- `GET /api/categories/slug/{slug}` - Получить категорию по slug
- `GET /api/categories/with-products` - Получить категории с продуктами
- `POST /api/categories` - Создать новую категорию
- `PUT /api/categories/{id}` - Обновить категорию
- `DELETE /api/categories/{id}` - Удалить категорию

### Products
- `GET /api/products` - Получить все продукты
- `GET /api/products/{id}` - Получить продукт по ID
- `GET /api/products/category/{categoryId}` - Получить продукты по категории
- `GET /api/products/featured` - Получить рекомендуемые продукты
- `GET /api/products/new` - Получить новые продукты
- `GET /api/products/in-stock` - Получить продукты в наличии
- `GET /api/products/search?searchTerm={term}` - Поиск продуктов
- `GET /api/products/price-range?minPrice={min}&maxPrice={max}` - Продукты по ценовому диапазону
- `POST /api/products` - Создать новый продукт
- `PUT /api/products/{id}` - Обновить продукт
- `DELETE /api/products/{id}` - Удалить продукт

## CORS

API настроен для работы с React приложениями на портах:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)

## Структура базы данных

API работает с существующими таблицами:

### Categories
- `id` (integer, primary key)
- `name` (varchar(100), not null)
- `slug` (varchar(100), not null)
- `created_at` (timestamp)

### Products
- `id` (integer, primary key)
- `name` (varchar(255), not null)
- `price` (decimal(10,2), not null)
- `discount` (integer, default 0)
- `image` (varchar(255))
- `category` (varchar(100))
- `category_id` (integer, foreign key)
- `rating` (decimal(3,1), default 0)
- `is_new` (boolean, default false)
- `in_stock` (boolean, default true)
- `description` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `is_featured` (boolean, default false)
- `images` (text[])
- `colors` (jsonb)

## Разработка

Для разработки используйте:

```bash
dotnet watch run --project FurnitureSpace.API
```

Это обеспечит автоматическую перезагрузку при изменении кода. 