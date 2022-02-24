import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FileResult } from '../../../common/dataModels';
import Highlighter from 'react-highlight-words';
import { CardActionArea } from '@mui/material';
import { ResultDialog } from './resultDialog';

interface IResultRowProps {
  result: FileResult;
  query: string;
}

export default function ResultRow({ result, query }: IResultRowProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  return (
    <Card
      sx={{
        width: '100%',
        overflowWrap: 'break-word',
      }}
    >
      <CardActionArea onClick={() => setDialogOpen(true)}>
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
      </CardActionArea>
      <ResultDialog
        query={query}
        result={result}
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
      />
    </Card>
  );
}
