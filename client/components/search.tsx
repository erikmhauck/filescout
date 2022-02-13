import React from 'react';
import logger from '../logger';

const log = logger('search');

interface SearchProps {
  executeSearch: (query: string) => Promise<void>;
}

export const Search = ({ executeSearch }: SearchProps) => {
  const [queryString, setQueryString] = React.useState('');
  return (
    <div>
      <p>type query:</p>
      <input onChange={(e) => setQueryString(e.target.value)}></input>
      <button onClick={() => executeSearch(queryString)}>submit</button>
    </div>
  );
};
