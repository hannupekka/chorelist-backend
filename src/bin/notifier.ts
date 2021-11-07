import 'module-alias/register';
import axios from 'axios';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import cronParser from 'cron-parser';
import sendMail from '@sendgrid/mail';
import knex from '~/db/';
import config from '~/config';

sendMail.setApiKey(config.SENDGRID_API_KEY);

dayjs.extend(isSameOrAfter);

interface IChore {
  id: number;
  title: string;
  schedule: string;
  done_at: string;
  snooze_until?: string;
}

(async () => {
  const chores = await knex
    .select<IChore[]>()
    .from('chore')
    .orderBy('id', 'ASC');

  const choreCount = chores.length;

  if (choreCount > 0) {
    const dueChores = chores.filter(chore => {
      const { schedule, done_at, snooze_until } = chore;
      const lastExecution = dayjs(done_at)
        .startOf('day')
        .toDate();
      const snoozeUntil = snooze_until ? dayjs(snooze_until) : null;

      // Calculate next execution from the last execution.
      const parsed = cronParser.parseExpression(schedule, { currentDate: lastExecution });
      const nextScheduledExecution = dayjs(parsed.next().toString()).startOf('day');

      // Check if chore has alreade been done today.
      const alreadyDoneToday = dayjs(lastExecution).isSame(nextScheduledExecution, 'day');
      const nextExecution = alreadyDoneToday
        ? dayjs(parsed.next().toString()).startOf('day')
        : nextScheduledExecution;

      const isDue = dayjs().isSameOrAfter(nextExecution, 'day');
      const isNotSnoozed = snoozeUntil ? dayjs().isSameOrAfter(snoozeUntil) : true;
      return isDue && isNotSnoozed;
    });

    const dueChoresCount = dueChores.length;
    if (dueChoresCount > 0) {
      // const choreList = dueChores.map(({ title }) => ` - ${title}`).join('<br />');
      console.log(`${dueChores.length} chores due today, sending notifications..`);

      // try {
      //   await sendMail.send({
      //     to: (config.EMAIL_TO ?? []).split(','),
      //     from: config.EMAIL_FROM,
      //     subject: `[Chores] ${dueChoresCount} chores due today`,
      //     html: `<p>${dueChoresCount} chores due today:</p><p>${choreList}</p><p>Go to <a href="${config.CHORELIST_FRONTEND_URL}" target="_blank" rel="noopener noreferrer">${config.CHORELIST_FRONTEND_URL}</a> to see all the chores.</p><p>See you next time!</p>`,
      //   });
      // } catch (err) {
      //   console.error(err);
      //   process.exit(1);
      // }
    } else {
      console.log('No chores due today, see you tomorrow!');
    }
  }

  await axios.get(config.SNITCH_URL);

  process.exit(0);
})();
