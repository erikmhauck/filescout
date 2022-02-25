import express from 'express';
import { executeWorkerAction } from '../worker-interface';

const router = express.Router();

router.use(express.json());

router.post('/search', async (req, res) => {
  const result = await executeWorkerAction({
    action: 'search',
    query: req.body.query,
  });
  res.send(JSON.stringify(result));
});

router.post('/scan', function (req, res) {
  executeWorkerAction({
    action: 'scan',
    path: req.body.path,
  });
  res.sendStatus(200);
});

router.get('/roots', async (_req, res) => {
  const roots = await executeWorkerAction({
    action: 'getRoot',
  });
  res.send(roots);
});

router.post('/filecontents', async (_req, res) => {
  const file = await executeWorkerAction({
    action: 'getFileContents',
    id: _req.body.id,
  });
  res.send(file);
});

router.post('/root', async (req, res) => {
  const root = await executeWorkerAction({
    action: 'getRoot',
    root: req.body.name,
  });
  res.send(root);
});

export default router;
