let httpMocks = require('node-mocks-http')
let chai = require('chai')
let sinon = require('sinon')
let todoController = require('../controllers/todo')
let todoSchema = require('../models/todo')

chai.should()

describe('todo', function () {
  let req
  let res

  beforeEach (function () {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
  })

  describe('create', function () {
    it('정상적인 작동',async function () {

    })
  })

  describe('load', function () {
    it('정상적인 작동',async function () {

    })
  })

  describe('update', function () {
    it('정상적인 작동',async function () {

    })
  })

  describe('remove', function () {
    it('정상적인 작동',async function () {

    })
  })
}
