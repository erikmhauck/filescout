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
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={results}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};
