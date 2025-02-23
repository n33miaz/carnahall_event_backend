import { db } from "../drizzle/client"
import { inscricoes } from "../drizzle/tables/inscricoes"

interface inscricaoNoEventoParams {
    nome: string,
    email: string
};

export async function inscricaoNoEvento({
    nome,
    email,
}: inscricaoNoEventoParams) {
    const resultado = await db.insert(inscricoes).values({
        nome,
        email,
    }).returning();

    const inscrito = resultado[0];
    return {
        inscritoId: inscrito.id,
    }
};