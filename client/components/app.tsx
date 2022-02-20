import React, { useEffect } from 'react';
import logger from '../logger';
import RootResult from '../models/rootResult';
import SearchResult from '../models/searchResult';
import { Results } from './results';
import { Roots } from './roots';
import { Search } from './search';

const log = logger('app');

const useRoots = () => {
  const [roots, setRoots] = React.useState<RootResult[]>([]);

  const getRoots = async () => {
    const response = await fetch('/api/roots', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    const responseJson: RootResult[] = await response.json();
    if (responseJson.length > 0) {
      setRoots(responseJson);
    }
  };

  useEffect(() => {
    getRoots();
  }, [setRoots]);

  return roots;
};

const useSearch = () => {
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

  return { results, executeSearch };
};

export const App = () => {
  const roots = useRoots();
  const { results, executeSearch } = useSearch();

  return (
    <div>
      <Roots roots={roots as RootResult[]} />
      <Search executeSearch={executeSearch} />
      <Results results={results} />
    </div>
  );
};
