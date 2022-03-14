import { MongoClient, ObjectId } from 'mongodb';
import logger from '../common/logger';

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
      log.info(`connecting to mongodb...`);
      this.client = await MongoClient.connect(this.connectionString);
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
    log.warn(`Deleting all roots!`);
    const rootsCollection = await this.getRootsCollection();
    if (rootsCollection) {
      await rootsCollection.deleteMany({});
    } else {
      log.error(`Could not get rootsCollection`);
    }
  }

  async getAllRoots() {
    const rootsCollection = await this.getRootsCollection();
    if (rootsCollection) {
      return (await rootsCollection.find({}).toArray()).map((res) => ({
        ...res,
        _id: res._id.toString(),
      }));
    } else {
      log.error(`Could not get rootsCollection`);
    }
  }

  async insertRoot(documentToInsert: any) {
    const rootsCollection = await this.getRootsCollection();
    if (rootsCollection) {
      return await rootsCollection.insertOne(documentToInsert);
    } else {
      log.error(`Could not get rootsCollection`);
    }
    return undefined;
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
}
