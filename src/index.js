import webpack from 'webpack'

export default function (sails) {

  const config = {
    hook: sails.config.webpack,
    server: sails.config.webpack.development
  };

  if (!config.hook || !config.hook.config) {
    sails.log.warn('sails-hook-webpack: No Webpack options have been defined.');
    sails.log.warn('sails-hook-webpack: Please configure your config/webpack.js file.')
    return {};
  }

  const hook = {

    emitReady: false,

    configure: function () {

    },

    /**
     *
     * @param next
     */
    initialize: function (next) {
      next();
    },

    /**
     * Called after every webpack build.
     * @param err
     * @param rawStats
     * @returns {*}
     */
    afterBuild: function (err, rawStats) {
      if (err) {
        return sails.log.error('sails-hook-webpack: Build error: \n\n', err);
      }

      if (!this.emitReady) {
        sails.emit('hook:sails-hook-webpack:compiler-ready', {});
        this.emitReady = true;
      }

      // emit a built event - hooks like sails-hook-react can then use this
      // to reload sails routes in dev environment builds
      sails.emit('hook:sails-hook-webpack:after-build', rawStats);

      const stats = rawStats.toJson();
      sails.log.debug('sails-hook-webpack: Build Info\n' + rawStats.toString({
          colors: true,
          chunks: false
        }));

      if (stats.errors.length > 0) {
        sails.log.error('sails-hook-webpack: ', stats.errors)
      }

      if (stats.warnings.length > 0) {
        sails.log.warn('sails-hook-webpack: ', stats.warnings)
      }
    }
  };

  // setup outside like this to allow use of the compiler in http.customMiddleware
  hook.compiler = webpack(config.hook.config, (err, stats) => {
    if (err) throw err;
    sails.log.info('sails-hook-webpack: Webpack loaded.');
    sails.log.silly('sails-hook-webpack: ', stats.toString());
    if (process.env.NODE_ENV === 'development') {
      sails.log.info('sails-hook-webpack: Watching for changes...');
      hook.compiler.watch(config.hook.watchOptions, hook.afterBuild);
    } else {
      sails.log.info('sails-hook-webpack: Running production build...');
      hook.compiler.run(hook.afterBuild);
    }
  });

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' && config.server) {

    const WebpackDevServer = require('webpack-dev-server');

    const defaultDevServerConfig = {
      hot: true,
      port: 3000
    };

    // merge defaults
    config.server.config = Object.assign(defaultDevServerConfig, config.server.config || {});

    // make a new

    if (config.server.webpack) {
      hook.devServerCompiler = webpack(config.server.webpack);
    }

    hook.devServer = new WebpackDevServer(hook.devServerCompiler || hook.compiler, config.server.config);
    hook.devServer.listen(config.server.config.port);
  }

  return hook;
}
