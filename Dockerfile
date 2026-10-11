# Multi-stage Dockerfile for Cloud Run
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.11-slim
WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir fastapi uvicorn pydantic requests google-genai

# Copy backend
COPY server/ ./server/
# Copy prebuilt frontend dist
COPY --from=frontend-builder /app/dist ./dist

WORKDIR /app/server
ENV PORT=8080
EXPOSE 8080

CMD ["python", "main.py"]
