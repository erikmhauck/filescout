import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FileResult } from '../../../common/dataModels';
import Highlighter from 'react-highlight-words';

interface IResultRowProps {
  result: FileResult;
  query: string;
}

export default function ResultRow({ result, query }: IResultRowProps) {
  return (
    <Card
      sx={{
        width: '100%',
        overflowWrap: 'break-word',
        marginBottom: '10px',
      }}
    >
      <CardContent>
        <Typography variant='h5' gutterBottom>
          <Highlighter
            searchWords={[query]}
            autoEscape={true}
            textToHighlight={result.path}
          />
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          <Highlighter
            searchWords={[query]}
            autoEscape={true}
            textToHighlight={result.context || ''}
          />
        </Typography>
      </CardContent>
    </Card>
  );
}
