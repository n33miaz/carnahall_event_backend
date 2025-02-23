import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const inscricoes = pgTable('inscricoes', {
    id: uuid('id').primaryKey().defaultRandom(),
    nome: text('nome').notNull(),
    email: text('email').notNull().unique(),
    createAt: timestamp('criado_em').notNull().defaultNow()
});

