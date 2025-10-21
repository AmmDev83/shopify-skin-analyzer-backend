// // // /**
// // //  * Backend minimal para recibir imagen, llamar a Face++ y devolver skinType.
// // //  * - Configura variables de entorno FACEPP_KEY y FACEPP_SECRET.
// // //  * - Ejemplo de deploy: Render, Railway, Vercel Serverless, etc.
// // //  */

// // // const express = require("express");
// // // const multer = require("multer");
// // // const fs = require("fs");
// // // const FormData = require("form-data");
// // // const fetch = require("node-fetch");
// // // const path = require("path");

// // // const app = express();
// // // const upload = multer({ dest: "uploads/" });

// // // // --- CORS simple para que el bloque en la tienda pueda llamar al backend
// // // app.use((req, res, next) => {
// // //   res.setHeader("Access-Control-Allow-Origin", "*"); // En producción restringir dominio
// // //   res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
// // //   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
// // //   if (req.method === "OPTIONS") return res.sendStatus(200);
// // //   next();
// // // });

// // // app.post("/analyze-skin", upload.single("photo"), async (req, res) => {
// // //   try {
// // //     if (!req.file) return res.status(400).json({ error: "No se subió imagen" });

// // //     const FACEPP_KEY = process.env.FACEPP_KEY;
// // //     const FACEPP_SECRET = process.env.FACEPP_SECRET;
// // //     if (!FACEPP_KEY || !FACEPP_SECRET) {
// // //       fs.unlinkSync(req.file.path);
// // //       return res.status(500).json({ error: "FACEPP_KEY / FACEPP_SECRET no configuradas" });
// // //     }

// // //     const form = new FormData();
// // //     form.append("api_key", FACEPP_KEY);
// // //     form.append("api_secret", FACEPP_SECRET);
// // //     form.append("image_file", fs.createReadStream(req.file.path));
// // //     form.append("return_attributes", "skinstatus");

// // //     const response = await fetch("https://api-us.faceplusplus.com/facepp/v3/detect", {
// // //       method: "POST",
// // //       body: form
// // //     });

// // //     const data = await response.json();
// // //     // borrar fichero temporal
// // //     try { fs.unlinkSync(req.file.path); } catch (_) { }

// // //     if (!data.faces || !data.faces.length || !data.faces[0].attributes || !data.faces[0].attributes.skinstatus) {
// // //       return res.status(400).json({ error: "No se detectó un rostro con datos de piel" });
// // //     }

// // //     const skin = data.faces[0].attributes.skinstatus;
// // //     // skin tiene propiedades: health, stain, acne, dark_circle, etc. (depende de Face++)
// // //     // Face++ devuelve algunos valores; usaremos 'oiliness' si existe o inferiremos de 'health'/'acne'.
// // //     // Ajusta umbrales según pruebas reales.
// // //     let skinType = "normal";

// // //     // Si hay oiliness -> usarlo
// // //     if (skin.oiliness !== undefined && skin.oiliness !== null) {
// // //       // Face++ returns float 0-100? Ajusta si es 0-1 según la API. Probamos con 0-100 normalizado:
// // //       const oil = Number(skin.oiliness);
// // //       if (oil >= 60) skinType = "grasa";
// // //       else if (oil <= 30) skinType = "seca";
// // //       else skinType = "mixta";
// // //     } else if (skin.acne !== undefined) {
// // //       const acne = Number(skin.acne);
// // //       if (acne >= 50) skinType = "grasa";
// // //     }

// // //     // Devuelve skinType y datos crudos para que puedas afinar
// // //     return res.json({ skinType, raw: skin });
// // //   } catch (err) {
// // //     console.error("ERROR analyze-skin:", err);
// // //     if (req.file) try { fs.unlinkSync(req.file.path); } catch (_) { }
// // //     return res.status(500).json({ error: "Error interno procesando la imagen" });
// // //   }
// // // });

// // // // Health check
// // // app.get("/", (req, res) => res.send("Skin Analyzer backend OK"));

// // // app.post("/subscribe-customer", async (req, res) => {
// // //   const { email, firstName = "", lastName = "", token } = req.body;

// // //   if (!token) {
// // //     return res.status(400).json({ success: false, error: "Falta el token" });
// // //   }

