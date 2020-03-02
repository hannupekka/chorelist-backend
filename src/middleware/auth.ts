import { FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import config from '~/config';

const { API_KEY } = config;

const auth = async (request: FastifyRequest, reply: FastifyReply<ServerResponse>) => {
  const { apikey } = request.headers;

  if (apikey !== API_KEY) {
    reply.unauthorized();
  }

  return;
};

export default auth;
