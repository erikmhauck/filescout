export interface FileDocument {
  _id?: any;
  root: string;
  path: string;
  contents?: string;
}

export interface RootDocument {
  _id?: any;
  name: string;
  lastUpdated: Date;
  fileCount: number;
  scanning: boolean;
}

export interface WorkerCommand {
  action: 'scan' | 'search' | 'init' | 'getRoot';
  query?: string;
  path?: string;
  root?: string;
}
