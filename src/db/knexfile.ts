// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../config').default;

module.exports = {
  client: 'pg',
  connection: config.DATABASE_URL,
  migrations: {
    directory: 'migrations',
  },
};
