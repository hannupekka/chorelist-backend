import Knex from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('chore', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.string('schedule').notNullable();
    table
      .date('done_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .date('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
  });

export const down = async (knex: Knex): Promise<void> => knex.schema.dropTable('chore');
