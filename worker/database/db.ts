import { MongoClient, ObjectId } from 'mongodb';
import logger from '../logger';
import { FileDocument, RootDocument } from '../../common/dataModels';
import { postProcessResults } from './db_utils';

const log = logger('database');

export class Database {
  connectionString: string;
  client: MongoClient | null = null;

  constructor(connectionString: string | undefined) {
    if (!connectionString) {
      log.error(
        'You must pass a mongo conn string through environment variable CONNECTIONSTRING'
      );
      throw Error();
    } else {
      this.connectionString = connectionString;
    }
  }

  async Connect() {
    if (this.client != null) {
      return this.client;
    } else {
      console.log(`getting new db connection`);
      this.client = await MongoClient.connect(this.connectionString);
    }
  }

  async getFilesCollection() {
    await this.Connect();
    if (this.client) {
      const database = this.client.db('primary');
      const filesCollection = database.collection('files');
      return filesCollection;
    }
  }

  async getRootsCollection() {
    await this.Connect();
    if (this.client) {
      const database = this.client.db('primary');
      const rootsCollection = database.collection('roots');
      return rootsCollection;
    }
  }

  async deleteAllRoots() {
    log.info(`Deleting all roots!!!`);
    const rootsCollection = await this.getRootsCollection();
    if (rootsCollection) {
      await rootsCollection.deleteMany({});
    } else {
      log.error(`Could not get rootsCollection`);
    }
  }

  async deleteAllFiles() {
    log.info(`Deleting all files!!!`);
    const filesCollection = await this.getFilesCollection();
    if (filesCollection) {
      await filesCollection.deleteMany({});
    } else {
      log.error(`Could not get rootsCollection`);
    }
  }

  async deleteAll() {
    await this.deleteAllFiles();
    await this.deleteAllRoots();
  }

  async getAllRoots() {
    const rootsCollection = await this.getRootsCollection();
    if (rootsCollection) {
      return rootsCollection.find({}).toArray();
    } else {
      log.error(`Could not get rootsCollection`);
    }
  }

  async insertRoot(documentToInsert: any) {
    log.info(`inserting root: ${JSON.stringify(documentToInsert)}`);
    const rootsCollection = await this.getRootsCollection();
    if (rootsCollection) {
      return await rootsCollection.insertOne(documentToInsert);
    } else {
      log.error(`Could not get rootsCollection`);
    }
    return undefined;
  }

  async insertFile(documentToInsert: any) {
    log.info(`inserting file: ${documentToInsert}`);
    const filesCollection = await this.getFilesCollection();
    if (filesCollection) {
      await filesCollection.insertOne(documentToInsert);
    } else {
      log.error(`Could not get filesCollection`);
    }
  }

  async insertManyFiles(documentsToInsert: FileDocument[]) {
    log.info(`inserting: ${documentsToInsert.length} files`);
    const filesCollection = await this.getFilesCollection();
    if (filesCollection) {
      await filesCollection.insertMany(documentsToInsert);
    } else {
      log.error(`Could not get filesCollection`);
    }
  }

  async deleteAllFilesFromRoot(root: RootDocument) {
    log.info(`deleting files with root: ${root.name}`);
    const filesCollection = await this.getFilesCollection();
    if (filesCollection) {
      await filesCollection.deleteMany({ root: root.name });
    } else {
      log.error(`Could not get filesCollection`);
    }
  }

  async getRoot(rootName: string) {
    const rootsCollection = await this.getRootsCollection();

    if (rootsCollection) {
      const query = { name: rootName };
      const result = await rootsCollection.findOne(query);
      if (result) {
        log.info(`found ${JSON.stringify(result)}`);
        return result;
      }
    } else {
      log.error(`Could not get rootsCollection`);
    }
    return undefined;
  }

  async updateRoot(id: ObjectId, fileCount: number) {
    log.info(`Updating root with ${id} to have ${fileCount} files`);
    const rootsCollection = await this.getRootsCollection();
    if (rootsCollection) {
      await rootsCollection.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            fileCount: fileCount,
            lastUpdated: new Date(),
          },
        }
      );
    } else {
      log.error(`Could not get rootsCollection`);
    }
    return undefined;
  }

  async query(queryString: string) {
    const start = new Date().getMilliseconds();
    log.info(`querying: ${queryString}`);
    const filesCollection = await this.getFilesCollection();
    if (filesCollection) {
      const queryRegex = { $regex: `.*${queryString}.*`, $options: 'i' };
      const query = {
        $or: [{ path: queryRegex }, { contents: queryRegex }],
      };
      const result = (await filesCollection
        .find(query)
        .toArray()) as FileDocument[];
      const end = new Date().getMilliseconds() - start;
      log.info(`got: ${result.length} results in ${end} ms`);
      const processedResults = postProcessResults(queryString, result);
      return processedResults;
    } else {
      log.error(`Could not get filesCollection`);
    }
  }
}
