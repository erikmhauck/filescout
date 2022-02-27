export interface FileDocument {
  _id?: any;
  root: string;
  filename: string;
  fileType: string;
  fileSizeKB: number;
  lastModified: Date;
  contents?: string;
  context?: string;
}

export interface RootDocument {
  _id?: any;
  name: string;
  lastUpdated: Date;
  fileCount: number;
  scanning: boolean;
}

export interface WorkerCommand {
  action: 'scan' | 'search' | 'init' | 'getRoot' | 'getFileContents';
  query?: string;
  path?: string;
  root?: string;
  id?: string;
}
