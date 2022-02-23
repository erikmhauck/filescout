import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FileResult } from '../../../common/dataModels';

interface IResultRowProps {
  result: FileResult;
}

export default function ResultRow({ result }: IResultRowProps) {
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
          {result.path}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {result.context}
        </Typography>
      </CardContent>
    </Card>
  );
}
