import logger from '../common/logger';
import * as fs from 'fs';
import { RootDocument } from '../common/dataModels';
const log = logger('database');

const rootsPath = './roots.json';

export class RootsClient {
  constructor() {
    if (!fs.existsSync(rootsPath)) {
      this.writeRootsToFile([]);
    }
  }

  getAllRoots() {
    const roots = JSON.parse(fs.readFileSync(rootsPath).toString());
    return roots as RootDocument[];
  }

  deleteAllRoots() {
    this.writeRootsToFile([]);
  }

  insertRoot(documentToInsert: RootDocument) {
    const roots = this.getAllRoots();
    roots.push(documentToInsert);
    this.writeRootsToFile(roots);
    return documentToInsert;
  }

  getRoot(rootName: string) {
    const roots = this.getAllRoots();
    if (roots) {
      return roots.find((root) => root.name === rootName);
    } else {
      log.error(`Could not get roots`);
    }
    return undefined;
  }

  updateRoot(id: string, fieldsToUpdate: Partial<RootDocument>) {
    log.info(
      `updating root ${id} with new fields: ${JSON.stringify(fieldsToUpdate)}`
    );
    const roots = this.getAllRoots();
    if (roots) {
      const rootIndex = roots.findIndex((root) => root._id === id);
      roots[rootIndex] = {
        ...roots[rootIndex],
        lastUpdated: new Date(),
        ...fieldsToUpdate,
      };
      roots[rootIndex].lastUpdated = new Date();
      this.writeRootsToFile(roots);
    } else {
      log.error(`Could not get roots`);
    }
    return undefined;
  }

  writeRootsToFile(roots: RootDocument[]) {
    fs.writeFileSync(rootsPath, JSON.stringify(roots));
  }
}
