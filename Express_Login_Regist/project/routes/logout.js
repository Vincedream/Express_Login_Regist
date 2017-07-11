/**
 * Created by vince on 2017/7/11.
 */
var express = require('express');
var router = express.Router();

router.get('/',function (req, res, next) {
    if(req.session.user){
        delete req.session.user;  //删除session，退为未登录状态
    }
    res.redirect('/');  //重定向到主页
    return;
});

module.exports = router;