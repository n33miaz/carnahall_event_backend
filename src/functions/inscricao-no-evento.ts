import { eq } from 'drizzle-orm'
import { db } from '../drizzle/client'
import { inscricoes } from '../drizzle/tables/inscricoes'
import { redis } from '../redis/client'
import { DrizzleError } from 'drizzle-orm';


interface inscricaoNoEventoParams {
  nome: string
  email: string
  referenciadorId?: string | null
}

export async function inscricaoNoEvento({
  nome,
  email,
  referenciadorId,
}: inscricaoNoEventoParams) {
  try {
    // busca no banco de dados algum acesso anterior
    const inscritos = await db
      .select()
      .from(inscricoes)
      .where(eq(inscricoes.email, email))

    if (inscritos.length > 0) {
      return { inscritoId: inscritos[0].id }
    }

    const resultado = await db
      .insert(inscricoes)
      .values({
        nome,
        email,
      })
      .returning()


    if (referenciadorId) {
        // verifica se o referenciador existe antes de incrementar
        const referenciadorExists = await db.select().from(inscricoes).where(eq(inscricoes.id, referenciadorId));
          if(referenciadorExists.length > 0){
            // pontua no ranking quem convidou
            await redis.zincrby('referencia:ranking', 1, referenciadorId);
          }
      }


    const inscrito = resultado[0]
    return {
      inscritoId: inscrito.id,
    }
  } catch (error) {
    // usar o tratamento de erros do proprio Drizzle.
    if (error instanceof DrizzleError) {
        console.error("Erro no Drizzle:", error.message);
        throw new Error("Erro ao inserir inscrição no banco de dados."); // erro genérico

    }else if (error instanceof Error && error.message.startsWith("ERR")) {
        //Trata erros do Redis
        console.error("Erro no Redis:", error.message);
        throw new Error("Erro ao atualizar ranking no Redis.");

    } else {
      // outros erros (incluindo erros de rede com Redis)
      console.error("Erro inesperado:", error);
      throw new Error("Erro inesperado ao processar a inscrição."); // lança um erro genérico
    }
  }
}