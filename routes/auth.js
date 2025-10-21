const express = require("express");
const fetch = require("node-fetch");
const Store = require("../models/Store");
const router = express.Router();

router.get("/install", (req, res) => {
    const shop = req.query.shop;
    const apiKey = process.env.SHOPIFY_API_KEY;
    const redirectUri = `${process.env.APP_URL}/auth/callback`;
    const scopes = "write_customers,read_customers";
    res.redirect(
        `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}`
    );
});

router.get("/callback", async (req, res) => {
    const { shop, code } = req.query;
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiSecret = process.env.SHOPIFY_API_SECRET;

    // Intercambiar code por token
    const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: apiKey, client_secret: apiSecret, code })
    });

    const data = await tokenRes.json();
    const accessToken = data.access_token;

    // Guardar en DB
    await Store.findOneAndUpdate(
        { shop },
        { accessToken },
        { upsert: true }
    );

    res.send("App instalada correctamente!");
});

module.exports = router;
