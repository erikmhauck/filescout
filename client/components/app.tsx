import React from 'react';
import logger from '../logger';
import { Search } from './search';

const log = logger('app');

export const App = () => {
  log.info('Rendering main app!');
  return (
    <div>
      <p>Hello from Client!</p>
      <Search />
    </div>
  );
};
