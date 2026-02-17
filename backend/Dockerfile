FROM node:18-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy remaining source code
COPY . .

# Remove any accidental .env if present
RUN rm -f .env || true

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]
