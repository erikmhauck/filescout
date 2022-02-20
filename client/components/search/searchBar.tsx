import React from 'react';
import { FileDocument } from '../../../common/dataModels';
import logger from '../../logger';
import { Results } from './results';

interface SearchProps {}

const log = logger('search');

const useSearch = () => {
  const [results, setResults] = React.useState<FileDocument[]>([]);

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
    const responseJson: FileDocument[] = await response.json();
    if (responseJson.length > 0) {
      setResults(responseJson);
    } else {
      setResults([]);
    }
  };

  return { results, executeSearch };
};

export const SearchBar = ({}: SearchProps) => {
  const [queryString, setQueryString] = React.useState('');
  const { results, executeSearch } = useSearch();

  return (
    <div>
      <h2>Search:</h2>
      <input
        onKeyPress={(e) =>
          e.key === 'Enter' ? executeSearch(queryString) : () => {}
        }
        onChange={(e) => setQueryString(e.target.value)}
      />
      <button onClick={() => executeSearch(queryString)}>search</button>
      <Results results={results} />
    </div>
  );
};
