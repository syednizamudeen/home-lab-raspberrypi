# Node 20 reached end-of-life in April 2026: no further security patches.
# Node 24 is the current LTS, and is what this app is developed and tested on.
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN rm -rf .next && npm run build


FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "start"]
