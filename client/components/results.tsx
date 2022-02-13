import React from 'react';
import logger from '../logger';
import SearchResult from '../models/searchResult';

const log = logger('results');

interface ResultsProps {
  results: SearchResult[];
}

export const Results = ({ results }: ResultsProps) => {
  log.info('Rendering results!');

  return (
    <div>
      {results.length > 0 && (
        <div>
          <p>Results:</p>
          <ul>
            {results.map((res) => (
              <li key={res._id}>{res.path}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
