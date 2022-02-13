import { Database } from '../database/db';
import logger from '../logger';
import fs from 'fs';

const log = logger('scanner');

export interface FileDocument {
  path: string;
  contents?: string;
}

export class Scanner {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  async walk(
    targetPath: string,
    files_?: FileDocument[]
  ): Promise<FileDocument[]> {
    files_ = files_ || [];
    var files = fs.readdirSync(targetPath);
    for (let i = 0; i < files.length; i += 1) {
      var name = targetPath + '/' + files[i];
      if (fs.statSync(name).isDirectory()) {
        log.info(`recursing into ${name}`);
        await this.walk(name, files_);
      } else {
        files_.push({ path: name });
      }
    }
    return files_;
  }

  async indexPath(targetPath: string) {
    log.info(`indexing ${targetPath}`);
    const allFiles = await this.walk(targetPath);
    await this.db.insertMany(allFiles);
  }
}
