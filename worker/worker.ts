import { workerData, parentPort } from 'worker_threads';
import { FileResult, WorkerCommand } from '../common/dataModels';
import { Database } from './database/db';
import { Scanner } from './scanner/scanner';
import { searchForString } from './search/search';

import logger from './logger';

const log = logger('worker');

const db = new Database(process.env.CONNECTIONSTRING);
const scanner = new Scanner(db);

if (parentPort) {
  const command = workerData as WorkerCommand;
  switch (command.action) {
    case 'scan': {
      if (command.path) {
        scanner.scanPath(command.path).then(() => {
          if (parentPort) {
            parentPort.postMessage(true);
          }
        });
      } else {
        log.info(`no path to scan provided`);
      }
      break;
    }
    case 'search': {
      if (command.query) {
        searchForString(command.query).then((res: FileResult[]) => {
          if (parentPort) {
            parentPort.postMessage(res);
          }
        });
      } else {
        log.info(`no search query provided`);
      }
      break;
    }
    case 'init': {
      scanner.init().then(() => {
        if (parentPort) {
          parentPort.postMessage(true);
        }
      });
      break;
    }
    case 'getRoot': {
      if (command.root) {
        db.getRoot(command.root).then((res) => {
          if (parentPort) {
            parentPort.postMessage(res);
          }
        });
      } else {
        db.getAllRoots().then((res) => {
          if (parentPort) {
            parentPort.postMessage(res);
          }
        });
      }
      break;
    }
  }
}
