# Integravity Production Dockerfile
# Optimized for Node.js, security, and scalability.

FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build application
COPY . .
RUN npx prisma generate --schema=backend/schema.prisma
# We might need to adjust the build script if it expects to be in /backend
# If npm run build:backend exists in root package.json:
RUN npm run build:backend

# --- Production Stage ---
FROM node:18-alpine

WORKDIR /app

# Least privilege security
RUN addgroup -S trackcodex && adduser -S trackcodex -G trackcodex
USER trackcodex

# Copy build artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
