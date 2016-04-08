import assert from 'assert'

describe('sails-hook-webpack Hook', function () {
  it('should load', function () {
    assert(global.sails.hooks.webpack)
  })
});
