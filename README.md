
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

export default {
  webpack: {
    config: { },  // webpack config here
    development: { // dev server config
      webpack: { }, // separate webpack config for the dev server or defaults to the config above
      config: { // webpack-dev-server-config
        port: 3000
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

module.exports.webpack = {
    config: { },  // webpack config here
    development: { // dev server config
      webpack: { }, // separate webpack config for the dev server or defaults to the config above
      config: { // webpack-dev-server-config
        port: 3000
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
