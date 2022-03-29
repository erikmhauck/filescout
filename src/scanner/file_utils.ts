import { readdirSync } from 'fs';
import { join } from 'path';
import * as textract from 'textract';
import logger from '../common/logger';

const log = logger('scanner-utils');

export const rootOfAllScanDirs = process.env.TARGETDIRSROOT || '/scan';

export const getRootDirs = (rootOfAllScanDirs: string) => {
  const rootDirs = readdirSync(rootOfAllScanDirs, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => join(rootOfAllScanDirs, dirent.name));
  return rootDirs;
};

export const scanFileContents = async (filePath: string) => {
  return new Promise<string | undefined>((resolve, _reject) => {
    textract.fromFileWithPath(filePath, {}, (error: Error, text: string) => {
      if (error) {
        log.error(error);
        resolve(undefined);
      }
      resolve(text);
    });
  });
};
