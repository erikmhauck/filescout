import React from 'react';
import { FileDocument } from '../../../common/dataModels';
import logger from '../../logger';
import { Grid, LinearProgress } from '@mui/material';
import ResultRow from './resultRow';

const log = logger('results');

interface ResultsProps {
  results: FileDocument[];
  loading: boolean;
  query: string;
}

export const Results = ({ results, loading, query }: ResultsProps) => {
  log.info(`Rendering ${results.length} search results!`);

  return (
    <>
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        {results.map((result) => (
          <Grid item key={result._id} xs={12} md={6} lg={4}>
            <ResultRow result={result} query={query} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
