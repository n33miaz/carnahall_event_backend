import { z } from 'zod'

const envSchema = z.object({
  // server
  PORT: z.coerce.number().default(80), // conversão para número (padrão: string)

  // database
    POSTGRESQL_URL: z.string().min(1),

    // redis
    REDIS_URL: z.string().min(1),

  // urls
  API_URL: z.string().url(),
  WEB_URL: z.string().url().default('https://carnahall.vercel.app/'),
})

export const env = envSchema.parse(process.env) // variavel de ambiente