import Knex from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.table('chore', table => {
    table
      .text('description')
      .nullable()
      .alter();
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.table('chore', table => {
    table
      .text('description')
      .notNullable()
      .alter();
  });
