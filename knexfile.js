const ENV = process.env.NODE_ENV || "development";

const baseConfig = require("./config");
const customConfig = require("./config");

module.exports = { ...customConfig[ENV], ...baseConfig };
