# Install dependencies only when needed
FROM node:24-alpine AS deps

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
  else echo "No lock file found" && exit 1; \
  fi

# Rebuild the source code only when needed
FROM node:24-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy only necessary files
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copy only required files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
