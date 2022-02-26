import * as React from 'react';

import { Chip, Box } from '@mui/material';
import { FileDocument } from '../../../common/dataModels';
import ArticleIcon from '@mui/icons-material/Article';

interface IResultChipsProps {
  result: FileDocument;
}

const formatBytes = (bytes: number, decimals = 0) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const ResultChips = ({ result }: IResultChipsProps) => {
  return (
    <Box sx={{ textAlign: 'end', margin: '1rem' }}>
      <Chip icon={<ArticleIcon />} label={result.fileType} size='small' />
      <Chip label={formatBytes(result.fileSizeKB)} size='small' />
    </Box>
  );
};
