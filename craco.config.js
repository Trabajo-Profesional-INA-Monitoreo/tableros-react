module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.ignoreWarnings = [
          {
            message: /Failed to parse source map.*react-keycloak/,
          },
        ];
        return webpackConfig;
      },
    },
  };