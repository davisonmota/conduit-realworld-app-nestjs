import * as Joi from 'joi'

export const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid(
    'production',
    'development',
    'test',
    'provision',
  ),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string(),
  SECRET_JWT: Joi.string(),
  HASH_SALT_JWT: Joi.number(),
})
