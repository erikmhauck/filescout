import { Database } from '../database/db';
import logger from '../logger';
import { getRootDirs, recursiveWalk } from './scanner_utils';

const log = logger('scanner');
const rootOfAllScanDirs = '/scan';

export interface FileDocument {
  path: string;
  contents?: string;
}

export class Scanner {
  db: Database;
  constructor(db: Database) {
    this.db = db;
    this.init();
  }

  async walk(targetPath: string): Promise<FileDocument[]> {
    return await recursiveWalk(targetPath);
  }

  async indexPath(targetPath: string) {
    log.info(`indexing ${targetPath}`);
    const allFiles = await this.walk(targetPath);
    await this.db.insertMany(allFiles);
  }

  async init() {
    log.info(`initializing scanner`);
    const rootDirs = getRootDirs(rootOfAllScanDirs);
    log.info(JSON.stringify(rootDirs));
  }
}
