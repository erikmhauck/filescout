import * as React from 'react';

import { Chip, Box } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import { FileDocument } from '../../../common/dataModels';
import { formatBytes } from '../../../common/utils';

interface IResultChipsProps {
  result: FileDocument;
}

export const ResultBadges = ({ result }: IResultChipsProps) => {
  return (
    <Box sx={{ textAlign: 'end', margin: '1rem' }}>
      <Chip icon={<ArticleIcon />} label={result.fileType} size='small' />
      <Chip label={formatBytes(result.fileSizeKB)} size='small' />
    </Box>
  );
};
