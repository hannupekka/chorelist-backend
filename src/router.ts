import { FastifyInstance } from 'fastify';
import Joi, { SchemaLike } from 'joi';

import { auth } from '~/middleware';
import * as choreHttp from '~/http/chore';
import * as healthHttp from '~/http/health';

const schemaCompiler = (schema: SchemaLike) => (data: unknown) => Joi.validate(data, schema);

const router = async (fastify: FastifyInstance) => {
  fastify.get('/health', async () => {
    return healthHttp.getHealth();
  });

  fastify.get('/chore', { onRequest: auth }, async () => {
    return choreHttp.getChores();
  });

  fastify.patch(
    '/chore/:id/done',
    {
      onRequest: auth,
      schema: {
        params: Joi.object({
          id: Joi.number().required(),
        }),
      },
      schemaCompiler,
    },
    async request => {
      const { id }: { id: string } = request.params as { id: string };

      return choreHttp.patchChoreDone(id);
    }
  );

  fastify.patch(
    '/chore/:id/snooze/:weeks',
    {
      onRequest: auth,
      schema: {
        params: Joi.object({
          id: Joi.number().required(),
          weeks: Joi.number().required(),
        }),
      },
      schemaCompiler,
    },
    async request => {
      const { id, weeks } = request.params as {
        id: string;
        weeks: string;
      };

      return choreHttp.patchChoreSnoozed(id, parseInt(weeks));
    }
  );
};

export default router;
