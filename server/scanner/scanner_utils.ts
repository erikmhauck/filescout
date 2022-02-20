import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { FileDocument } from './scanner';

export const rootOfAllScanDirs = '/scan';

export const getRootDirs = (rootOfAllScanDirs: string) => {
  const rootDirs = readdirSync(rootOfAllScanDirs, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => join(rootOfAllScanDirs, dirent.name));
  return rootDirs;
};

export const recursiveWalk = async (
  targetPath: string,
  files_?: FileDocument[]
): Promise<FileDocument[]> => {
  files_ = files_ || [];
  const files = readdirSync(join(rootOfAllScanDirs, targetPath));
  for (let i = 0; i < files.length; i += 1) {
    const name = join(rootOfAllScanDirs, targetPath, files[i]);
    if (statSync(name).isDirectory()) {
      // recurse
      await recursiveWalk(name, files_);
    } else {
      // append to array
      files_.push({ path: targetPath + '/' + files[i], root: targetPath });
    }
  }
  return files_;
};
