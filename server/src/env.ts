import { z } from 'zod'

const envSchema = z.object({
    PORT: z.coerce.number().default(3333) // conversão para número (padrão: string)
});

export const env = envSchema.parse(process.env); // variavel de ambiente