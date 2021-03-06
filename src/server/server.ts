import express from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { App } from '../client/components/app';
import { setupSchedules } from './schedules';
import logger from '../common/logger';
import api from './routes/api';
import { executeWorkerAction } from './worker-interface';

const log = logger('server');

const port = 8080;

const server = express();

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.use('/', express.static(path.join(__dirname, 'static')));
server.use('/api', api);

const manifest = fs.readFileSync(
  path.join(__dirname, 'static/manifest.json'),
  'utf-8'
);
const assets = JSON.parse(manifest);

server.get('/', (_req, res) => {
  log.info('serving /');
  const component = ReactDOMServer.renderToString(React.createElement(App));
  res.render('client', { assets, component });
});

server.listen(port, () => {
  log.info(`Server running on http://localhost:${port}`);
  executeWorkerAction({ action: 'init' }).then(() => {
    setupSchedules();
  });
});
