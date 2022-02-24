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

export interface FileResult {
  id: string;
  root: string;
  path: string;
  context: string;
}

export interface WorkerCommand {
  action: 'scan' | 'search' | 'init' | 'getRoot' | 'getFileContents';
  query?: string;
  path?: string;
  root?: string;
  id?: string;
}
