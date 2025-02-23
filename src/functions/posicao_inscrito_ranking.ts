import { redis } from "../redis/client";

interface posicaoInscritoRankingParams {
	inscritoId: string;
}

export async function posicaoInscritoRanking({
	inscritoId,
}: posicaoInscritoRankingParams) {
	// determina a posição do usuário no ranking
	const rank = await redis.zrevrank("referencia:ranking", inscritoId);

	if (rank === null) {
		return { position: null };
	}

	return { position: rank + 1 };
}
