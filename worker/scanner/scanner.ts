import { FileDocument, RootDocument } from '../../common/dataModels';
import { Database } from '../database/db';
import logger from '../logger';
import { getRootDirs, recursiveWalk, rootOfAllScanDirs } from './scanner_utils';
import { join } from 'path';

const log = logger('scanner');

export class Scanner {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  async walk(targetPath: string): Promise<FileDocument[]> {
    return await recursiveWalk(targetPath, join(rootOfAllScanDirs, targetPath));
  }

  async scanPath(targetPath: string) {
    let root = (await this.db.getRoot(targetPath)) as unknown as RootDocument;
    if (root && root.scanning) {
      log.info(`canceling scan of ${root.name}, is already scanning`);
      return;
    }
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

    // !!!for debug!!!
    // await this.db.deleteAll();

    const rootDirs = getRootDirs(rootOfAllScanDirs);
    log.info(
      `Found ${rootDirs.length} root directories in the ${rootOfAllScanDirs} folder`
    );

    for (let i = 0; i < rootDirs.length; i += 1) {
      const currentRootDir = this.getRootDirName(rootDirs[i]);
      log.info(`initializing ${currentRootDir}`);
      const root = await this.db.getRoot(currentRootDir);
      if (!root) {
        await this.scanPath(currentRootDir);
      } else {
        await this.reIndexIfNeeded(root as unknown as RootDocument);
      }
    }
  }
}
