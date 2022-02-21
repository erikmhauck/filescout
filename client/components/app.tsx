import React from 'react';
import logger from '../logger';
import { PersistentDrawer } from './drawer';
import { SearchBar } from './search/searchBar';

const log = logger('app');

export const App = () => {
  log.info(`rendering app`);
  return (
    <div style={{ height: '100%' }}>
      <PersistentDrawer />
      <SearchBar />
    </div>
  );
};
