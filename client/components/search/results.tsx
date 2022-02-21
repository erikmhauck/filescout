import React from 'react';
import { FileDocument } from '../../../common/dataModels';
import logger from '../../logger';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const log = logger('results');

const columns: GridColDef[] = [
  { field: 'path', headerName: 'File' },
  { field: 'contents', headerName: 'Contents' },
];

interface ResultsProps {
  results: FileDocument[];
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
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row._id}
        />
      </div>
    </div>
  );
};
