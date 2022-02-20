import { exec } from 'child_process';
import React from 'react';

interface SearchProps {
  executeSearch: (query: string) => Promise<void>;
}

export const Search = ({ executeSearch }: SearchProps) => {
  const [queryString, setQueryString] = React.useState('');
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
    </div>
  );
};
