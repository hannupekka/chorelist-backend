import httpErrors from 'http-errors';
import dayjs from 'dayjs';
import cronParser from 'cron-parser';
import knex from '~/db/';

interface IChore {
  id: number;
  title: string;
  description?: string;
  schedule: string;
  done_at: string;
  next_at: string;
}

export const getChores = async (): Promise<IChore[]> => {
  const chores: IChore[] = await knex.select('*').from('chore');

  return chores
    .map(chore => {
      const { schedule, done_at } = chore;
      const lastExecution = dayjs(done_at)
        .startOf('day')
        .toDate();

      // Calculate next execution from the last execution.
      const parsed = cronParser.parseExpression(schedule, { currentDate: lastExecution });
      const nextScheduledExecution = dayjs(parsed.next().toString()).startOf('day');

      // Check if chore has alreade been done today.
      const alreadyDoneToday = dayjs(lastExecution).isSame(nextScheduledExecution, 'day');
      const nextExecution = alreadyDoneToday
        ? dayjs(parsed.next().toString()).startOf('day')
        : nextScheduledExecution;

      return {
        ...chore,
        next_at: nextExecution.toISOString(),
      };
    })
    .sort((a, b) => new Date(a.next_at).getTime() - new Date(b.next_at).getTime());
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
