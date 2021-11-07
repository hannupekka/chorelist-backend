import Knex from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.table('chore', table => {
    table.date('snooze_until').nullable();
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.table('chore', table => {
    table.dropColumn('snooze_until');
  });
