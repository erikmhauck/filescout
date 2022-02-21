import React from 'react';
import { FileDocument } from '../../../common/dataModels';
import logger from '../../logger';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const log = logger('results');

const columns: GridColDef[] = [
  { field: 'path', headerName: 'File path', width: 130 },
  { field: 'contents', headerName: 'Contents', width: 130 },
];

interface ResultsProps {
  results: FileDocument[];
}

export const Results = ({ results }: ResultsProps) => {
  log.info(`Rendering ${results.length} search results!`);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          rows={results}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      </div>
    </div>
  );
};
