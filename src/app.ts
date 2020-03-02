import fastify from 'fastify';
import fastifySensible from 'fastify-sensible';
import fastifyCompress from 'fastify-compress';
import fastifyCors from 'fastify-cors';
import fastifyHelmet from 'fastify-helmet';
import shutdown from 'fastify-graceful-shutdown';
import config from '~/config';
import { auth } from '~/middleware';
import router from './router';

const { PORT } = config;

const app = fastify({ logger: true });

export const start = async () => {
  try {
    app
      .register(shutdown)
      .register(fastifySensible)
      .register(fastifyCompress)
      .register(fastifyCors)
      .register(fastifyHelmet)
      .register(router, { prefix: '/api/v1' });

    app.addHook('onRequest', auth);

    await app.listen(PORT);
  } catch (err) {
    process.exit(1);
  }
};
