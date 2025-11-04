
// app.get("/auth", async (req, res) => {
//     const { shop } = req.query;
//     if (!shop) return res.status(400).send("Missing shop parameter");

//     try {
//         const redirectUrl = await restClient.auth.begin({
//             shop,
//             callbackPath: "/auth/callback",
//             isOnline: true,
//         });
//         res.redirect(redirectUrl);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error iniciando OAuth");
//     }
// });

// app.get("/auth/callback", async (req, res) => {
//     try {
//         const session = await restClient.auth.validateAuthCallback(req, res, req.query);
//         console.log("Token recibido:", session.accessToken);
//         res.send("App instalada correctamente. Token recibido ✅");
//     } catch (error) {
//         console.error("Error OAuth:", error);
//         res.status(500).send("Error al autenticar la tienda.");
//     }
// });

// // Endpoint de prueba para analizar piel
// app.post("/analyze-skin", (req, res) => {
//     const { image, customerInfo } = req.body;
//     console.log("Imagen recibida:", image);
//     console.log("Info cliente:", customerInfo);

//     res.json({
//         skinType: "Normal",
//         recommendedProducts: ["Crema A", "Serum B"],
//     });
// });

// // Inicializar servidor
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });

// import express from 'express';
// import dotenv from 'dotenv';
// import { Shopify, ApiVersion } from '@shopify/shopify-api';
// import pkg from '@shopify/shopify-app-express';
// const { createShopifyAuth, verifyRequest } = pkg;

// dotenv.config();
// const app = express();
// app.use(express.json({ limit: '5mb' }));

// Shopify.Context.initialize({
//   API_KEY: process.env.SHOPIFY_API_KEY,
//   API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
//   SCOPES: process.env.SHOPIFY_SCOPES.split(','),
//   HOST_NAME: process.env.HOST.replace(/^https?:\/\//, ''),
//   IS_EMBEDDED_APP: true,
//   API_VERSION: ApiVersion.October22,
// });

// app.use(
//   createShopifyAuth({
//     afterAuth(ctx) {
//       const { shop, accessToken } = ctx.session;
//       console.log(`Tienda autenticada: ${shop}, Token: ${accessToken}`);
//       ctx.redirect('/');
//     },
//   })
// );

// app.get('/', (req, res) => res.send('Servidor Shopify funcionando'));

// app.post('/analyze-skin', verifyRequest(), (req, res) => {
//   const { image, customerInfo } = req.body;
//   console.log("Imagen:", image);
//   console.log("Cliente:", customerInfo);
//   res.json({
//     skinType: 'Normal',
//     recommendedProducts: ['Crema A', 'Serum B'],
//   });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));


// import express from 'express';
// import dotenv from 'dotenv';
// import { Shopify, ApiVersion } from '@shopify/shopify-api';
// // import { ShopifyAuth, verifyRequest } from '@shopify/shopify-app-express';
// import pkg from '@shopify/shopify-app-express';
// const { shopifyApp, verifyRequest } = pkg;

// dotenv.config();
// const app = express();
// app.use(express.json({ limit: '5mb' }));

// Shopify.Context.initialize({
//   API_KEY: process.env.SHOPIFY_API_KEY,
//   API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
//   SCOPES: process.env.SHOPIFY_SCOPES.split(','),
//   HOST_NAME: process.env.HOST.replace(/^https?:\/\//, ''),
//   IS_EMBEDDED_APP: true,
//   API_VERSION: ApiVersion.October22,
// });

// // Luego:
// app.use(shopifyApp({
//   afterAuth(ctx) {
//     const { shop, accessToken } = ctx.session;
//     console.log(`Tienda autenticada: ${shop}, Token: ${accessToken}`);
//     ctx.redirect('/');
//   }
// }));

// app.use(
//   ShopifyAuth({
//     async afterAuth(ctx) {
//       const { shop, accessToken } = ctx.session;
//       console.log(`Tienda autenticada: ${shop}, Token: ${accessToken}`);
//       ctx.redirect('/');
//     },
//   })
// );

// app.get('/', (req, res) => res.send('Servidor Shopify funcionando'));

// app.post('/analyze-skin', verifyRequest(), (req, res) => {
//   const { image, customerInfo } = req.body;
//   console.log("Imagen:", image);
//   console.log("Cliente:", customerInfo);
//   res.json({
//     skinType: 'Normal',
//     recommendedProducts: ['Crema A', 'Serum B'],
//   });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));


// import { join } from "path";
// import { readFileSync } from "fs";
// import express from "express";
// // import serveStatic from "serve-static";

