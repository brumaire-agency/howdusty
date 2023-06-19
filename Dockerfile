# base stage
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --ignore-scripts
COPY . .

# build stage
FROM base AS build
RUN npm run build

# release stage
FROM node:20-alpine AS release
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
