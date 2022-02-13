import { MongoClient } from 'mongodb';
import logger from '../logger';

const log = logger('database');
// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  'mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&writeConcern=majority';

export class Database {
  connectionString: string;
  client: MongoClient;

  constructor(connectionString: string | undefined) {
    if (!connectionString) {
      log.error(
        'You must pass a mongo conn string through environment variable CONNECTIONSTRING'
      );
      throw Error();
    } else {
      this.connectionString = connectionString;
      this.client = new MongoClient(this.connectionString);
    }
  }

  async insert(documentToInsert: any) {
    log.info(`inserting: ${documentToInsert}`);
  }

  async query(queryString: string) {
    try {
      log.info(`querying: ${queryString}`);
      await this.client.connect();
      const database = this.client.db('sample_mflix');
      const movies = database.collection('movies');
      const query = { title: queryString };
      const result = await movies.findOne(query);
      log.info(`got: ${result}`);
      return result;
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close();
    }
  }
}
