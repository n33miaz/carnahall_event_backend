import { redis } from "../redis/client";

interface clicksDeConviteParams {
	inscritoId: string;
}

export async function clicksDeConvite({ inscritoId }: clicksDeConviteParams) {
	await redis.hincrby("referencia:contagem-acesso", inscritoId, 1);

	const contagem = await redis.hget("referencia:contagem-acesso", inscritoId);

	if (contagem) {
		return { contagem: Number.parseInt(contagem) };
	}
	return { contagem: 0 };
}
