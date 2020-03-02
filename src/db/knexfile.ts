import 'ts-node/register';
import config from '../config';

const database = {
  client: 'pg',
  connection: config.DATABASE_URL,
  migrations: {
    directory: 'migrations',
  },
};

export = database;
