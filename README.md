
[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]

Webpack asset pipeline hook for Sails.

## 1. Install
```sh
npm install sails-hook-webpack --save
```

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

### b. Set your environment variable.

By default, Sails ([and express](http://stackoverflow.com/a/16979503/291180)) sets `NODE_ENV=development`.
With this setting, webpack in dev will watch for changes in the directories you specify in your `config/webpack.js`. In prod webpack will just run your webpack configuration.


| `NODE_ENV` | webpack mode | description |
|:---|:---|:---|
| `development` | [`webpack.watch()`](https://webpack.github.io/docs/configuration.html#watch) | Rebuilds on file changes during runtime |
| `staging` or `production` | `webpack.run()` | Build bundle once on load. |

### c. Configure Webpack

This hook uses the standard [Webpack Configuration](https://webpack.github.io/docs/configuration.html).

Below is an example of using webpack to compile a [React.js](https://facebook.github.io/react/) application located in `assets/js/`.

```js
// config/webpack.js
import webpack from 'webpack';

// compile js assets into a single bundle file
export default {
  webpack: {
    options: {
      devtool: 'eval',
      entry: [
        './assets/js',
      ],
      output: {
        path: path.resolve(__dirname, '.tmp/public/js'),
        filename: 'bundle.js'
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
      ],
      module: {
        loaders: [
          // requires "npm install --save-dev babel-loader"
          { test: /\.js$/, loaders: ['babel-loader'] },
          { test: /\.css$/, loader: 'style!css' }
        ]
      }
    },

    // docs: https://webpack.github.io/docs/node.js-api.html#compiler
    watchOptions: {
      aggregateTimeout: 300
    }
  }
};
```

## 3. Lift!

```sh
sails lift
```

### Events

This hook provides events that can be listened to by using `sails.on(..event, ..fn)`

- **hook:sails-hook-webpack:compiler-ready**  - emitted when the compiler is initialised and ready.
- **hook:sails-hook-webpack:after-build** - emitted after each webpack build, the event data includes the webpack build stats.

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
