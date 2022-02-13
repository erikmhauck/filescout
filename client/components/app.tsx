import React from 'react';
import logger from '../logger';
import SearchResult from '../models/searchResult';
import { Results } from './results';
import { Search } from './search';

const log = logger('app');

export const App = () => {
  const [results, setResults] = React.useState<SearchResult[]>([]);

  const executeSearch = async (query: string) => {
    const queryBody = JSON.stringify({ query: query });
    log.info(`searching: ${queryBody}`);
    const response = await fetch('/api/search', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: queryBody,
    });
    const responseJson: SearchResult[] = await response.json();
    if (responseJson.length > 0) {
      setResults(responseJson);
    }
  };

  return (
    <div>
      <Search executeSearch={executeSearch} />
      <Results results={results} />
    </div>
  );
};
