let express = require('express')
let router = express.Router()
let path = require('path')

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

module.exports = router
