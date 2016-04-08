var Sails = require('sails');
var sails;

before(function(done) {
  this.timeout(30000);

  var config = {
    hooks: {
      webpack: require('./../lib'),
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
