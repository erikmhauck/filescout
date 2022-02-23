import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
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
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          {result.path}
        </Typography>
        <Typography variant='body2'>{result.context}</Typography>
      </CardContent>
      <CardActions>
        <Button size='small'>View Contents</Button>
        <Button size='small'>More Info</Button>
      </CardActions>
    </Card>
  );
}
