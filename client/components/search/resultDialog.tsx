import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { FileResult } from '../../../common/dataModels';
import Highlighter from 'react-highlight-words';

interface IResultDialogProps {
  result: FileResult;
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
  const [contents, setContents] = React.useState('Loading...');
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
        body: JSON.stringify({ id: result.id }),
      }).then((res) => res.json().then((res) => setContents(res.context)));
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
      <DialogTitle id='scroll-dialog-title'>{result.path}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText
          id='scroll-dialog-description'
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <Highlighter
            searchWords={[query]}
            autoEscape={true}
            textToHighlight={contents || ''}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
