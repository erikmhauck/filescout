import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

import Highlighter from 'react-highlight-words';

import { FileDocument } from '../../../common/dataModels';
import { ResultDialog } from './ResultDialog';
import { ResultBadges } from './ResultBadges';

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
        <ResultBadges result={result} />
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
