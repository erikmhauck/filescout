import * as React from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { FileDocument } from '../../../common/dataModels';
import Highlighter from 'react-highlight-words';

interface IResultDialogProps {
  result: FileDocument;
  open: boolean;
  handleClose: () => any;
  query: string;
}

export const ResultDialog = ({
  result,
  open,
  handleClose,
  query,
}: IResultDialogProps) => {
  const [contents, setContents] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
      fetch('/api/filecontents', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ id: result._id }),
      }).then((res) =>
        res.json().then((res) => {
          setLoading(false);
          setContents(res.contents);
        })
      );
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll='paper'
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
    >
      <DialogTitle id='scroll-dialog-title'>{result.filename}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText
          align={loading ? 'center' : 'inherit'}
          id='scroll-dialog-description'
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Highlighter
              searchWords={[query]}
              autoEscape={true}
              textToHighlight={contents || ''}
            />
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