// // import shopify from "./shopify.js";
// // import productCreator from "./product-creator.js";
// // import PrivacyWebhookHandlers from "./privacy.js";

// const PORT = parseInt(
//     process.env.BACKEND_PORT || process.env.PORT || "3000",
//     10
// );

// const STATIC_PATH =
//     process.env.NODE_ENV === "production"
//         ? `${process.cwd()}/frontend/dist`
//         : `${process.cwd()}/frontend/`;

// const app = express();

// // Set up Shopify authentication and webhook handling
// app.get(shopify.config.auth.path, shopify.auth.begin());
// app.get(
//     shopify.config.auth.callbackPath,
//     shopify.auth.callback(),
//     shopify.redirectToShopifyOrAppRoot()
// );
// app.post(
//     shopify.config.webhooks.path,
//     shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
// );

// // If you are adding routes outside of the /api path, remember to
// // also add a proxy rule for them in web/frontend/vite.config.js

// app.use("/api/*", shopify.validateAuthenticatedSession());

// app.use(express.json());

// app.get("/api/products/count", async (_req, res) => {
//     const client = new shopify.api.clients.Graphql({
//         session: res.locals.shopify.session,
//     });

//     const countData = await client.request(`
//     query shopifyProductCount {
//       productsCount {
//         count
//       }
//     }
//   `);

//     res.status(200).send({ count: countData.data.productsCount.count });
// });

// app.post("/api/products", async (_req, res) => {
//     let status = 200;
//     let error = null;

//     try {
//         await productCreator(res.locals.shopify.session);
//     } catch (e) {
//         console.log(`Failed to process products/create: ${e.message}`);
//         status = 500;
//         error = e.message;
//     }
//     res.status(status).send({ success: status === 200, error });
// });

// app.use(shopify.cspHeaders());
// app.use(serveStatic(STATIC_PATH, { index: false }));

// app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
//     return res
//         .status(200)
//         .set("Content-Type", "text/html")
//         .send(
//             readFileSync(join(STATIC_PATH, "index.html"))
//                 .toString()
//                 .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
//         );
// });

// app.listen(PORT);

// import { execSync } from "child_process";
// import express from "express";
// import dotenv from "dotenv";
// import shopify, { authenticate } from "./shopify.server.js";
// import shopifyAppExpress from "@shopify/shopify-app-express";
// const { redirectToAuth } = shopifyAppExpress;

// dotenv.config();

// try {
//     console.log("🛠 Generando Prisma Client dinámicamente...");
//     execSync("npx prisma generate", { stdio: "inherit" });
//     console.log("✅ Prisma Client generado");
// } catch (err) {
//     console.warn("⚠️ No se pudo generar Prisma Client automáticamente:", err.message);
// }

// const app = express();
// app.use(express.json());

// app.get("/", (req, res) => res.send("Skin Analyzer Backend corriendo ✅"));

// app.get("/auth", async (req, res) => {
//   try {
//     // Shopify maneja automáticamente la redirección
//     await redirectToAuth({ req, res, api: shopify.api, config: shopify.config });
//   } catch (err) {
//     console.error("❌ Error iniciando OAuth:", err);
//     res.status(500).send("Error iniciando OAuth");
//   }
// });;

// // app.get("/auth", async (req, res) => {
// //   const { shop } = req.query;
// //   if (!shop) return res.status(400).send("Falta parámetro shop");

// //   try {
// //     const redirectUrl = await shopify.auth.begin({
// //       shop,
// //       callbackPath: "/auth/callback",
// //       isOnline: true,
// //       rawRequest: req,
// //       rawResponse: res,
// //     });
// //     return res.redirect(redirectUrl);
// //   } catch (error) {
// //     console.error("❌ Error iniciando OAuth:", error);
// //     res.status(500).send("Error iniciando OAuth");
// //   }
// // });

