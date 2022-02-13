import React from 'react';
import logger from '../logger';

const log = logger('search');

const search = (query: string) => {
  const queryBody = JSON.stringify({ query: query });
  log.info(`searching: ${queryBody}`);
  fetch('/api/search', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: queryBody,
  });
};

export const Search = () => {
  log.info('Rendering search bar!');
  const [queryString, setQueryString] = React.useState(
    '/usr/src/app/.vscode/launch.json'
  );
  return (
    <div>
      <p>type query:</p>
      <p>current query: {queryString}</p>
      <input onChange={(e) => setQueryString(e.target.value)}></input>
      <button onClick={() => search(queryString)}>submit</button>
    </div>
  );
};
