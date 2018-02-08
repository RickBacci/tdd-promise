'use strict'

const User = require('./User')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const db = require('./database')

chai.use(chaiAsPromised)
const expect = chai.expect

describe('User module', () => {
  describe('"up"', () => {
    function cleanUp () {
      return db.schema.dropTableIfExists('users')
    }

    before(cleanUp)
    after(cleanUp)

    it('should export a function', () => {
      expect(User.up).to.be.a('Function')
    })

    it('should return a Promise', () => {
      const usersUpResult = User.up()
      expect(usersUpResult.then).to.be.a('Function')
      expect(usersUpResult.catch).to.be.a('Function')
    })

    it('should create a table named "users"', function * () {
      yield User.up()

      return expect(db.schema.hasTable('users'))
        .to.eventually.be.true
    })
  })
})
