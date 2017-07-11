var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //设置user，若还没有session，则user为空
  var user = req.session.user;
  res.render('index',{user:user});
});

module.exports = router;
