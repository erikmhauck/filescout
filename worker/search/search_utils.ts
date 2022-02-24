import elasticsearch from 'elasticsearch';
import logger from '../logger';
const log = logger('es-connection');

const indexName = 'files';
const indexType = 'file';
const host = process.env.ES_HOST || 'localhost';
const port = 9200;
const client = new elasticsearch.Client({ host: { host, port } });

async function putFileMapping() {
  const schema = {
    filename: { type: 'text' },
    contents: { type: 'text' },
    root: { type: 'text' },
  };

  return client.indices.putMapping({
    index: indexName,
    type: indexType,
    body: { properties: schema },
  });
}

async function resetIndex() {
  if (await client.indices.exists({ index: indexName })) {
    await client.indices.delete({ index: indexName });
  }

  await client.indices.create({ index: indexName });
  await putFileMapping();
}

export { client, indexName, indexType, resetIndex };