// // //   try {
// // //     const response = await fetch(
// // //       "https://mi-tienda-6454597.myshopify.com/admin/api/2025-10/customers.json",
// // //       {
// // //         method: "POST",
// // //         headers: {
// // //           "X-Shopify-Access-Token": token,
// // //           "Content-Type": "application/json"
// // //         },
// // //         body: JSON.stringify({
// // //           customer: {
// // //             email,
// // //             first_name: firstName,
// // //             last_name: lastName,
// // //             accepts_marketing: true,
// // //             tags: "skin-analyzer"
// // //           }
// // //         })
// // //       }
// // //     );

// // //     const data = await response.json();
// // //     if (response.ok) {
// // //       res.json({ success: true, customer: data.customer });
// // //     } else {
// // //       res.status(response.status).json({ success: false, error: data.errors });
// // //     }
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ success: false, error: "Error interno" });
// // //   }
// // // });

// // // const PORT = process.env.PORT || 3000;
// // // app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));

// // require("dotenv").config();
// // const express = require("express");
// // const mongoose = require("mongoose");
// // const authRoutes = require("./routes/auth");
// // const skinRoutes = require("./routes/skin");

// // const app = express();
// // app.use(express.json());

// // mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// // app.use("/auth", authRoutes);
// // app.use("/skin", skinRoutes);

// // app.listen(process.env.PORT || 3000, () => console.log("Backend corriendo..."));

// import express from "express";
// import dotenv from "dotenv";
// import fetch from "node-fetch";
// import { shopifyApp, LATEST_API_VERSION } from "@shopify/shopify-app-express";
// import { MongoDBSessionStorage } from "@shopify/shopify-app-session-storage-mongodb";

// dotenv.config();

// const app = express();
// app.use(express.json({ limit: "10mb" }));

// // 🔐 Configuración Shopify App
// const shopify = shopifyApp({
//   api: {
//     apiKey: process.env.SHOPIFY_API_KEY,
//     apiSecretKey: process.env.SHOPIFY_API_SECRET,
//     scopes: ["read_customers", "write_customers"],
//     hostName: process.env.HOST.replace(/https:\/\//, ""),
//     apiVersion: LATEST_API_VERSION,
//   },
//   auth: {
//     path: "/auth",
//     callbackPath: "/auth/callback",
//   },
//   sessionStorage: new MongoDBSessionStorage(process.env.MONGO_URI),
// });

// // Rutas de autenticación
// app.use("/auth", shopify.auth.begin());
// app.use("/auth/callback", shopify.auth.callback());
// app.use("/auth/session", shopify.auth.session());

// // 🔬 Análisis de piel
// app.post("/analyze-skin", async (req, res) => {
//   try {
//     const { image } = req.body;

//     const response = await fetch("https://api-us.faceplusplus.com/facepp/v3/detect", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         api_key: process.env.FACEPP_KEY,
//         api_secret: process.env.FACEPP_SECRET,
//         image_base64: image,
//         return_attributes: "skinstatus",
//       }),
//     });

//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("Error en análisis:", error);
//     res.status(500).json({ error: "Error analizando la piel" });
//   }
// });

// // 🧾 Endpoint test
// app.get("/", (req, res) => res.send("✅ Shopify Skin Analyzer Backend activo"));

// // Iniciar servidor
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import shopify from './shopify.js';

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🟢 Instalar app en una tienda
app.get('/auth', async (req, res) => {
    const shop = req.query.shop;
    if (!shop) return res.status(400).send('Falta el parámetro shop');
    const authRoute = await shopify.auth.begin({
        shop,
        callbackPath: '/auth/callback',
        isOnline: false,
        rawRequest: req,
        rawResponse: res,
    });
    return res.redirect(authRoute);
});

// RUTA DE CALLBACK DE SHOPIFY
app.get("/auth/callback", async (req, res) => {
    const { code, shop, state } = req.query;

    if (!code || !shop) {
        return res.status(400).send("Missing code or shop query parameters.");
    }

    try {
        // Intercambiar code por access token
        const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: process.env.SHOPIFY_API_KEY,
                client_secret: process.env.SHOPIFY_API_SECRET,
                code,
            }),
        });

        const data = await response.json();
        console.log("Access token recibido:", data.access_token);

        res.send("App instalada correctamente. Token recibido. ✅");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al intercambiar el token.");
    }
});

// Ejemplo de API protegida
app.get('/api/customers', async (req, res) => {
    const session = await shopify.session.getCurrent({ rawRequest: req, rawResponse: res });
    const client = new shopify.clients.Rest({ session });
    const customers = await client.get({ path: 'customers' });
    res.json(customers.body);
});

app.listen(3000, () => console.log('✅ Backend conectado en http://localhost:3000'));
