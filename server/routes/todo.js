let express = require('express')
let router = express.Router()
let todo = require('../controllers/todo')

router.get('/', todo.load)

router.post('/', todo.create)

router.put('/complete', todo.complete)

router.put('/content', todo.modifyContent)

router.put('/title', todo.modifyTitle)

router.put('/deadline', todo.modifyDeadline)

router.put('/priority', todo.modifyPriority)

router.delete('/', todo.remove)

module.exports = router;
