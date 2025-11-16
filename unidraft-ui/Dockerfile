FROM node:18-alpine

WORKDIR /app

# Copiar e instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar código e fazer build
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
