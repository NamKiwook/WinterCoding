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

  describe('load', function () {
    let find
    let expect
    beforeEach (function () {
      find = sinon.stub(todoSchema,'find')
      expect = {_id: '5bdcc852afe19836582172f7', complete: false, delete: false, title: 'example', content: 'example content', deadline: Date.now(), priority: 10}
    })
    afterEach(function () {
      find.restore()
    })
    it('정상적인 작동',async function () {
      find.returns({
        sort: () => {
          return [expect]
        }
      })
      await todoController.load(req,res)
      res.statusCode.should.equal(200)
    })

    it('DB Error', async function () {
      find.throws('MongoError', 'DB ERROR')
      await todoController.load(req,res)
      res.statusCode.should.equal(503)
      res._getData().should.property('errorMessage')
    })
  })

  describe('create', function () {
    let expect
    let countDocuments
    let save
    beforeEach (function () {
      save = sinon.stub(todoSchema.prototype,'save')
      countDocuments = sinon.stub(todoSchema,'countDocuments')
      expect = {title: 'example', content: 'example content', priority: 2}
    })
    afterEach(function () {
      save.restore()
      countDocuments.restore()
    })
    it('정상적인 작동',async function () {
      countDocuments.resolves(1)
      save.resolves(new todoSchema({title: expect.title, content: expect.content, priority: expect.priority}))
      req.body = {title: expect.title, content: expect.content}
      await todoController.create(req, res)
      res.statusCode.should.equal(200)
      res._getData().should.property('title',expect.title)
      res._getData().should.property('content',expect.content)
      res._getData().should.property('deadline',expect.deadline)
      res._getData().should.property('priority',expect.priority)
    })

    it('req.body.title이 없는 경우',async function () {
      countDocuments.resolves(1)
      save.resolves(new todoSchema({ content: expect.content, priority: expect.priority}))
      req.body = {content: expect.content}
      await todoController.create(req, res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'Not Filled')
    })

    it('req.body.content가 없는 경우',async function () {
      countDocuments.resolves(1)
      save.resolves(new todoSchema({title: expect.title, priority: expect.priority}))
      req.body = {title: expect.title}
      await todoController.create(req, res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'Not Filled')
    })

    it('DB Error',async function () {
      countDocuments.resolves(1)
      save.throws('MongoError', 'DB ERROR')
      req.body = {title: expect.title, content: expect.content}
      await todoController.create(req,res)
      res.statusCode.should.equal(503)
      res._getData().should.property('errorMessage')
    })
  })

  describe('complete', function () {
    let updateOne
    beforeEach(function() {
      updateOne = sinon.stub(todoSchema,'updateOne')
    })
    afterEach(function() {
      updateOne.restore()
    })
    it('정상적인 작동',async function () {
      updateOne.resolves({n: 1, nModified: 1, ok: 1})
      req.body.todoId = '5bdcc852afe19836582172f7'
      await todoController.complete(req,res)
      res.statusCode.should.equal(200)
    })

    it('todoId가 없는 경우', async function () {
      updateOne.resolves({n: 1, nModified: 1, ok: 1})
      await todoController.complete(req,res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'Not Filled')
    })

    it('존재하지않는 todoId인 경우', async function () {
      updateOne.resolves({n: 0, nModified: 0, ok: 1})
      req.body.todoId = '5bdcc852afe19836582172f7'
      await todoController.complete(req,res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'invalid ToDo')
    })

    it('DB Error', async function () {
      updateOne.throws('MongoError', 'DB ERROR')
      req.body.todoId = '5bdcc852afe19836582172f7'
      await todoController.complete(req,res)
      res.statusCode.should.equal(503)
      res._getData().should.property('errorMessage')
    })
  })

  describe('modifyPriority', function () {
    let updateOne
    let find
    let findOne
    beforeEach(function() {
      findOne = sinon.stub(todoSchema,'findOne')
      updateOne = sinon.stub(todoSchema,'updateOne')
      find = sinon.stub(todoSchema,'find')
    })
    afterEach(function(){
      findOne.restore()
      updateOne.restore()
      find.restore()
    })

    it('정상적인 작동',async function () {
      findOne.resolves(new todoSchema({title: 'example', content: 'example content', priority: 2}))
      find.returns({
        sort: () => {
          return [new todoSchema({title: 'example1', content: 'example content1', priority: 1})]
        }
      })
      updateOne.resolves()
      req.body.todoId = '5bdcc852afe19836582172f7'
      req.body.up = true
      await todoController.modifyPriority(req,res)
      res.statusCode.should.equal(200)
    })

    it('todoId가 없는 경우',async function () {
      await todoController.modifyPriority(req,res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'Not Filled')
    })

    it('존재하지않는 todoId인 경우',async function () {
      findOne.resolves()
      req.body.todoId = '5bdcc852afe19836582172f7'
      req.body.up = true
      await todoController.modifyPriority(req,res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'invalid ToDo')
    })

    it('DB Error',async function () {
      findOne.throws('MongoError', 'DB ERROR')
      req.body.todoId = '5bdcc852afe19836582172f7'
      req.body.up = true
      await todoController.modifyPriority(req,res)
      res.statusCode.should.equal(503)
      res._getData().should.property('errorMessage')
    })
  })

  describe('modifyDeadline', function () {
    let updateOne
    beforeEach(function() {
      updateOne = sinon.stub(todoSchema,'updateOne')
    })
    afterEach(function() {
      updateOne.restore()
    })
    it('정상적인 작동',async function () {
      updateOne.resolves({n: 1, nModified: 1, ok: 1})
      req.body.todoId = '5bdcc852afe19836582172f7'
      req.body.deadline = Date.now()
      await todoController.modifyDeadline(req,res)
      res.statusCode.should.equal(200)
    })

    it('todoId가 없는 경우', async function () {
      updateOne.resolves({n: 1, nModified: 1, ok: 1})
      req.body.deadline = Date.now()
      await todoController.modifyDeadline(req,res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'Not Filled')
    })

    it('존재하지않는 todoId인 경우', async function () {
      updateOne.resolves({n: 0, nModified: 0, ok: 1})
      req.body.todoId = '5bdcc852afe19836582172f7'
      req.body.deadline = Date.now()
      await todoController.modifyDeadline(req,res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'invalid ToDo')
    })

    it('DB Error', async function () {
      updateOne.throws('MongoError', 'DB ERROR')
      req.body.todoId = '5bdcc852afe19836582172f7'
      req.body.deadline = Date.now()
      await todoController.modifyDeadline(req,res)
      res.statusCode.should.equal(503)
      res._getData().should.property('errorMessage')
    })
  })

  describe('modifyContent', function () {
    let updateOne
    beforeEach(function() {
      updateOne = sinon.stub(todoSchema,'updateOne')
    })
    afterEach(function() {
      updateOne.restore()
    })
    it('정상적인 작동',async function () {
      updateOne.resolves({n: 1, nModified: 1, ok: 1})
      req.body.todoId = '5bdcc852afe19836582172f7'
      req.body.content = 'example content'
      await todoController.modifyContent(req,res)
      res.statusCode.should.equal(200)
    })

    it('todoId가 없는 경우', async function () {
      updateOne.resolves({n: 1, nModified: 1, ok: 1})
      req.body.content = 'example content'
      await todoController.modifyContent(req,res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'Not Filled')
    })

    it('content가 없는 경우', async function () {
      updateOne.resolves({n: 1, nModified: 1, ok: 1})
      req.body.todoId = '5bdcc852afe19836582172f7'
      await todoController.modifyContent(req,res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'Not Filled')
    })


    it('존재하지않는 todoId인 경우', async function () {
      updateOne.resolves({n: 0, nModified: 0, ok: 1})
      req.body.todoId = '5bdcc852afe19836582172f7'
      req.body.content = 'example content'
      await todoController.modifyContent(req,res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'invalid ToDo')
    })

    it('DB Error', async function () {
      updateOne.throws('MongoError', 'DB ERROR')
      req.body.todoId = '5bdcc852afe19836582172f7'
      req.body.content = 'example content'
      await todoController.modifyContent(req,res)
      res.statusCode.should.equal(503)
      res._getData().should.property('errorMessage')
    })
  })

  describe('modifyTitle', function () {
    let updateOne
    beforeEach(function() {
      updateOne = sinon.stub(todoSchema,'updateOne')
    })
    afterEach(function() {
      updateOne.restore()
    })
    it('정상적인 작동',async function () {
      updateOne.resolves({n: 1, nModified: 1, ok: 1})
      req.body.todoId = '5bdcc852afe19836582172f7'
      req.body.title = 'example'
      await todoController.modifyTitle(req,res)
      res.statusCode.should.equal(200)
    })

    it('todoId가 없는 경우', async function () {
      updateOne.resolves({n: 1, nModified: 1, ok: 1})
      req.body.title = 'example'
      await todoController.modifyTitle(req,res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'Not Filled')
    })

    it('title이 없는 경우', async function () {
      updateOne.resolves({n: 1, nModified: 1, ok: 1})
      req.body.todoId = '5bdcc852afe19836582172f7'
      await todoController.modifyTitle(req,res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'Not Filled')
    })


    it('존재하지않는 todoId인 경우', async function () {
      updateOne.resolves({n: 0, nModified: 0, ok: 1})
      req.body.todoId = '5bdcc852afe19836582172f7'
      req.body.title = 'example'
      await todoController.modifyTitle(req,res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'invalid ToDo')
    })

    it('DB Error', async function () {
      updateOne.throws('MongoError', 'DB ERROR')
      req.body.todoId = '5bdcc852afe19836582172f7'
      req.body.title = 'example'
      await todoController.modifyTitle(req,res)
      res.statusCode.should.equal(503)
      res._getData().should.property('errorMessage')
    })
  })

  describe('remove', function () {
    let updateOne
    beforeEach(function() {
      updateOne = sinon.stub(todoSchema,'updateOne')
    })
    afterEach(function() {
      updateOne.restore()
    })
    it('정상적인 작동',async function () {
      updateOne.resolves({n: 1, nModified: 1, ok: 1})
      req.body.todoId = '5bdcc852afe19836582172f7'
      await todoController.remove(req,res)
      res.statusCode.should.equal(200)
    })

    it('todoId가 없는 경우', async function () {
      updateOne.resolves({n: 1, nModified: 1, ok: 1})
      await todoController.remove(req,res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'Not Filled')
    })

    it('존재하지않는 todoId인 경우', async function () {
      updateOne.resolves({n: 0, nModified: 0, ok: 1})
      req.body.todoId = '5bdcc852afe19836582172f7'
      await todoController.remove(req,res)
      res.statusCode.should.equal(400)
      res._getData().should.property('errorMessage', 'invalid ToDo')
    })

    it('DB Error', async function () {
      updateOne.throws('MongoError', 'DB ERROR')
      req.body.todoId = '5bdcc852afe19836582172f7'
      await todoController.remove(req,res)
      res.statusCode.should.equal(503)
      res._getData().should.property('errorMessage')
    })
  })
})
