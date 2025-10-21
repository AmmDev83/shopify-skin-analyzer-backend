/**
 * Backend minimal para recibir imagen, llamar a Face++ y devolver skinType.
 * - Configura variables de entorno FACEPP_KEY y FACEPP_SECRET.
 * - Ejemplo de deploy: Render, Railway, Vercel Serverless, etc.
 */

const express = require("express");
const fetch = require("node-fetch");
const Store = require("../models/Store");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
const upload = multer({ dest: "uploads/" });

// --- CORS simple para que el bloque en la tienda pueda llamar al backend
router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // En producción restringir dominio
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

router.post("/analyze-skin", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No se subió imagen" });

    const FACEPP_KEY = process.env.FACEPP_KEY;
    const FACEPP_SECRET = process.env.FACEPP_SECRET;
    if (!FACEPP_KEY || !FACEPP_SECRET) {
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ error: "FACEPP_KEY / FACEPP_SECRET no configuradas" });
    }

    const form = new FormData();
    form.append("api_key", FACEPP_KEY);
    form.append("api_secret", FACEPP_SECRET);
    form.append("image_file", fs.createReadStream(req.file.path));
    form.append("return_attributes", "skinstatus");

    const response = await fetch("https://api-us.faceplusplus.com/facepp/v3/detect", {
      method: "POST",
      body: form
    });

    const data = await response.json();
    // borrar fichero temporal
    try { fs.unlinkSync(req.file.path); } catch (_) { }

    if (!data.faces || !data.faces.length || !data.faces[0].attributes || !data.faces[0].attributes.skinstatus) {
      return res.status(400).json({ error: "No se detectó un rostro con datos de piel" });
    }

    const skin = data.faces[0].attributes.skinstatus;
    // skin tiene propiedades: health, stain, acne, dark_circle, etc. (depende de Face++)
    // Face++ devuelve algunos valores; usaremos 'oiliness' si existe o inferiremos de 'health'/'acne'.
    // Ajusta umbrales según pruebas reales.
    let skinType = "normal";

    // Si hay oiliness -> usarlo
    if (skin.oiliness !== undefined && skin.oiliness !== null) {
      // Face++ returns float 0-100? Ajusta si es 0-1 según la API. Probamos con 0-100 normalizado:
      const oil = Number(skin.oiliness);
      if (oil >= 60) skinType = "grasa";
      else if (oil <= 30) skinType = "seca";
      else skinType = "mixta";
    } else if (skin.acne !== undefined) {
      const acne = Number(skin.acne);
      if (acne >= 50) skinType = "grasa";
    }

    // Devuelve skinType y datos crudos para que puedas afinar
    return res.json({ skinType, raw: skin });
  } catch (err) {
    console.error("ERROR analyze-skin:", err);
    if (req.file) try { fs.unlinkSync(req.file.path); } catch (_) { }
    return res.status(500).json({ error: "Error interno procesando la imagen" });
  }
});

// Health check
router.get("/", (req, res) => res.send("Skin Analyzer backend OK"));

router.post("/subscribe-customer", async (req, res) => {
  const { shop, email, firstName = "", lastName = "" } = req.body;
  const store = await Store.findOne({ shop });
  if (!store) return res.status(400).json({ error: "Tienda no encontrada" });

  try {
    const response = await fetch(`https://${shop}/admin/api/2025-10/customers.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": store.accessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customer: { email, first_name: firstName, last_name: lastName, accepts_marketing: true }
      })
    });
    const data = await response.json();
    res.json({ success: true, customer: data.customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error interno" });
  }
});

// app.post("/subscribe-customer", async (req, res) => {
//   const { email, firstName = "", lastName = "", token } = req.body;

//   if (!token) {
//     return res.status(400).json({ success: false, error: "Falta el token" });
//   }

//   try {
//     const response = await fetch(
//       "https://mi-tienda-6454597.myshopify.com/admin/api/2025-10/customers.json",
//       {
//         method: "POST",
//         headers: {
//           "X-Shopify-Access-Token": token,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           customer: {
//             email,
//             first_name: firstName,
//             last_name: lastName,
//             accepts_marketing: true,
//             tags: "skin-analyzer"
//           }
//         })
//       }
//     );

//     const data = await response.json();
//     if (response.ok) {
//       res.json({ success: true, customer: data.customer });
//     } else {
//       res.status(response.status).json({ success: false, error: data.errors });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: "Error interno" });
//   }
// });

// const PORT = process.env.PORT || 3000;
// router.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));




module.exports = router;
