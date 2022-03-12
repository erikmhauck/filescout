import { join } from 'path';
import { FileDocument, RootDocument } from '../../common/dataModels';
import { Database } from './db';
import logger from '../../common/logger';
import { getRootDirs, recursiveWalk, rootOfAllScanDirs } from './scanner_utils';
import {
  deleteDocumentsFromRoot,
  initializeIndex,
  loadDocuments,
  resetIndex,
} from './search';

const log = logger('scanner');

export class Scanner {
  db: Database;
  constructor() {
    this.db = new Database(process.env.CONNECTIONSTRING);
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
      await deleteDocumentsFromRoot(root.name);
    } else {
      // create a new root if it does not exist
      root = (await this.addNewRoot(
        targetPath,
        allFiles.length
      )) as unknown as RootDocument;
    }
    // update the files matching the root
    await loadDocuments(allFiles);
  }

  async addNewRoot(rootDir: string, fileCount: number) {
    return await this.db.insertRoot({
      name: rootDir,
      lastUpdated: new Date(),
      fileCount: fileCount,
    });
  }

  getRootDirName(rootDir: string) {
    return rootDir.replace(`${rootOfAllScanDirs}/`, '');
  }

  resetState = async () => {
    await this.db.deleteAllRoots();
    await resetIndex();
  };

  async init() {
    log.info(`initializing scanner`);
    await initializeIndex();
    if (process.env.NODE_ENV !== 'production') {
      // !!!for debug!!!
      await this.resetState();
    }
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
      }
    }
  }
}
