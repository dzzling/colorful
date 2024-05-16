FROM node:22

WORKDIR /project

COPY package.json /project/
COPY package-lock.json /project/
COPY node_modules /project/node_modules
COPY package.json /project/
RUN npm install

COPY server /project/server/
COPY src /project/src/

EXPOSE 8080

CMD ["node", "/project/node_modules/.bin/tsx", "/project/server/server.ts"]
