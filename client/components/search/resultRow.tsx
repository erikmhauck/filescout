import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FileDocument } from '../../../common/dataModels';
import Highlighter from 'react-highlight-words';
import { CardActionArea, CardActions } from '@mui/material';
import { ResultDialog } from './resultDialog';
import { ResultChips } from './resultChips';

interface IResultRowProps {
  result: FileDocument;
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
          <Typography variant='h6' gutterBottom>
            <Highlighter
              searchWords={[query]}
              autoEscape={true}
              textToHighlight={result.filename}
            />
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            <Highlighter
              searchWords={[query]}
              autoEscape={true}
              textToHighlight={result.context || ''}
            />
          </Typography>
        </CardContent>
        <ResultChips result={result} />
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
