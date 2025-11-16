FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache openssl

WORKDIR /app

# Criar diretório de logs
RUN mkdir -p /app/logs

# Copiar e instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar código e gerar Prisma
COPY . .
RUN npx prisma generate && npm run build

EXPOSE 3000

# Script para sincronizar schema e iniciar a aplicação
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm run start:prod"]
