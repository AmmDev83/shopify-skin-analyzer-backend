// server.mjs
import express from 'express';
import dotenv from 'dotenv';
import { Shopify } from '@shopify/shopify-api';
import pkg from '@shopify/shopify-app-express';
const { createShopifyAuth, verifyRequest } = pkg;

dotenv.config();

const app = express();

// Configuración de Shopify
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SHOPIFY_SCOPES.split(','),
  HOST_NAME: process.env.HOST.replace(/^https?:\/\//, ''),
  IS_EMBEDDED_APP: true,
  API_VERSION: Shopify.ApiVersion, // o la versión que estés utilizando
});

// Middleware de autenticación
// app.use(createShopifyAuth());

// Ruta protegida
// app.get('/protected', verifyRequest(), (req, res) => {
//   res.send('Ruta protegida accesible');
// });

// Ruta pública
app.get('/', (req, res) => {
  res.send('Servidor de Shopify funcionando');
});

app.get("/auth", async (req, res) => {
    const { shop } = req.query;
    if (!shop) return res.status(400).send("Missing shop parameter");

    try {
        const redirectUrl = await restClient.auth.begin({
            shop,
            callbackPath: "/auth/callback",
            isOnline: true,
        });
        res.redirect(redirectUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error iniciando OAuth");
    }
});

app.get("/auth/callback", async (req, res) => {
    try {
        const session = await restClient.auth.validateAuthCallback(req, res, req.query);
        console.log("Token recibido:", session.accessToken);
        res.send("App instalada correctamente. Token recibido ✅");
    } catch (error) {
        console.error("Error OAuth:", error);
        res.status(500).send("Error al autenticar la tienda.");
    }
});

// Endpoint de prueba para analizar piel
app.post("/analyze-skin", (req, res) => {
    const { image, customerInfo } = req.body;
    console.log("Imagen recibida:", image);
    console.log("Info cliente:", customerInfo);

    res.json({
        skinType: "Normal",
        recommendedProducts: ["Crema A", "Serum B"],
    });
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
