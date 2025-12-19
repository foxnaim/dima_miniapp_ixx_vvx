# Multi-stage build для оптимизации размера образа

# Stage 1: Frontend build
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Копируем исходники фронтенда
COPY . .

# Собираем Next.js приложение
RUN yarn build

# Stage 2: Backend + Frontend
FROM python:3.11-slim AS backend

WORKDIR /app

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Копируем requirements.txt и устанавливаем Python зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем бэкенд
COPY backend/ ./backend/

# Копируем собранный фронтенд из предыдущего stage
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/package.json ./package.json
COPY --from=frontend-builder /app/node_modules ./node_modules

# Создаем директорию для uploads
RUN mkdir -p uploads

# Переменные окружения по умолчанию
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
ENV NEXT_PUBLIC_VITE_API_URL=/api
ENV NEXT_PUBLIC_VITE_PUBLIC_URL=http://localhost:8000

# Открываем порт
EXPOSE 8000

# Устанавливаем Node.js для запуска Next.js standalone server
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Запускаем Next.js на порту 3000 и бэкенд на порту 8000
# В production используйте nginx для проксирования или настройте rewrites в Next.js
CMD ["sh", "-c", "node_modules/.bin/next start -p 3000 & python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000"]

