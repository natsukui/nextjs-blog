const { default: loadConfig } = require("next/dist/server/config")

module.exports = {
  reactStrictMode: true,

  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    })
    return config
  },
}
