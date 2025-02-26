import { z } from "zod";

const envSchema = z.object({
	// server
	PORT: z.coerce.number().default(3333), // conversão para número (padrão: string)

	// database
	POSTGRESQL_URL: z.string().url().refine((url) => 
	{
		try
		{
			new URL(url)
			return true
		}
		catch (e)
		{
			return false
		}
	}, { message: 'DATABASE_URL inválida' }),

	// redis
	REDIS_URL: z.string().url().refine((url) => 
	{
		try
		{
			new URL(url)
			return true
		}
		catch (e)
		{
			return false
		}
	}, { message: 'REDIS_URL inválida' }),

	// urls
	API_URL: z.string().url(),
	WEB_URL: z.string().url().default('https://carnahall-event-frontend.vercel.app/')
});

export const env = envSchema.parse(process.env); // variavel de ambiente
