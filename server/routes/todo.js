let express = require('express')
let router = express.Router()
let todo = require('../controllers/todo')

router.get('/', todo.load)

router.post('/', todo.create)

router.put('/', todo.update)

router.delete('/', todo.remove)

router.get('/list', todo.list)

module.exports = router;
