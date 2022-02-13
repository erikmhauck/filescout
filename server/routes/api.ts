import express from 'express';
import { Database } from '../database/db';
import { Scanner } from '../scanner/scanner';

const router = express.Router();
const db = new Database(process.env.CONNECTIONSTRING);
const scanner = new Scanner(db);

router.use(express.json());

router.get('/', function (req, res) {
  res.send('API home page');
});

router.post('/search', async (req, res) => {
  const searchResult = await db.query(req.body.query);
  res.send(JSON.stringify(searchResult));
});

router.post('/add', function (req, res) {
  scanner.indexPath(req.body.path);
  res.send('ok');
});

export default router;
