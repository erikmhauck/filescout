import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { FileDocument } from './scanner';

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
  const files = readdirSync(targetPath);
  for (let i = 0; i < files.length; i += 1) {
    var name = targetPath + '/' + files[i];
    if (statSync(name).isDirectory()) {
      await recursiveWalk(name, files_);
    } else {
      files_.push({ path: name });
    }
  }
  return files_;
};
