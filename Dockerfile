FROM node:16

WORKDIR /tmp
COPY package.json /tmp/
RUN yarn install

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY tsconfig.*.json ./
COPY webpack.config.*.js ./
RUN cp -a /tmp/node_modules /usr/src/app/

# Copy all src dirs
COPY server/ ./server
COPY client/ ./client
COPY common/ ./common
COPY worker/ ./worker

# build
RUN npm run build:server
RUN npm run build:client

# copy output
COPY dist .

EXPOSE 8080
CMD [ "node", "./dist/server.js" ]
