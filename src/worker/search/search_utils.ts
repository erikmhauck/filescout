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
    fileType: { type: 'keyword' },
    fileSizeKB: { type: 'text' },
    lastModified: { type: 'text' },
  };
  log.info(`setting mapping`);
  log.info(JSON.stringify(schema, undefined, 2));

  return client.indices.putMapping({
    index: indexName,
    type: indexType,
    body: { properties: schema },
  });
}

async function resetIndex() {
  log.info(`deleting index`);
  if (await client.indices.exists({ index: indexName })) {
    await client.indices.delete({ index: indexName });
  }
  log.info(`creating index`);
  await client.indices.create({ index: indexName });
  await putFileMapping();
}

export { client, indexName, indexType, resetIndex };
