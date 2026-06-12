# Stage 1: Install dependencies
FROM node:20-bookworm-slim AS deps
WORKDIR /app

COPY package*.json ./
RUN npm install

# Stage 2: Development
FROM node:20-bookworm-slim AS dev
# A postgresql-client telepítése Debian alapon (apt-get a korábbi apk helyett)
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--"]