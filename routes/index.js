var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('这是我的第一个node项目，我一定要好好做，不能半途而废');
});

module.exports = router;
