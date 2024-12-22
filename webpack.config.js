module.exports = {
  // ...existing code...
  devServer: {
    // ...existing code...
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Replace onBeforeSetupMiddleware
      // devServer.app.use((req, res, next) => {
      //   // ...existing code...
      //   next();
      // });

      // Replace onAfterSetupMiddleware
      // devServer.app.use((req, res, next) => {
      //   // ...existing code...
      //   next();
      // });

      return middlewares;
    },
    // ...existing code...
  },
  // ...existing code...
};
