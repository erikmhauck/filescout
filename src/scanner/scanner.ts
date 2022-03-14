import { join } from 'path';
import * as uuid from 'uuid';
import { FileDocument, RootDocument } from '../common/dataModels';
import { Roots } from './roots';
import logger from '../common/logger';
import { getRootDirs, recursiveWalk, rootOfAllScanDirs } from './file_utils';
import {
  deleteDocumentsFromRoot,
  initializeIndex,
  loadDocuments,
  resetIndex,
} from './search';

const log = logger('scanner');

export class Scanner {
  db: Roots;
  constructor() {
    this.db = new Roots();
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
      this.db.updateRoot(root._id, allFiles.length);
      // delete the files that were there before
      await deleteDocumentsFromRoot(root.name);
    } else {
      // create a new root if it does not exist
      root = this.addNewRoot(targetPath, allFiles.length);
    }
    // update the files matching the root
    await loadDocuments(allFiles);
  }

  addNewRoot(rootDir: string, fileCount: number) {
    return this.db.insertRoot({
      _id: uuid.v4(),
      name: rootDir,
      lastUpdated: new Date(),
      fileCount: fileCount,
      scanning: false,
    });
  }

  getRootDirName(rootDir: string) {
    return rootDir.replace(`${rootOfAllScanDirs}/`, '');
  }

  resetState = async () => {
    this.db.deleteAllRoots();
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
      const root = this.db.getRoot(currentRootDir);
      if (!root) {
        await this.scanPath(currentRootDir);
      }
    }
  }
}
