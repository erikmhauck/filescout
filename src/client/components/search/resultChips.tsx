import * as React from 'react';

import { Chip, Box } from '@mui/material';
import { FileDocument } from '../../../common/dataModels';
import { formatBytes } from '../../../common/utils';
import ArticleIcon from '@mui/icons-material/Article';

interface IResultChipsProps {
  result: FileDocument;
}

export const ResultChips = ({ result }: IResultChipsProps) => {
  return (
    <Box sx={{ textAlign: 'end', margin: '1rem' }}>
      <Chip icon={<ArticleIcon />} label={result.fileType} size='small' />
      <Chip label={formatBytes(result.fileSizeKB)} size='small' />
    </Box>
  );
};
