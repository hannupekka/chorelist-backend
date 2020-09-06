import knex from '~/db/';

export const getHealth = async () => {
  return knex.raw('SELECT 1;');
};
