import { join } from 'path';
import * as uuid from 'uuid';
import { RootDocument } from '../common/dataModels';
import { RootsClient } from './roots';
import logger from '../common/logger';
import { getRootDirs, recursiveWalk, rootOfAllScanDirs } from './file_utils';
import { SearchClient } from './search';

const log = logger('scanner');

export class Scanner {
  rootsClient: RootsClient;
  searchClient: SearchClient;
  constructor() {
    this.rootsClient = new RootsClient();
    this.searchClient = new SearchClient();
  }

  async init() {
    log.info(`initializing index...`);
    await this.searchClient.initializeIndex();
    if (process.env.NODE_ENV !== 'production') {
      // !!!for debug!!!
      this.rootsClient.deleteAllRoots();
      await this.searchClient.resetIndex();
    }
    // get all of the root directories in the scan folder
    const rootDirs = getRootDirs(rootOfAllScanDirs);
    log.info(
      `Found ${rootDirs.length} root directories in the ${rootOfAllScanDirs} folder`
    );
    // scan the path now if it has never been indexed
    for (let i = 0; i < rootDirs.length; i += 1) {
      const currentRootDir = rootDirs[i].replace(`${rootOfAllScanDirs}/`, '');
      log.info(`initializing ${currentRootDir}`);
      const root = this.rootsClient.getRoot(currentRootDir);
      if (!root) {
        await this.scanRoot(currentRootDir);
      }
    }
  }

  async scanRoot(targetPath: string) {
    let root = this.rootsClient.getRoot(targetPath) as RootDocument;
    if (root && root.scanning) {
      log.info(`canceling scan of ${root.name}, is already scanning`);
      return;
    }
    log.info(`indexing ${targetPath}`);

    // do the scan
    const allFiles = await recursiveWalk(
      targetPath,
      join(rootOfAllScanDirs, targetPath)
    );

    if (root && root._id) {
      // update the root if it exists
      this.rootsClient.updateRoot(root._id, allFiles.length);
      // delete the files that were there before
      await this.searchClient.deleteDocumentsFromRoot(root.name);
    } else {
      // create a new root if it does not exist
      root = this.rootsClient.insertRoot({
        _id: uuid.v4(),
        name: targetPath,
        lastUpdated: new Date(),
        fileCount: allFiles.length,
        scanning: false,
      });
    }
    // update the files matching the root
    await this.searchClient.loadDocuments(allFiles);
  }
}
