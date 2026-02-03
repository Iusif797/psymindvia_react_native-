const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = ["web.tsx", "web.ts", "web.jsx", "web.js", ...config.resolver.sourceExts];

module.exports = config;
