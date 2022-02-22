import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { FileDocument } from '../../common/dataModels';
import * as textract from 'textract';
import logger from '../logger';

const log = logger('scanner-utils');

export const rootOfAllScanDirs = process.env.TARGETDIRSROOT || '/scan';

export const getRootDirs = (rootOfAllScanDirs: string) => {
  const rootDirs = readdirSync(rootOfAllScanDirs, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => join(rootOfAllScanDirs, dirent.name));
  return rootDirs;
};

export const scanFileContents = async (filePath: string) => {
  return new Promise<string | undefined>((resolve, reject) => {
    textract.fromFileWithPath(filePath, {}, (error: Error, text: string) => {
      if (error) {
        log.error(error);
        resolve(undefined);
      }
      resolve(text);
    });
  });
};

export const recursiveWalk = async (
  root: string,
  targetPath: string,
  files_?: FileDocument[]
): Promise<FileDocument[]> => {
  files_ = files_ || [];
  try {
    const files = readdirSync(targetPath);
    for (let i = 0; i < files.length; i += 1) {
      const name = join(targetPath, files[i]);
      let isDir = false;
      try {
        isDir = statSync(name).isDirectory();
      } catch (e) {
        log.error(e);
      }
      if (isDir) {
        // recurse
        await recursiveWalk(root, name, files_);
      } else {
        const contents = await scanFileContents(name);
        // append to array
        const cleanedTargetPath = targetPath.replace(rootOfAllScanDirs, '');
        files_.push({
          path: join(cleanedTargetPath, files[i]),
          root: root,
          contents: contents,
        });
      }
    }
  } catch (e) {
    log.info(`failed to recurse into ${targetPath}`);
    log.error(e);
  }
  return files_;
};