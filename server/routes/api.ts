import express from 'express';
import { Database } from '../database/db';
import { Scanner } from '../scanner/scanner';

const router = express.Router();
const db = new Database(process.env.CONNECTIONSTRING);
const scanner = new Scanner(db);

router.use(express.json());

router.post('/search', async (req, res) => {
  const searchResult = await db.query(req.body.query);
  res.send(JSON.stringify(searchResult));
});

router.post('/scan', function (req, res) {
  scanner.scanPath(req.body.path);
  res.sendStatus(200);
});

router.get('/roots', async (req, res) => {
  const roots = await db.getAllRoots();
  console.log(JSON.stringify(roots));
  res.send(roots);
});

router.post('/root', async (req, res) => {
  const root = await db.getRoot(req.body.name);
  console.log(JSON.stringify(root));
  res.send(root);
});

export default router;
