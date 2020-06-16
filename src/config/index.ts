import Joi from 'joi';

interface IConfig {
  API_KEY: string;
  DATABASE_URL: string;
  EMAIL_TO: string;
  EMAIL_FROM: string;
  PORT: number;
  SENDGRID_API_KEY: string;
  CHORELIST_FRONTEND_URL: string;
  SNITCH_URL: string;
}

const {
  API_KEY,
  DATABASE_URL,
  EMAIL_TO,
  EMAIL_FROM,
  PORT,
  SENDGRID_API_KEY,
  CHORELIST_FRONTEND_URL,
  SNITCH_URL,
} = (process.env as unknown) as IConfig;

const schema = Joi.object({
  API_KEY: Joi.string()
    .guid()
    .required(),
  DATABASE_URL: Joi.string()
    .uri()
    .required(),
  EMAIL_TO: Joi.string().required(),
  EMAIL_FROM: Joi.string()
    .email()
    .required(),
  PORT: Joi.number().required(),
  SENDGRID_API_KEY: Joi.string().required(),
  CHORELIST_FRONTEND_URL: Joi.string()
    .uri()
    .required(),
  SNITCH_URL: Joi.string()
    .uri()
    .required(),
});

const config: IConfig = Joi.attempt(
  {
    API_KEY,
    DATABASE_URL,
    EMAIL_TO,
    EMAIL_FROM,
    PORT,
    SENDGRID_API_KEY,
    CHORELIST_FRONTEND_URL,
    SNITCH_URL,
  },
  schema
);

export default config;
