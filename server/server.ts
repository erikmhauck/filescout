import express from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../client/components/app';
import logger from './logger';

const log = logger('server');

const port = 8080;

const server = express();

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.use('/', express.static(path.join(__dirname, 'static')));

const manifest = fs.readFileSync(
  path.join(__dirname, 'static/manifest.json'),
  'utf-8'
);
const assets = JSON.parse(manifest);

server.get('/', (req, res) => {
  log.info('serving /');
  const component = ReactDOMServer.renderToString(React.createElement(App));
  res.render('client', { assets, component });
});

server.listen(port, () => {
  log.info(`Server running on http://localhost:${port}`);
});
