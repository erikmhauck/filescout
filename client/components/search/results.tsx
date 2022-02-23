import React from 'react';
import { FileResult } from '../../../common/dataModels';
import logger from '../../logger';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const log = logger('results');

const columns: GridColDef[] = [
  { field: 'path', headerName: 'File', flex: 1 },
  { field: 'context', headerName: 'Contents', flex: 1 },
];

interface ResultsProps {
  results: FileResult[];
  loading: boolean;
}

export const Results = ({ results, loading }: ResultsProps) => {
  log.info(`Rendering ${results.length} search results!`);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          loading={loading}
          rows={results}
          columns={columns}
          pageSize={100}
        />
      </div>
    </div>
  );
};
