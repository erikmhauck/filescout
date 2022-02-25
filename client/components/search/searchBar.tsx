import { SearchTwoTone } from '@mui/icons-material';
import { Button, Container, Grid, Input, InputAdornment } from '@mui/material';
import React from 'react';
import { FileDocument } from '../../../common/dataModels';
import logger from '../../logger';
import { Results } from './results';

interface SearchProps {}

const log = logger('search');

const useSearch = () => {
  const [results, setResults] = React.useState<FileDocument[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const executeSearch = async (query: string) => {
    setLoading(true);
    setResults([]);
    const queryBody = JSON.stringify({ query: query });
    log.info(`searching: ${queryBody}`);
    const response = await fetch('/api/search', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: queryBody,
    });
    const responseJson: FileDocument[] = await response.json();
    if (responseJson.length > 0) {
      setResults(responseJson);
    } else {
      setResults([]);
    }
    setLoading(false);
  };

  return { results, executeSearch, loading };
};

export const SearchBar = ({}: SearchProps) => {
  const [queryString, setQueryString] = React.useState('');
  const { results, executeSearch, loading } = useSearch();

  return (
    <>
      <Container maxWidth='md'>
        <Grid container justifyContent='space-between'>
          <Grid item xs={11}>
            <Input
              fullWidth
              onKeyPress={(e) =>
                e.key === 'Enter' ? executeSearch(queryString) : () => {}
              }
              onChange={(e) => setQueryString(e.target.value)}
              placeholder='search'
              startAdornment={
                <InputAdornment position='start'>
                  <SearchTwoTone />
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={1}>
            <Button onClick={() => executeSearch(queryString)}>go</Button>
          </Grid>
        </Grid>
      </Container>

      <Results results={results} loading={loading} query={queryString} />
    </>
  );
};
