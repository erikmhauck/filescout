import React from 'react';
import { FileResult } from '../../../common/dataModels';
import logger from '../../logger';
import { LinearProgress, List } from '@mui/material';
import ResultRow from './resultRow';

const log = logger('results');

interface ResultsProps {
  results: FileResult[];
  loading: boolean;
}

export const Results = ({ results, loading }: ResultsProps) => {
  log.info(`Rendering ${results.length} search results!`);

  return (
    <>
      {loading && <LinearProgress />}
      <List>
        {results.map((result) => (
          <div key={result.id}>
            <ResultRow result={result} />
          </div>
        ))}
      </List>
    </>
  );
};
