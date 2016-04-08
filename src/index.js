import webpack from 'webpack'

export default function (sails) {
  const config = sails.config;

  const hook =  {

    configure: function () {
      const config = sails.config;
      if (!config.webpack || !config.webpack.options) {
        sails.log.warn('sails-hook-webpack: no Webpack "options" are defined.');
        sails.log.warn('sails-hook-webpack: Please configure config/webpack.js')
      }
    },

    /**
     *
     * @param next
     */
    initialize: function (next) {
      const config = sails.config;
      next();

      if (!config.webpack || !config.webpack.options) {
        return;
      }

      sails.after('lifted', () => {

      })
    },

    /**
     *
     * @param err
     * @param rawStats
     * @returns {*}
     */
    afterBuild: function (err, rawStats) {
      if (err) {
        return sails.log.error('sails-hook-webpack: Build error: \n\n', err);
      }

      sails.emit('sails-hook-webpack:built', rawStats);

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

  hook.compiler = webpack(config.webpack.options, (err, stats) => {
    if (err) throw err;

    sails.log.info('sails-hook-webpack: Webpack loaded.');
    sails.log.silly('sails-hook-webpack: ', stats.toString());

    if (process.env.NODE_ENV == 'development') {
      sails.log.info('sails-hook-webpack: Watching for changes...');
      hook.compiler.watch(config.webpack.watchOptions, hook.afterBuild)
    } else {
      sails.log.info('sails-hook-webpack: Running production build...');
      hook.compiler.run(hook.afterBuild)
    }
  });

  return hook;
}
