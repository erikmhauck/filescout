import { ObjectId } from 'mongodb';
import { Database } from '../database/db';
import logger from '../logger';
import { getRootDirs, recursiveWalk, rootOfAllScanDirs } from './scanner_utils';

const log = logger('scanner');

export interface FileDocument {
  _id?: ObjectId;
  root: string;
  path: string;
  contents?: string;
}

export interface RootDocument {
  _id?: ObjectId;
  name: string;
  lastUpdated: Date;
  fileCount: number;
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

  async scanPath(targetPath: string) {
    let root = (await this.db.getRoot(targetPath)) as unknown as RootDocument;
    log.info(`indexing ${targetPath}`);
    // do the scan
    const allFiles = await this.walk(targetPath);
    if (root && root._id) {
      // update the root if it exists
      await this.db.updateRoot(root._id, allFiles.length);
      // delete the files that were there before
      await this.db.deleteAllFilesFromRoot(root);
    } else {
      // create a new root if it does not exist
      root = (await this.addNewRoot(
        targetPath,
        allFiles.length
      )) as unknown as RootDocument;
    }
    // update the files matching the root
    await this.db.insertManyFiles(allFiles);
  }

  async addNewRoot(rootDir: string, fileCount: number) {
    return await this.db.insertRoot({
      name: rootDir,
      lastUpdated: new Date(),
      fileCount: fileCount,
    });
  }

  async reIndexIfNeeded(root: RootDocument) {
    log.info(`checking if ${root.name} needs to be reindexed`);
    log.info(root.lastUpdated);
  }

  getRootDirName(rootDir: string) {
    return rootDir.replace(`${rootOfAllScanDirs}/`, '');
  }

  async init() {
    log.info(`initializing scanner`);
    const rootDirs = getRootDirs(rootOfAllScanDirs);
    log.info(
      `Found ${rootDirs.length} root directories in the ${rootOfAllScanDirs} folder`
    );

    // !!!for debug!!!
    await this.db.deleteAll();

    for (let i = 0; i < rootDirs.length; i += 1) {
      const currentRootDir = this.getRootDirName(rootDirs[i]);

      const root = await this.db.getRoot(currentRootDir);
      if (!root) {
        await this.scanPath(currentRootDir);
      } else {
        await this.reIndexIfNeeded(root as unknown as RootDocument);
      }
    }
  }
}
