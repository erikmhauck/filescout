import React from 'react';

interface SearchProps {
  executeSearch: (query: string) => Promise<void>;
}

export const Search = ({ executeSearch }: SearchProps) => {
  const [queryString, setQueryString] = React.useState('');
  return (
    <div>
      <h2>Search:</h2>
      <input onChange={(e) => setQueryString(e.target.value)}></input>
      <button onClick={() => executeSearch(queryString)}>submit</button>
    </div>
  );
};