// app.get("/auth/callback", async (req, res) => {
//     try {
//         const session = await shopify.auth.callback({
//             rawRequest: req,
//             rawResponse: res,
//         });
//         console.log("✅ Sesión creada:", session);
//         res.send("Autenticación completa ✅");
//     } catch (err) {
//         console.error("Error en callback OAuth:", err);
//         res.status(500).send("Error en callback OAuth");
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Servidor Shopify corriendo en puerto ${PORT}`);
// });

// // dotenv.config();

// // try {
// //     console.log("🛠 Generando Prisma Client dinámicamente...");
// //     execSync("npx prisma generate", { stdio: "inherit" });
// //     console.log("✅ Prisma Client generado");
// // } catch (err) {
// //     console.warn("⚠️ No se pudo generar Prisma Client automáticamente:", err.message);
// //     console.log("Continuando de todas formas...");
// // }

// // const app = express();

// // // Middleware de Shopify (proporcionado por shopifyApp)
// // // app.use(shopify.addDocumentResponseHeaders);

// // app.use(express.json());

// // app.get("/", (req, res) => res.send("Skin Analyzer Backend running ✅"));

// // // Endpoint de inicio OAuth
// // app.get("/auth", async (req, res) => {
// //     const { shop } = req.query;
// //     if (!shop) return res.status(400).send("Missing shop parameter");

// //     try {
// //         if (!process.env.SHOPIFY_APP_URL?.startsWith("https://")) {
// //             console.error("❌ SHOPIFY_APP_URL no es válida:", process.env.SHOPIFY_APP_URL);
// //         }
// //         // Redirige automáticamente a Shopify usando la función login del middleware
// //         res.redirect(`${process.env.SHOPIFY_APP_URL}/auth/${shop}`);
// //     } catch (err) {
// //         console.error("❌ Error iniciando OAuth:", err);
// //         res.status(500).send("Error iniciando OAuth");
// //     }
// // });

// // // Callback de OAuth
// // app.get("/auth/callback", authenticate.admin, async (req, res) => {
// //     try {
// //         const session = req.session;
// //         console.log("Token recibido:", session.accessToken);
// //         res.send("App instalada correctamente. Token recibido ✅");
// //     } catch (err) {
// //         console.error("Error OAuth callback:", err);
// //         res.status(500).send("Error al autenticar la tienda.");
// //     }
// // });

// // // app.get("/auth", async (req, res) => {
// // //     const { shop } = req.query;
// // //     if (!shop) return res.status(400).send("Missing shop parameter");

// // //     try {
// // //         // Usa authenticate.login para iniciar OAuth
// // //         const redirectUrl = await authenticate.login(req, res, {
// // //             shop,
// // //             callbackPath: "/auth/callback",
// // //             isOnline: true,
// // //         });
// // //         res.redirect(redirectUrl);
// // //     } catch (err) {
// // //         console.error("❌ Error iniciando OAuth:", err);
// // //         res.status(500).send("Error iniciando OAuth");
// // //     }
// // // });

// // // app.get("/auth/callback", async (req, res) => {
// // //     try {
// // //         const session = await authenticate.validateAuthCallback(req, res, req.query);
// // //         console.log("Token recibido:", session.accessToken);
// // //         res.send("App instalada correctamente. Token recibido ✅");
// // //     } catch (error) {
// // //         console.error("Error OAuth:", error);
// // //         res.status(500).send("Error al autenticar la tienda.");
// // //     }
// // // });

// // // /**
// // //  * 👉 1. Inicia el flujo OAuth
// // //  */
// // // app.get("/auth", async (req, res) => {
// // //     try {
// // //         // ✅ El nuevo SDK usa shopify.auth.begin()
// // //         const redirectUrl = await shopify.auth.begin({
// // //             shop: req.query.shop,
// // //             callbackPath: "/auth/callback",
// // //             isOnline: true,
// // //             rawRequest: req,
// // //             rawResponse: res,
// // //         });

// // //         res.redirect(redirectUrl);
// // //     } catch (error) {
// // //         console.error("❌ Error iniciando OAuth:", error);
// // //         res.status(500).send("Error iniciando OAuth con Shopify.");
// // //     }
// // // });

// // // /**
// // //  * 👉 2. Callback OAuth
// // //  */
// // // app.get("/auth/callback", async (req, res) => {
// // //     try {
// // //         const session = await shopify.auth.callback({
// // //             rawRequest: req,
// // //             rawResponse: res,
// // //         });

// // //         console.log("✅ Token recibido:", session.accessToken);

// // //         // Si quieres redirigir al front embebido:
// // //         const redirectUrl = await shopify.auth.callbackRedirect({
// // //             rawRequest: req,
// // //             rawResponse: res,
// // //             session,
// // //         });

// // //         res.redirect(redirectUrl);
// // //     } catch (error) {
// // //         console.error("❌ Error en /auth/callback:", error);
// // //         res.status(500).send("Error autenticando tienda.");
// // //     }
// // // });

// // // /**
// // //  * 👉 1. Inicia el flujo OAuth
// // //  * Shopify maneja automáticamente el redirect y la autorización.
// // //  */
// // // app.get("/auth", async (req, res) => {
// // //     try {
// // //         // Shopify maneja el redirect automáticamente
// // //         return login.begin(req, res);
// // //     } catch (error) {
// // //         console.error("❌ Error iniciando OAuth:", error);
// // //         res.status(500).send("Error iniciando OAuth con Shopify.");
// // //     }
// // // });

// // /**
// //  * 👉 2. Callback de OAuth
// //  * Shopify valida la respuesta, guarda la sesión y redirige a la app embebida.
// //  */
// // // app.get("/auth/callback", async (req, res) => {
// // //     try {
// // //         await login.callback(req, res); // valida y crea sesión
// // //         const redirectUrl = await login.redirect(req, res); // redirige al front embebido
// // //         res.redirect(redirectUrl);
// // //     } catch (error) {
// // //         console.error("❌ Error en /auth/callback:", error);
// // //         res.status(500).send("Error durante la autenticación de Shopify.");
// // //     }
// // // });




// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //     console.log(`Servidor Shopify corriendo en Render en puerto ${PORT}`);
// // });


import express from "express";
import dotenv from "dotenv";
import { execSync } from "child_process";
import shopify from "./shopify.server.js";


// console.log("🔍 Shopify exports:", {
//   shopify,
//   authenticate: typeof authenticate,
//   addDocumentResponseHeaders: typeof addDocumentResponseHeaders,
// });

dotenv.config();

try {
    console.log("🛠 Generando Prisma Client dinámicamente...");
    execSync("npx prisma generate", { stdio: "inherit" });
    console.log("✅ Prisma Client generado");
} catch (err) {
    console.warn("⚠️ No se pudo generar Prisma Client automáticamente:", err.message);
}

const app = express();
app.use(express.json());

// 👉 Shopify middleware (añade headers y autenticación)
// app.use(shopify.addDocumentResponseHeaders);
app.use(shopify.cspHeaders());

// 🧭 Redirección automática de OAuth
app.get("/auth", async (req, res) => {
    try {
        const { shop } = req.query;

        if (!shop) return res.status(400).send("Missing shop parameter");

        // ✅ La única forma correcta de iniciar OAuth
        await shopify.auth.begin({
            shop,
            callbackPath: "/auth/callback",
            isOnline: false,
            rawRequest: req,
            rawResponse: res,
        });

    } catch (err) {
        console.error("❌ Error iniciando OAuth:", err);
        res.status(500).send("Error iniciando OAuth");
    }
});


// 🧩 Callback de OAuth
app.get("/auth/callback", async (req, res) => {
  console.log("🔍 OAuth Callback Params:", req.query);

  try {
    const { session } = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    if (!session) {
      console.error("❌ No se recibió sesión en el callback");
      return res.status(400).send("Error: sesión no recibida.");
    }

    console.log("✅ Token obtenido:", session.accessToken);

    const redirectUrl = await shopify.redirectToShopifyOrAppRoot({
      req,
      res,
      shop: session.shop,
    });

    return res.redirect(redirectUrl);

  } catch (error) {
    console.error("❌ Error en OAuth callback:", error);
    res.status(500).send("Error al autenticar la tienda.");
  }
});

// app.get("/auth/callback", shopify.auth.callback(), async (req, res) => {
//   const session = await shopify.sessionStorage.loadSession(req.query.shop);
//   console.log("✅ App instalada correctamente. Token recibido:", session?.accessToken);
//   res.send("App instalada correctamente. Token recibido ✅");
// });

app.get("/api/test", async (req, res) => {
    try {
        // Verifica la sesión activa con el middleware integrado
        const sessionValidation = await shopify.validateAuthenticatedSession()(req, res);

        // Si no hay sesión, redirige o responde con error
        if (!sessionValidation?.session) {
            return res.status(401).send("No hay sesión activa o es inválida");
        }

        const session = sessionValidation.session;

        // Creamos cliente REST usando esa sesión
        const client = new shopify.api.clients.Rest({ session });
        const response = await client.get({ path: "shop" });

        res.json(response.body.shop);
    } catch (err) {
        console.error("❌ Error al llamar a Shopify API:", err);
        res.status(500).send("Error al conectar con Shopify API");
    }
});

app.get("/api/products", async (req, res) => {
    try {
        // ✅ Llamamos a authenticate.admin dentro del callback
        const { admin } = await authenticate.admin(req);
        const response = await admin.rest.resources.Product.all({
            session: admin.session,
        });

        res.json(response.data);
    } catch (error) {
        console.error("❌ Error en /api/products:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

// ✅ Endpoint de prueba
app.get("/", (req, res) => {
    res.send("🚀 Shopify Skin Analyzer backend en marcha");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Shopify corriendo en puerto ${PORT}`);
});
