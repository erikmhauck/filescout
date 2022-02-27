FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
RUN yarn install

# build
COPY src/ ./src
COPY tsconfig.*.json ./
COPY webpack.config.*.js ./
RUN npm run build:client
RUN npm run build:server

EXPOSE 8080
CMD [ "node", "./dist/server.js" ]
