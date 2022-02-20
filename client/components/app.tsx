import React from 'react';
import logger from '../logger';
import { Roots } from './roots/roots';
import { SearchBar } from './search/searchBar';

const log = logger('app');

export const App = () => {
  log.info(`rendering app`);
  return (
    <>
      <Roots />
      <SearchBar />
    </>
  );
};
