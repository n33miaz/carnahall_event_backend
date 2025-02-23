import { defineConfig } from "tsup";

// transforma todos os arquivos 'typescript' em 'javascript'
export default defineConfig({
	entry: [
		"./src/**/*.ts", // qualquer arquivo que termine em '.ts'
	],
	format: "esm",
	outDir: "dist", // pasta que serão salvos os arquivos
	clean: true,
});

// npm run build (transforma)

// node --env-file .env /dist/server.mjs 
// (carrega variáveis de ambiente e inicia o servidor)

