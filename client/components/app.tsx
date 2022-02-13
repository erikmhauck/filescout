import React from 'react';
import logger from '../logger';

const log = logger('app');

export const App = () => {
  log.info('Rendering main app!');
  return <p>Hello from Client!</p>;
};
