const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
    shop: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    settings: { type: Object, default: {} }
});

module.exports = mongoose.model("Store", storeSchema);
