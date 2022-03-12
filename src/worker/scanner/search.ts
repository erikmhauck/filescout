import elasticsearch from 'elasticsearch';
import logger from '../../common/logger';
import { FileDocument } from '../../common/dataModels';

const log = logger('search');

const indexName = 'files';
const indexType = 'file';
const host = process.env.ES_HOST || 'localhost';
const port = 9200;
const client = new elasticsearch.Client({ host: { host, port } });

export const initializeIndex = async () => {
  const exists = await client.indices.exists({ index: indexName });
  if (!exists) {
    log.info(`creating index`);
    await client.indices.create({ index: indexName });

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
};

export const resetIndex = async () => {
  log.info(`deleting index`);
  if (await client.indices.exists({ index: indexName })) {
    await client.indices.delete({ index: indexName });
  }
};

export const loadDocuments = async (fileDocuments: FileDocument[]) => {
  log.info(`indexing ${fileDocuments.length} files`);
  let bulkOps = [];
  for (let i = 0; i < fileDocuments.length; i += 1) {
    bulkOps.push({
      index: { _index: indexName, _type: indexType },
    });

    bulkOps.push({
      ...fileDocuments[i],
    });

    if (i > 0 && i % 1000 === 0) {
      await client.bulk({ body: bulkOps });
      bulkOps = [];
      log.info(`indexed ${i}/${fileDocuments.length} files`);
    }
  }

  await client.bulk({ body: bulkOps });
};

export const deleteDocumentsFromRoot = async (rootToDelete: string) => {
  const body = {
    query: {
      match: {
        root: rootToDelete,
      },
    },
  };
  await client.deleteByQuery({
    index: indexName,
    type: indexType,
    body,
  });
};

export const searchForString = async (queryString: string, offset = 0) => {
  const body = {
    from: offset,
    _source: ['filename', 'root', 'fileType', 'fileSizeKB', 'lastModified'],
    query: {
      multi_match: {
        query: queryString,
        fields: ['contents', 'filename'],
        operator: 'and',
        fuzziness: 'auto',
      },
    },
    highlight: {
      fields: {
        contents: { pre_tags: '', post_tags: '' },
        filename: { pre_tags: '', post_tags: '' },
      },
    },
  };

  const results = await client.search({
    index: indexName,
    type: indexType,
    body,
  });
  const fileResults: FileDocument[] = results.hits.hits.map((hit) => ({
    _id: hit._id,
    root: (hit._source as any).root,
    filename: (hit._source as any).filename,
    fileType: (hit._source as any).fileType,
    fileSizeKB: (hit._source as any).fileSizeKB,
    lastModified: (hit._source as any).lastModified,
    context: (hit.highlight as any).contents?.join('\r\n'),
  }));
  return fileResults;
};

export const getFileContents = async (id: string) => {
  log.info(`searching for document with id: ${id}`);
  try {
    const result = await client.search({
      index: indexName,
      type: indexType,
      body: {
        query: {
          ids: {
            values: [id],
          },
        },
      },
    });
    const fileResults: FileDocument[] = result.hits.hits.map((hit) => ({
      id: hit._id,
      root: (hit._source as any).root,
      filename: (hit._source as any).filename,
      fileType: (hit._source as any).fileType,
      fileSizeKB: (hit._source as any).fileSizeKB,
      lastModified: (hit._source as any).lastModified,
      contents: (hit._source as any).contents,
    }));
    return fileResults[0];
  } catch (e) {
    log.error(e);
  }
};
