import config from '../config';

module.exports = {
  client: 'pg',
  connection: config.DATABASE_URL,
  migrations: {
    directory: 'migrations',
  },
};
