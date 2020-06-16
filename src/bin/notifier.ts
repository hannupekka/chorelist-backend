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
}

(async () => {
  const chores = await knex
    .select<IChore[]>()
    .from('chore')
    .orderBy('id', 'ASC');

  const choreCount = chores.length;

  if (choreCount > 0) {
    const dueChores = chores.filter(chore => {
      const { schedule, done_at } = chore;
      const lastExecution = dayjs(done_at)
        .startOf('day')
        .toDate();

      // Calculate next execution from the last execution.
      const parsed = cronParser.parseExpression(schedule, { currentDate: lastExecution });
      const nextExecution = dayjs(parsed.next().toString())
        .add(1, 'day')
        .startOf('day');

      const isDue = dayjs().isSameOrAfter(nextExecution, 'day');
      return isDue;
    });

    const dueChoresCount = dueChores.length;
    if (dueChoresCount > 0) {
      const choreList = dueChores.map(({ title }) => ` - ${title}`).join('<br />');
      console.log(`${dueChores.length} chores due today, sending notifications..`);

      try {
        await sendMail.send({
          to: (config.EMAIL_TO ?? []).split(','),
          from: config.EMAIL_FROM,
          subject: `[Chores] ${dueChoresCount} chores due today`,
          html: `<p>${dueChoresCount} chores due today:</p><p>${choreList}</p><p>Go to <a href="${config.CHORELIST_FRONTEND_URL}" target="_blank" rel="noopener noreferrer">${config.CHORELIST_FRONTEND_URL}</a> to see all the chores.</p><p>See you next time!</p>`,
        });
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    } else {
      console.log('No chores due today, see you tomorrow!');
    }
  }

  await axios.get(config.SNITCH_URL);

  process.exit(0);
})();
