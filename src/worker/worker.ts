import { workerData, parentPort } from 'worker_threads';
import { FileDocument, WorkerCommand } from '../common/dataModels';
import { Database } from './database/db';
import { Scanner } from './scanner/scanner';
import { getFileContents, searchForString } from './search/search';

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
      searchForString(command.query || '').then((res: FileDocument[]) => {
        if (parentPort) {
          parentPort.postMessage(res);
        }
      });

      break;
    }
    case 'getFileContents': {
      if (command.id) {
        getFileContents(command.id).then((res: FileDocument | undefined) => {
          if (parentPort) {
            parentPort.postMessage(res);
          }
        });
      } else {
        log.error(`no id provided`);
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
