import React from 'react';
import { Grid, LinearProgress } from '@mui/material';

import { FileDocument } from '../../../common/dataModels';
import ResultRow from './ResultRow';

interface ResultsProps {
  results: FileDocument[];
  loading: boolean;
  query: string;
}

export const Results = ({ results, loading, query }: ResultsProps) => {
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
