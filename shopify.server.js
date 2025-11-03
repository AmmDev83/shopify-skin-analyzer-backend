// import "@shopify/shopify-app-react-router/adapters/node";
// import {
//   ApiVersion,
//   AppDistribution,
//   shopifyApp,
// } from "@shopify/shopify-app-react-router/server";
// import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
// import prisma from "./db.server.js";

// const shopify = shopifyApp({
//   apiKey: process.env.SHOPIFY_API_KEY,
//   apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
//   apiVersion: ApiVersion.October25,
//   scopes: process.env.SHOPIFY_SCOPES?.split(","),
//   appUrl: process.env.SHOPIFY_APP_URL || "",
//   authPathPrefix: "/auth",
//   sessionStorage: new PrismaSessionStorage(prisma),
//   distribution: AppDistribution.AppStore,
//   ...(process.env.SHOP_CUSTOM_DOMAIN
//     ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
//     : {}),
// });

// export default shopify;
// export const apiVersion = ApiVersion.October25;
// export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
// export const authenticate = shopify.authenticate;
// export const unauthenticated = shopify.unauthenticated;
// export const login = shopify.login;
// export const registerWebhooks = shopify.registerWebhooks;
// export const sessionStorage = shopify.sessionStorage;

// import "@shopify/shopify-app-react-router/adapters/node";
// import {
//   shopifyApp,
//   ApiVersion,
//   AppDistribution,
// } from "@shopify/shopify-app-react-router/server";
// import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
// import prisma from "./db.server.js";

// // 🧠 Detecta entorno y construye la URL correcta
// const isRender = process.env.RENDER === "true" || process.env.RENDER_EXTERNAL_URL;
// const localPort = process.env.PORT || 3000;

// // 🧩 Si estás en Render → usa la URL del servicio
// // Si estás local → usa localhost o tu túnel de ngrok
// let appUrl =
//   process.env.SHOPIFY_APP_URL ||
//   (isRender
//     ? `https://${process.env.RENDER_EXTERNAL_URL}`
//     : `https://localhost:${localPort}`);

// if (!appUrl.startsWith("https://")) {
//   console.error("❌ SHOPIFY_APP_URL inválida o sin https://", appUrl);
//   throw new Error("SHOPIFY_APP_URL debe comenzar con https://");
// }

// console.log("🧩 App corriendo en:", appUrl);

// const shopify = shopifyApp({
//   apiKey: process.env.SHOPIFY_API_KEY,
//   apiSecretKey: process.env.SHOPIFY_API_SECRET,
//   apiVersion: ApiVersion.October25,
//   scopes: process.env.SHOPIFY_SCOPES.split(","),
//   appUrl: process.env.SHOPIFY_APP_URL,
//   authPathPrefix: "/auth",
//   sessionStorage: new PrismaSessionStorage(prisma),
//   distribution: AppDistribution.AppStore,
// });

// export default shopify;

// // ✅ Exporta todo así:
// export const {
//   authenticate,        // Para proteger rutas y login
//   login,               // Para iniciar OAuth (opcional, según versión)
//   registerWebhooks,
//   sessionStorage,
//   addDocumentResponseHeaders
// } = shopify;

// export const {
//   authenticate,
//   login,
//   registerWebhooks,
//   sessionStorage,
//   addDocumentResponseHeaders,
// } = shopify;

// import "@shopify/shopify-app-express/adapters/node";
// import { shopifyApp } from "@shopify/shopify-app-express";
// import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
// import { PrismaClient } from "@prisma/client";
// import dotenv from "dotenv";

// dotenv.config();

// console.log("🧠 Cargando configuración Shopify...");

// // 🧩 Inicializamos Prisma
// const prisma = new PrismaClient();

// // 🧩 Verifica variables críticas
// if (!process.env.SHOPIFY_API_KEY || !process.env.SHOPIFY_API_SECRET || !process.env.SHOPIFY_APP_URL) {
//   console.error("❌ Faltan variables de entorno necesarias para Shopify:");
//   console.error({
//     SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
//     SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
//     SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL,
//   });
//   throw new Error("Configuración incompleta de Shopify");
// }

// // 🧩 Configuración principal del SDK de Shopify
// export const shopify = shopifyApp({
//   api: {
//     apiKey: process.env.SHOPIFY_API_KEY,
//     apiSecretKey: process.env.SHOPIFY_API_SECRET,
//     scopes: process.env.SHOPIFY_SCOPES || "read_products,write_products",
//     hostName: process.env.SHOPIFY_APP_URL.replace(/^https?:\/\//, ""),
//     apiVersion: "2025-01",
//   },
//   auth: {
//     path: "/auth",
//     callbackPath: "/auth/callback",
//   },
//   sessionStorage: new PrismaSessionStorage(prisma),
//   distribution: "single-merchant", // puedes usar 'app-store' si es pública
// });

// export const authenticate = shopify.authenticate;

// console.log("✅ Shopify configurado correctamente (modo backend listo)");

import { shopifyApp } from "@shopify/shopify-app-express";
import { ApiVersion  } from "@shopify/shopify-api";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: process.env.SHOPIFY_SCOPES?.split(","),
    apiVersion: ApiVersion.October25,
  },
  auth: {
    path: "/auth",
    callbackPath: "/auth/callback",
  },
  webhooks: {
    path: "/webhooks",
  },
  sessionStorage: new PrismaSessionStorage(prisma),
});

export default shopify;
export const { 
  authenticate, 
  billing, 
  sessionStorage 
} = shopify;