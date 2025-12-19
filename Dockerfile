# Multi-stage build для оптимизации размера образа

# Stage 1: Frontend build
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./
# Устанавливаем зависимости (обновляем lockfile если нужно)
RUN yarn install

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
# Next.js standalone уже содержит все необходимое
COPY --from=frontend-builder /app/.next/standalone ./
COPY --from=frontend-builder /app/.next/static ./.next/static
COPY --from=frontend-builder /app/public ./public

# Создаем директорию для uploads
RUN mkdir -p uploads

# Переменные окружения по умолчанию
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
ENV NEXT_PUBLIC_VITE_API_URL=/api

# Открываем порт (Railway автоматически устанавливает PORT)
EXPOSE 8000

# Устанавливаем Node.js для запуска Next.js standalone server
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Запускаем Next.js standalone server и FastAPI параллельно
# Next.js на порту из PORT (Railway проксирует на него), FastAPI на порту 8000 (внутренний)
# Next.js обрабатывает фронтенд и проксирует /api на FastAPI через rewrites
CMD ["sh", "-c", "python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 & PORT=${PORT:-3000} node server.js"]

