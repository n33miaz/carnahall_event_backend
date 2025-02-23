import { redis } from "../redis/client";

interface linkAcessoConviteParams {
    inscritoId: string,
};

export async function linkAcessoConvite({
    inscritoId,
}: linkAcessoConviteParams) {
    await redis.hincrby('referencia:contagem-acesso', inscritoId, 1);
};