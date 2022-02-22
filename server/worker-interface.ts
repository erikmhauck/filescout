import { Worker } from 'worker_threads';
import path from 'path';
import { WorkerCommand } from '../common/dataModels';
export const executeWorkerAction = (workerData: WorkerCommand) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'worker.js'), {
      workerData,
    });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`stopped with  ${code} exit code`));
    });
  });
};
