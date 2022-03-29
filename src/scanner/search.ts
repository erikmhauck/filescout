import elasticsearch from 'elasticsearch';
import logger from '../common/logger';
import { FileDocument } from '../common/dataModels';

const log = logger('search');

const indexName = 'files';
const indexType = 'file';
const host = process.env.ES_HOST || 'localhost';
const port = 9200;

export class SearchClient {
  client: elasticsearch.Client;
  constructor() {
    this.client = new elasticsearch.Client({ host: { host, port } });
  }

  initializeIndex = async () => {
    const exists = await this.client.indices.exists({ index: indexName });
    if (!exists) {
      log.info(`creating index`);
      await this.client.indices.create({ index: indexName });

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
      return this.client.indices.putMapping({
        index: indexName,
        type: indexType,
        body: { properties: schema },
      });
    }
  };

  resetIndex = async () => {
    log.info(`deleting index`);
    if (await this.client.indices.exists({ index: indexName })) {
      await this.client.indices.delete({ index: indexName });
    }
  };

  loadDocuments = async (fileDocuments: FileDocument[]) => {
    let bulkOps = [];
    for (let i = 0; i < fileDocuments.length; i += 1) {
      bulkOps.push({
        index: { _index: indexName, _type: indexType },
      });

      bulkOps.push({
        ...fileDocuments[i],
      });
    }
    if (bulkOps.length > 0) {
      log.info(`added ${fileDocuments.length} files...`);

      await this.client.bulk({ body: bulkOps });
    }
  };

  deleteDocumentsFromRoot = async (rootToDelete: string) => {
    await this.client.deleteByQuery({
      index: indexName,
      type: indexType,
      body: {
        query: {
          match: {
            root: rootToDelete,
          },
        },
      },
    });
  };

  searchForString = async (queryString: string | undefined, offset = 0) => {
    if (!queryString) {
      return [];
    }
    // build the request
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
    // execute the search
    const results = await this.client.search({
      index: indexName,
      type: indexType,
      body,
    });
    // map the results
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

  getFileContents = async (id: string) => {
    log.info(`searching for document with id: ${id}`);
    try {
      //search for document by id
      const result = await this.client.search({
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
      // map the results
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
}
