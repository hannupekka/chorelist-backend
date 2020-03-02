import httpErrors from 'http-errors';
import knex from '~/db/';

export const getChores = async () => {
  return knex
    .select('*')
    .from('chore')
    .orderBy('id', 'ASC');
};

export const patchChoreDone = async (id: string) => {
  const result = await knex('chore')
    .update({ done_at: knex.fn.now() })
    .where({ id })
    .returning('*');

  if (result.length !== 1) {
    throw new httpErrors.NotFound();
  }

  return result[0];
};
