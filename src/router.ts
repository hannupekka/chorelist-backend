import { FastifyInstance } from 'fastify';

import * as choreHttp from '~/http/chore';

const router = async (fastify: FastifyInstance) => {
  fastify.get('/status', async () => {
    return { status: 'OK' };
  });

  fastify.get('/chore', async () => {
    return choreHttp.getChores();
  });
};

export default router;
