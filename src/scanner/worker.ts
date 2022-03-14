import { workerData, parentPort } from 'worker_threads';
import { FileDocument, WorkerCommand } from '../common/dataModels';
import { Scanner } from './scanner';
import { getFileContents, searchForString } from './search';

import logger from '../common/logger';

const log = logger('worker');

const scanner = new Scanner();

const command = workerData as WorkerCommand;
switch (command.action) {
  case 'scan': {
    // scan a path and add contents to index
    if (command.path) {
      scanner.scanRoot(command.path).then(() => {
        parentPort?.postMessage(true);
      });
    } else {
      log.info(`no path to scan provided`);
    }
    break;
  }
  case 'search': {
    // query the index for a search string
    searchForString(command.query || '').then((res: FileDocument[]) => {
      parentPort?.postMessage(res);
    });
    break;
  }
  case 'getFileContents': {
    // get the file contents of a specific file by id
    if (command.id) {
      getFileContents(command.id).then((res: FileDocument | undefined) => {
        parentPort?.postMessage(res);
      });
    } else {
      log.error(`no id provided`);
    }
    break;
  }
  case 'init': {
    // initialize the indexes and scan any new roots
    scanner.init().then(() => {
      parentPort?.postMessage(true);
    });
    break;
  }
  case 'getRoot': {
    // if a root is specified, then get that one specifically
    if (command.root) {
      const root = scanner.rootsDB.getRoot(command.root);
      parentPort?.postMessage(root);
    }
    // otherwise, return all of them
    else {
      const roots = scanner.rootsDB.getAllRoots();
      parentPort?.postMessage(roots);
    }
    break;
  }
}
