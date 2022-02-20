import React from 'react';
import { FileDocument } from '../../../common/dataModels';
import logger from '../../logger';

const log = logger('results');

interface ResultsProps {
  results: FileDocument[];
}

export const Results = ({ results }: ResultsProps) => {
  log.info(`Rendering ${results.length} search results!`);

  return (
    <div>
      {results.length > 0 && (
        <div>
          <h2>Results:</h2>
          <ul>
            {results.map((res) => (
              <li key={res._id}>
                {res.path} - {res.contents}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
