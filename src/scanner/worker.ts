import { workerData, parentPort } from 'worker_threads';
import { WorkerCommand } from '../common/dataModels';
import { Scanner } from './scanner';

import logger from '../common/logger';

const log = logger('worker');

const scanner = new Scanner();

const executeCommand = async (command: WorkerCommand) => {
  switch (command.action) {
    case 'scan': {
      // scan a path and add contents to index
      if (command.path) {
        await scanner.scanRoot(command.path);
        parentPort?.postMessage(true);
      } else {
        log.info(`no path to scan provided`);
      }
      break;
    }
    case 'search': {
      // query the index for a search string
      const results = await scanner.searchClient.searchForString(command.query);
      parentPort?.postMessage(results);
      break;
    }
    case 'getFileContents': {
      // get the file contents of a specific file by id
      if (command.id) {
        const fileContents = await scanner.searchClient.getFileContents(
          command.id
        );
        parentPort?.postMessage(fileContents);
      } else {
        log.error(`no id provided`);
      }
      break;
    }
    case 'init': {
      // initialize the indexes and scan any new roots
      await scanner.init();
      parentPort?.postMessage(true);
      break;
    }
    case 'getRoot': {
      // if a root is specified, then get that one specifically
      if (command.root) {
        const root = scanner.rootsClient.getRoot(command.root);
        parentPort?.postMessage(root);
      }
      // otherwise, return all of them
      else {
        const roots = scanner.rootsClient.getAllRoots();
        parentPort?.postMessage(roots);
      }
      break;
    }
  }
};

const command = workerData as WorkerCommand;
executeCommand(command);
