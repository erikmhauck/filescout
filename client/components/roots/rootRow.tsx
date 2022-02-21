import { IconButton } from '@mui/material';
import React, { Dispatch } from 'react';
import { RootDocument } from '../../../common/dataModels';
import logger from '../../logger';
import RefreshIcon from '@mui/icons-material/Refresh';

const log = logger('rootRow');

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
    log.info(`checking if still scanning`);

    const queryBody = JSON.stringify({ name: root.name });
    log.info(`searching: ${queryBody}`);
    const response = await fetch('/api/root', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: queryBody,
    });
    const responseObj: RootDocument = await response.json();

    if (!responseObj.scanning) {
      log.info(`done scanning`);
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
    log.info(`rescanning root: ${root.name}`);
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

const timeSince = (date: Date) => {
  const now = new Date();
  const parsedDate = new Date(date);
  if (date) {
    const seconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + ' years';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' months';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' days';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' hours';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  }
};

export const RootRow = ({ root }: RootRowProps) => {
  const { scanRoot, scanning, fileCount, lastUpdated } = useScanRoot(root);
  log.info(`Rendering root row! ${JSON.stringify(root)}`);

  return (
    <div>
      <p>
        <b>{root.name}</b> ({fileCount} files) - last updated{' '}
        {timeSince(lastUpdated)} ago
      </p>
      {scanning && <p>scanning!</p>}
      <IconButton onClick={() => scanRoot(root)}>
        <RefreshIcon />
      </IconButton>
    </div>
  );
};
