import { join } from 'path';
import * as uuid from 'uuid';
import { RootDocument } from '../common/dataModels';
import { RootsClient } from './roots';
import logger from '../common/logger';
import { getRootDirs, rootOfAllScanDirs, scanFileContents } from './file_utils';
import { SearchClient } from './search';
import { readdirSync, statSync } from 'fs';
import mime from 'mime-types-for-humans';

const log = logger('scanner');

// index only 1000 files at a time to reduce likelihood of memory overflow
const indexingChunkSize = 1000;

export class Scanner {
  rootsClient: RootsClient;
  searchClient: SearchClient;
  constructor() {
    this.rootsClient = new RootsClient();
    this.searchClient = new SearchClient();
  }

  async init() {
    log.info(`initializing index...`);
    if (process.env.NODE_ENV !== 'production') {
      // !!!for debug!!!
      this.rootsClient.deleteAllRoots();
      await this.searchClient.resetIndex();
    }
    await this.searchClient.initializeIndex();
    // get all of the root directories in the scan folder
    const rootDirs = getRootDirs(rootOfAllScanDirs);
    log.info(
      `Found ${rootDirs.length} root directories in the ${rootOfAllScanDirs} folder`
    );
    // scan the path now if it has never been indexed
    for (let i = 0; i < rootDirs.length; i += 1) {
      const currentRootDir = rootDirs[i].replace(`${rootOfAllScanDirs}/`, '');
      log.info(`initializing ${currentRootDir}`);
      let root = this.rootsClient.getRoot(currentRootDir);
      if (!root) {
        root = this.rootsClient.insertRoot({
          _id: uuid.v4(),
          name: currentRootDir,
          lastUpdated: new Date(),
          fileCount: 0,
          state: 'idle',
        });
        log.info(`inserted new root, scanning now`);
        await this.scanPath(currentRootDir);
      }
    }
  }

  async scanPath(targetPath: string) {
    let root = this.rootsClient.getRoot(targetPath) as RootDocument;
    if (!root) {
      log.error(`Failed to get root for ${targetPath}`);
    } else if (root.state === 'scanning') {
      log.info(`canceling scan of ${root.name}, is already scanning`);
      return;
    } else {
      // remove the previously indexed files
      await this.searchClient.deleteDocumentsFromRoot(root);
      // set the root state to scanning
      this.rootsClient.updateRoot(root._id, {
        state: 'scanning',
      });
      // index all the files
      log.info(`indexing ${root.name}`);
      const totalFiles = await this.recursivelyIndexFiles(
        targetPath,
        join(rootOfAllScanDirs, targetPath)
      );
      this.rootsClient.updateRoot(root._id, {
        fileCount: totalFiles,
        state: 'idle',
      });
    }
  }

  private async recursivelyIndexFiles(
    root: string,
    targetPath: string,
    totalFilesScanned = 0
  ) {
    let currentFiles = [];

    try {
      const files = readdirSync(targetPath);
      for (let i = 0; i < files.length; i += 1) {
        const name = join(targetPath, files[i]);
        let stats = statSync(name);
        let isDir = false;
        try {
          isDir = stats.isDirectory();
        } catch (e) {
          log.error(e);
        }
        if (isDir) {
          // recurse
          totalFilesScanned = await this.recursivelyIndexFiles(
            root,
            name,
            totalFilesScanned
          );
          log.info(`recursed totalFilesScanned: ${totalFilesScanned}`);
        } else {
          const contents = await scanFileContents(name);
          const mimeType = mime.lookup(name);
          // append to array
          const cleanedTargetPath = targetPath.replace(rootOfAllScanDirs, '');
          currentFiles.push({
            filename: join(cleanedTargetPath, files[i]),
            root,
            contents,
            fileType: mimeType || 'unknown',
            fileSizeKB: stats.size,
            lastModified: stats.mtime,
          });
          if (currentFiles.length >= indexingChunkSize) {
            this.searchClient.loadDocuments(currentFiles);
            currentFiles = [];
          }
          totalFilesScanned = totalFilesScanned + 1;
        }
      }
    } catch (e) {
      log.info(`failed to recurse into ${targetPath}`);
      log.error(e);
    }
    if (currentFiles.length > 0) {
      this.searchClient.loadDocuments(currentFiles);
    }
    log.info(`totalFilesScanned: ${totalFilesScanned}`);
    return totalFilesScanned;
  }
}
