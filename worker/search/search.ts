import { indexName, indexType, client } from './search_utils';
import logger from '../logger';
import { FileDocument, FileResult } from '../../common/dataModels';

const log = logger('es-load');

export async function loadDocuments(fileDocuments: FileDocument[]) {
  log.info(`loading ${fileDocuments.length} into es`);
  let bulkOps = [];
  for (let i = 0; i < fileDocuments.length; i += 1) {
    bulkOps.push({
      index: { _index: indexName, _type: indexType },
    });

    bulkOps.push({
      root: fileDocuments[i].root,
      filename: fileDocuments[i].path,
      contents: fileDocuments[i].contents,
    });

    if (i > 0 && i % 1000 === 0) {
      await client.bulk({ body: bulkOps });
      bulkOps = [];
      log.info(`indexed ${i}/${fileDocuments.length} files`);
    }
  }

  await client.bulk({ body: bulkOps });
}

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
    _source: ['filename', 'root'],
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
  const fileResults: FileResult[] = results.hits.hits.map((hit) => ({
    id: hit._id,
    root: (hit._source as any).root,
    path: (hit._source as any).filename,
    context: (hit.highlight as any).contents?.join('\r\n'),
  }));
  return fileResults;
};

export const getFileContents = async (id: string) => {
  log.info(`searching for ${id}`);
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
    const fileResults: FileResult[] = result.hits.hits.map((hit) => ({
      id: hit._id,
      root: (hit._source as any).root,
      path: (hit._source as any).filename,
      context: (hit._source as any).contents,
    }));
    return fileResults[0];
  } catch (e) {
    log.error(e);
  }
};
