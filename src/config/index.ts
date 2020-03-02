import Joi from 'joi';

interface IConfig {
  API_KEY: string;
  DATABASE_URL: string;
  PORT: number;
}

const { API_KEY, DATABASE_URL, PORT } = (process.env as unknown) as IConfig;

const schema = Joi.object({
  API_KEY: Joi.string()
    .guid()
    .required(),
  DATABASE_URL: Joi.string()
    .uri()
    .required(),
  PORT: Joi.number().required(),
});

const config: IConfig = Joi.attempt(
  {
    API_KEY,
    DATABASE_URL,
    PORT,
  },
  schema
);

export default config;
