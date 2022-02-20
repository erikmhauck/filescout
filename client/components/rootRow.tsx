import React, { Dispatch } from 'react';
import logger from '../logger';
import RootResult from '../models/rootResult';

const log = logger('rootRow');

interface RootRowProps {
  root: RootResult;
}

const checkIfStillScanning = (
  root: RootResult,
  setScanning: Dispatch<React.SetStateAction<boolean>>
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
    const responseObj: RootResult = await response.json();

    if (!responseObj.scanning) {
      log.info(`done scanning`);
      setScanning(false);
      clearInterval(scanCheckInterval);
    }
  }, 2000);
};

const useScanRoot = (root: RootResult) => {
  const [scanning, setScanning] = React.useState(root.scanning);

  const scanRoot = async (root: RootResult) => {
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
      checkIfStillScanning(root, setScanning);
    }
  };

  return { scanRoot, scanning, setScanning };
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
  const { scanRoot, scanning } = useScanRoot(root);
  log.info(`Rendering results! ${JSON.stringify(root)}`);

  return (
    <div>
      <p>
        <b>{root.name}</b> ({root.fileCount} files) - last updated{' '}
        {timeSince(root.lastUpdated)} ago
      </p>
      {scanning && <p>scanning!</p>}
      <button onClick={() => scanRoot(root)}>re-scan</button>
    </div>
  );
};
