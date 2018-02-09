'use strict'

const User = require('./User')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const db = require('./database')

chai.use(chaiAsPromised)
const expect = chai.expect
const _ = require('lodash')
const logger = require('winston').logger
const sinon = require('sinon')

describe('User module', () => {
  describe('up', () => {
    function cleanUp () {
      return db.schema.dropTableIfExists('users')
    }

    before(cleanUp)
    after(cleanUp)

    it('should export a function', () =>
      expect(User.up).to.be.a('Function')
    )

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
  });

  describe('fetch', () => {
    it('exports a function', () => {
      it('exports a function', () => {
        expect(User.fetch).to.be.a('Function')
      });


      describe('with inserted rows', () => {
        const testName = 'Peter';

        before( () => User.up() )

        beforeEach( () =>
          Promise.all([
            db.insert({
              name: testName
            }).into('users'),
            db.insert({
              name: 'John'
            }).into('users')
          ])
        )

        it('returns a Promise', () => {
          const usersFetchResult = User.fetch(testName);

          expect(usersFetchResult.then).to.be.a('Function')
          expect(usersFetchResult.catch).to.be.a('Function')
        });

        it('returns users by name', () => {
          expect(
            User.fetch(testName).then(_.map(_.omit(['id', 'created_at', 'updated_at'])))
          ).to.eventually.be.eq([{ name: 'Peter' }])
        });

        it('returns users with timestamps and id', () => {
          expect(User.fetch(testName).then((users) => { users[0] }))
            .to.eventually.have.keys('created_at', 'updated_at', 'id', 'name')
        });

        it('should call winston if name is all lowercase', function * () {
          sinon.spy(logger, 'info')
          yield User.fetch(testName.toLocaleLowerCase())

          console.log('adfafasfasfasfasdfasfasdfasfasf')
          expect(logger.info).to.have.been.calledWith('lowercase parameter supplied')
          logger.info.restore()
        })

      });

    });

  });

});

