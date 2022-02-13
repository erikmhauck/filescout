FROM node:16

WORKDIR /tmp
COPY package.json /tmp/
RUN yarn install

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig.*.json ./
COPY webpack.config.*.js ./
RUN cp -a /tmp/node_modules /usr/src/app/

COPY server/ ./server
COPY client/ ./client

RUN npm run build:server

RUN npm run build:client
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY dist .

EXPOSE 8080
CMD [ "node", "./dist/server.js" ]
