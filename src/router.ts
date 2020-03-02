import { FastifyInstance } from 'fastify';
import Joi, { SchemaLike } from 'joi';

import * as choreHttp from '~/core/chore';

const schemaCompiler = (schema: SchemaLike) => (data: unknown) => Joi.validate(data, schema);

const router = async (fastify: FastifyInstance) => {
  fastify.get('/chore', async () => {
    return choreHttp.getChores();
  });

  fastify.patch(
    '/chore/:id/done',
    {
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
};

export default router;
