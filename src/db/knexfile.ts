import config from '../config';

module.exports = {
  client: 'pg',
  pool: {
    min: 2,
    max: 10,
  },
  connection: `${config.DATABASE_URL}?ssl=true`,
  migrations: {
    directory: 'migrations',
  },
  ssl: { rejectUnauthorized: false },
};
