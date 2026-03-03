FROM node:18-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm ci --omit=dev

# Copy app source
COPY . .

# Remove accidental .env if present
RUN rm -f .env || true

ENV NODE_ENV=production

# Change ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

CMD ["node", "server.js"]