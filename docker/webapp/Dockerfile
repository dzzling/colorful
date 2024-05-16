FROM node:22 AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
COPY . ./

RUN npm run build
RUN npm prune --production

FROM node:22-alpine
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json ./build

EXPOSE 3000

CMD ["node", "build"]