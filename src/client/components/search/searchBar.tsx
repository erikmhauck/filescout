import { SearchTwoTone } from '@mui/icons-material';
import { Button, Container, Grid, Input, InputAdornment } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';

interface SearchProps {
  queryString: string;
  setQueryString: Dispatch<SetStateAction<string>>;
  executeSearch: (query: string) => Promise<void>;
}

export const SearchBar = ({
  queryString,
  setQueryString,
  executeSearch,
}: SearchProps) => {
  return (
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
  );
};
