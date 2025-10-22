import { generate } from "@prisma/client/generator-build";

(async () => {
    try {
        await generate();
        console.log("✅ Prisma client generado correctamente");
    } catch (err) {
        console.error("❌ Error generando Prisma client:", err);
        process.exit(1);
    }
})();
