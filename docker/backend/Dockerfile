FROM node:22 AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
COPY . ./

RUN npm run server:build
RUN npm prune --production

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/dist/ .
COPY package.json .

EXPOSE 8080

CMD ["node", "./server/server.js"]
