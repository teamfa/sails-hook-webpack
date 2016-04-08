var Sails = require('sails');
var path = require('path');
var sails;

before(function(done) {
  this.timeout(30000);

  var config = {
    appPath: path.resolve(__dirname, '..'),
    hooks: {
      grunt: false
    },
    log: {
      level: 'error'
    }
  };

  Sails.lift(config, function(err, server) {
    if (err) return done(err);

    global.sails = server;
    done(err, sails);
  });

});

after(function(done) {
  global.sails.lower(done);
});
