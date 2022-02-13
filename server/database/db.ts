import { MongoClient } from 'mongodb';
import logger from '../logger';

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
      console.log(`db connection is already alive`);
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

  async insert(documentToInsert: any) {
    log.info(`inserting: ${documentToInsert}`);
    const filesCollection = await this.getFilesCollection();
    if (filesCollection) {
      filesCollection.insertOne(documentToInsert);
    } else {
      log.error(`Could not get filesCollection`);
    }
  }

  async insertMany(documentsToInsert: any[]) {
    log.info(`inserting: ${documentsToInsert.length} documents`);
    const filesCollection = await this.getFilesCollection();
    if (filesCollection) {
      filesCollection.insertMany(documentsToInsert);
    } else {
      log.error(`Could not get filesCollection`);
    }
  }

  async query(queryString: string) {
    log.info(`querying: ${queryString}`);
    const filesCollection = await this.getFilesCollection();
    if (filesCollection) {
      const query = { path: queryString };
      const result = await filesCollection.findOne(query);
      log.info(`got: ${result}`);
      return result;
    } else {
      log.error(`Could not get filesCollection`);
    }
  }
}
