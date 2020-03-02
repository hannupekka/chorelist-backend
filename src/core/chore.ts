import knex from '~/db/';

export const getChores = async () => {
  return knex.select('*').from('chore');
};
