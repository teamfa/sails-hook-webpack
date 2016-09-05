# sails-hook-webpack

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]

Webpack asset pipeline hook for Sails.

## 1. Install
```sh
npm install sails-hook-webpack --save
```

You will also need `webpack` and `webpack-dev-server` installed in your project.

`npm i webpack webpack-dev-server --save`

## 2. Configure

### a. Disable the sails grunt hook.

```js
// .sailsrc
{
  "hooks": {
    "grunt": false
  }
}
```

> Optionally, you can also remove the default Sails `tasks` directory and the `Gruntfile.js`.

### b. Set your environment variable.

By default, Sails ([and express](http://stackoverflow.com/a/16979503/291180)) sets `NODE_ENV=development`.
With this setting, webpack in dev will watch for changes in the directories you specify in your `config/webpack.js`. In prod webpack will just run your webpack configuration.


| `NODE_ENV` | webpack mode | description |
|:---|:---|:---|
| `development` | [`webpack.watch()`](https://webpack.github.io/docs/configuration.html#watch) | Rebuilds on file changes during runtime |
| `staging` or `production` | `webpack.run()` | Build bundle once on load. |

### c. Configure Webpack

This hook uses the standard [Webpack Configuration](https://webpack.github.io/docs/configuration.html).

Below is an example of the webpack configuration file. `PROJECT_DIR/config/webpack.js`

```js
// config/webpack.js
import webpack from 'webpack';
import path from 'path';
import LessPluginCleanCSS from 'less-plugin-clean-css';

let debug = process.env.NODE_ENV === 'development';
let entry = [
  path.resolve(__dirname, '../assets/js/index.js') // set your main javascript file
];
let plugins = [
  // prevents the inclusion of duplicate code into your bundle
  new webpack.optimize.DedupePlugin()
];

if (debug) {
  // add this entries in order to enable webpack HMR in browser
  entry.push('webpack/hot/dev-server');
  entry.push('webpack-dev-server/client?http://localhost:3000/');

  // HMR plugin
  plugins.push(new webpack.HotModuleReplacementPlugin({
    multiStep: true
  }));
} else {
  // Minify bundle (javascript and css)
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    output: { comments: false },
    compress: { drop_console: true }
  }));
}

export default {
  webpack: {
    config: { // webpack config begin here
      entry,
      output: {
        path: path.resolve(__dirname, '../.tmp/public'), // sails.js public path
        filename: 'bundle.js' // or 'bundle-[hash].js'
      },
      debug,
      plugins,
      module: {
        preLoaders: [
          {
            test: /.(jpg|jpeg|png|gif|svg)$/, // Minify images using imagemin
            loader: 'image-webpack', // npm install --save image-webpack-loader
            query: {
              bypassOnDebug: true // do not minify when is in development mode
            }
          }
        ],
        loaders: [ // not all are necessary, choose wisely
          {
            test: /\.css$/, // load CSS files
            loaders: [
              'style', // npm install --save style-loader
              `css?root=${__dirname}/../assets`, // npm install --save css-loader
              'autoprefixer?browsers=last 2 versions' // npm install --save autoprefixer-loader
            ]
          },
          {
            test: /\.scss$/, // load SASS files
            loaders: [
              'style',
              'css',
              'autoprefixer?browsers=last 2 versions',
              'sass?sourceMap' // npm install --save sass-loader node-sass
            ]
          },
          {
            test: /\.less$/, // load LESS files
            loaders: [
              'style',
              'css',
              'autoprefixer?browsers=last 2 versions',
              'less?sourceMap' // npm install --save less-loader less
            ]
          },
          {
            test: /\.png$/, // load PNG using base64 encode
            loader: 'url?limit=100000' // npm install --save url-loader
          },
          {
            test: /\.(jpg|gif)$/, // load image files
            loader: 'file' // npm install --save file-loader
          },
          {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, // load SVG using base64 encode
            loader: 'url?limit=10000&mimetype=image/svg+xml'
          },
          {
            test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, // load font files
            loader: 'url?limit=10000&mimetype=application/font-woff'
          },
          {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, // load TTF font files
            loader: 'url?limit=10000&mimetype=application/octet-stream'
          },
          {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, // load EOT font files
            loader: 'file'
          }
        ]
      },
      sassLoader: { // config sass-loader
        includePaths: [
          path.resolve(__dirname, '../assets/'),
          // if you want to use compass
          // npm install --save compass-mixins
          path.resolve(__dirname, '../node_modules/compass-mixins/lib')
        ]
      },
      lessLoader: { // config less-loader
        lessPlugins: [
          new LessPluginCleanCSS({advanced: true})
        ]
      },
      imageWebpackLoader: { // config image-webpack-loader
        optimizationLevel: 6, // imagemin options
        progressive: true,
        interlaced: true,
        pngquant: { // pngquant custom options
          quality: '65-90',
          speed: 4
        },
        svgo: { // svgo custom options
          plugins: [
            { removeViewBox: false },
            { removeUselessStrokeAndFill: false }
          ]
        }
      }
    }, // webpack config ends here
    development: { // dev server config
      webpack: { }, // separate webpack config for the dev server or defaults to the config above
      config: { // webpack-dev-server config
        // This is handy if you are using a html5 router.
        historyApiFallback: true,
        // set value port as 3000,
        // open your browser at http://localhost:3000/ instead of http://localhost:1337/
        // for develop and debug your application
        port: 3000,
        // enable Hot Module Replacement with dev-server
        hot: true,
        // sails.js public path
        contentBase: path.resolve(__dirname, '../.tmp/public'),
        // bypass sails.js server
        proxy: {
          '*': {
            target: 'http://localhost:1337'
          }
        }
      }
    },
    watchOptions: {
      aggregateTimeout: 300
    }
  }
};
```

ES5:


```js
// config/webpack.js
var webpack = require('webpack');
var path = require('path');
var LessPluginCleanCSS = require('less-plugin-clean-css');

var debug = process.env.NODE_ENV === 'development';
var entry = [
  path.resolve(__dirname, '../assets/js/index.js') // set your main javascript file
];
var plugins = [
  // prevents the inclusion of duplicate code into your bundle
  new webpack.optimize.DedupePlugin()
];

if (debug) {
  // add this entries in order to enable webpack HMR in browser
  entry.push('webpack/hot/dev-server');
  entry.push('webpack-dev-server/client?http://localhost:3000/');

  // HMR plugin
  plugins.push(new webpack.HotModuleReplacementPlugin({
    multiStep: true
  }));
} else {
  // Minify bundle (javascript and css)
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    output: { comments: false },
    compress: { drop_console: true }
  }));
}

module.exports.webpack = {
  config: { // webpack config begin here
    entry: entry,
    output: {
      path: path.resolve(__dirname, '../.tmp/public'), // sails.js public path
      filename: 'bundle.js' // or 'bundle-[hash].js'
    },
    debug: debug,
    plugins: plugins,
    module: {
      preLoaders: [
        {
          test: /.(jpg|jpeg|png|gif|svg)$/, // Minify images using imagemin
          loader: 'image-webpack', // npm install --save image-webpack-loader
          query: {
            bypassOnDebug: true // do not minify when is in development mode
          }
        }
      ],
      loaders: [ // not all are necessary, choose wisely
        {
          test: /\.css$/, // load CSS files
          loaders: [
            'style', // npm install --save style-loader
            'css?root=' + __dirname + '/../assets', // npm install --save css-loader
            'autoprefixer?browsers=last 2 versions' // npm install --save autoprefixer-loader
          ]
        },
        {
          test: /\.scss$/, // load SASS files
          loaders: [
            'style',
            'css',
            'autoprefixer?browsers=last 2 versions',
            'sass?sourceMap' // npm install --save sass-loader node-sass
          ]
        },
        {
          test: /\.less$/, // load LESS files
          loaders: [
            'style',
            'css',
            'autoprefixer?browsers=last 2 versions',
            'less?sourceMap' // npm install --save less-loader less
          ]
        },
        {
          test: /\.png$/, // load PNG using base64 encode
          loader: 'url?limit=100000' // npm install --save url-loader
        },
        {
          test: /\.(jpg|gif)$/, // load image files
          loader: 'file' // npm install --save file-loader
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, // load SVG using base64 encode
          loader: 'url?limit=10000&mimetype=image/svg+xml'
        },
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, // load font files
          loader: 'url?limit=10000&mimetype=application/font-woff'
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, // load TTF font files
          loader: 'url?limit=10000&mimetype=application/octet-stream'
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, // load EOT font files
          loader: 'file'
        }
      ]
    },
    sassLoader: { // config sass-loader
      includePaths: [
        path.resolve(__dirname, '../assets/'),
        // if you want to use compass
        // npm install --save compass-mixins
        path.resolve(__dirname, '../node_modules/compass-mixins/lib')
      ]
    },
    lessLoader: { // config less-loader
      lessPlugins: [
        new LessPluginCleanCSS({advanced: true})
      ]
    },
    imageWebpackLoader: { // config image-webpack-loader
      optimizationLevel: 6, // imagemin options
      progressive: true,
      interlaced: true,
      pngquant: { // pngquant custom options
        quality: '65-90',
        speed: 4
      },
      svgo: { // svgo custom options
        plugins: [
          { removeViewBox: false },
          { removeUselessStrokeAndFill: false }
        ]
      }
    }
  }, // webpack config ends here
  development: { // dev server config
    webpack: { }, // separate webpack config for the dev server or defaults to the config above
    config: { // webpack-dev-server config
      // This is handy if you are using a html5 router.
      historyApiFallback: true,
      // set value port as 3000,
      // open your browser at http://localhost:3000/ instead of http://localhost:1337/
      // for develop and debug your application
      port: 3000,
      // enable Hot Module Replacement with dev-server
      hot: true,
      // sails.js public path
      contentBase: path.resolve(__dirname, '../.tmp/public'),
      // bypass sails.js server
      proxy: {
        '*': {
          target: 'http://localhost:1337'
        }
      }
    }
  },
  watchOptions: {
    aggregateTimeout: 300
  }
};
```



## 3. Lift!

```sh
sails lift
```

### Events

This hook provides events that can be listened to by using `sails.on(..event, ..fn)`

- **hook:sails-hook-webpack:compiler-ready**  - emitted when the compiler is initialised and ready, usually after the first build event.
- **hook:sails-hook-webpack:after-build** - emitted after each webpack build, the event data includes the webpack build stats.

### sails-linker

To replicate [`sails-linker`](http://sailsjs.org/documentation/anatomy/my-app/tasks/config/sails-linker-js) functionality, check out our [`linker-webpack-plugin`](https://github.com/teamfa/linker-webpack-plugin).

## License
MIT

## Maintained By
- [Mike Diarmid](https://github.com/salakar)

<img src='http://i.imgur.com/NsAdNdJ.png'>

[sails-logo]: http://cdn.tjw.io/images/sails-logo.png
[sails-url]: https://sailsjs.org
[npm-image]: https://img.shields.io/npm/v/sails-hook-webpack.svg?style=flat-square
[npm-url]: https://npmjs.org/package/sails-hook-webpack
[travis-image]: https://img.shields.io/travis/teamfa/sails-hook-webpack.svg?style=flat-square
[travis-url]: https://travis-ci.org/teamfa/sails-hook-webpack
[daviddm-image]: http://img.shields.io/david/teamfa/sails-hook-webpack.svg?style=flat-square
[daviddm-url]: https://david-dm.org/teamfa/sails-hook-webpack
