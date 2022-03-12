import {
  Badge,
  Box,
  CircularProgress,
  IconButton,
  ListItem,
  ListItemText,
} from '@mui/material';
import React, { Dispatch } from 'react';
import { RootDocument } from '../../../common/dataModels';
import { timeSince } from '../../../common/utils';
import RefreshIcon from '@mui/icons-material/Refresh';

interface RootRowProps {
  root: RootDocument;
}

const checkIfStillScanning = (
  root: RootDocument,
  setScanning: Dispatch<React.SetStateAction<boolean>>,
  setFileCount: Dispatch<React.SetStateAction<number>>,
  setLastUpdated: Dispatch<React.SetStateAction<Date>>
) => {
  let scanCheckInterval = setInterval(async () => {
    const queryBody = JSON.stringify({ name: root.name });
    const response = await fetch('/api/root', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: queryBody,
    });
    const responseObj: RootDocument = await response.json();

    if (!responseObj.scanning) {
      setScanning(false);
      setFileCount(responseObj.fileCount);
      setLastUpdated(responseObj.lastUpdated);
      clearInterval(scanCheckInterval);
    }
  }, 2000);
};

const useScanRoot = (root: RootDocument) => {
  const [scanning, setScanning] = React.useState(root.scanning);
  const [fileCount, setFileCount] = React.useState(root.fileCount);
  const [lastUpdated, setLastUpdated] = React.useState(root.lastUpdated);

  const scanRoot = async (root: RootDocument) => {
    const queryBody = JSON.stringify({ path: root.name });
    const response = await fetch('/api/scan', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: queryBody,
    });
    if (response.ok) {
      setScanning(true);
      checkIfStillScanning(root, setScanning, setFileCount, setLastUpdated);
    }
  };

  return { scanRoot, scanning, fileCount, lastUpdated };
};

export const RootRow = ({ root }: RootRowProps) => {
  const { scanRoot, scanning, fileCount, lastUpdated } = useScanRoot(root);

  return (
    <ListItem
      secondaryAction={
        <Box sx={{ m: 1, position: 'relative' }}>
          <Badge
            invisible={scanning}
            badgeContent={timeSince(lastUpdated)}
            color='primary'
          >
            <IconButton onClick={() => scanRoot(root)}>
              {scanning ? <CircularProgress /> : <RefreshIcon />}
            </IconButton>
          </Badge>
        </Box>
      }
    >
      <ListItemText primary={root.name} secondary={`${fileCount} files`} />
    </ListItem>
  );
};
