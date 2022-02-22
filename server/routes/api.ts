import express from 'express';
import { Worker } from 'worker_threads';
import path from 'path';
import { WorkerCommand } from '../../common/dataModels';

const router = express.Router();

router.use(express.json());

const runService = (workerData: WorkerCommand) => {
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

runService({ action: 'init' });

router.post('/search', async (req, res) => {
  const result = await runService({ action: 'search', query: req.body.query });
  res.send(JSON.stringify(result));
});

router.post('/scan', function (req, res) {
  runService({
    action: 'scan',
    query: req.body.path,
  });
  res.sendStatus(200);
});

router.get('/roots', async (_req, res) => {
  const roots = await runService({
    action: 'getRoot',
  });
  console.log(JSON.stringify(roots));
  res.send(roots);
});

router.post('/root', async (req, res) => {
  const root = await runService({
    action: 'getRoot',
    root: req.body.name,
  });
  console.log(JSON.stringify(root));
  res.send(root);
});

export default router;
