import React from 'react';
import { FileResult } from '../../../common/dataModels';
import logger from '../../logger';
import {
  CircularProgress,
  Divider,
  LinearProgress,
  List,
  ListItem,
} from '@mui/material';
import ResultRow from './resultRow';

const log = logger('results');

interface ResultsProps {
  results: FileResult[];
  loading: boolean;
}

export const Results = ({ results, loading }: ResultsProps) => {
  log.info(`Rendering ${results.length} search results!`);

  return (
    <div>
      <div>
        {loading && <LinearProgress />}
        <List>
          {results.map((result) => (
            <div key={result.id}>
              <ResultRow result={result} />
            </div>
          ))}
        </List>
      </div>
    </div>
  );
};
