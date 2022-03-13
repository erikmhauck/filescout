import React from 'react';
import { FileDocument } from '../../common/dataModels';
import { RootsDrawer } from './Drawer/RootsDrawer';
import { Results } from './Search/Results';
import { SearchBar } from './Search/SearchBar';

const useSearch = () => {
  const [results, setResults] = React.useState<FileDocument[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [lastQuery, setLastQuery] = React.useState('');

  const executeSearch = async (query: string) => {
    setLoading(true);
    setResults([]);
    const queryBody = JSON.stringify({ query: query });
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
      setLastQuery(query);
    } else {
      setResults([]);
      setLastQuery('');
    }
    setLoading(false);
  };

  return { results, executeSearch, loading, lastQuery };
};

export const App = () => {
  const { results, executeSearch, loading, lastQuery } = useSearch();
  const [queryString, setQueryString] = React.useState('');

  return (
    <div style={{ height: '100%' }}>
      <RootsDrawer />
      <SearchBar
        executeSearch={executeSearch}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      <Results results={results} loading={loading} query={lastQuery} />
    </div>
  );
};
