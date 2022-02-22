import { workerData, parentPort } from 'worker_threads';
import { WorkerCommand } from '../common/dataModels';
import { Database } from './database/db';
import { Scanner } from './scanner/scanner';
import logger from './logger';

const log = logger('worker');

const db = new Database(process.env.CONNECTIONSTRING);
const scanner = new Scanner(db);

if (parentPort) {
  const command = workerData as WorkerCommand;
  switch (command.action) {
    case 'scan': {
      log.info(`scanning ${command.path}`);
      if (command.path) {
        scanner.scanPath(command.path);
      } else {
        log.info(`no path to scan provided`);
      }
    }
    case 'search': {
      if (command.query) {
        log.info(`searching ${command.query}`);
        db.query(command.query).then((res) => {
          if (parentPort) {
            parentPort.postMessage(res);
          }
        });
      } else {
        log.info(`no search query provided`);
      }
    }
    case 'init': {
      scanner.init();
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
    }
  }
}
