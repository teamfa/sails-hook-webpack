import assert from 'assert'

describe('sails-webpack Hook', function () {

  it('should load', function () {
    assert(global.sails.hooks.webpack)
  })

})
