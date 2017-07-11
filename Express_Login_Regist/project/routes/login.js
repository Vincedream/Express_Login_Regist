/**
 * Created by vince on 2017/7/11.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.route('/')
    //处理GET请求
    .get(function (req, res, next) {
        res.render('login');
    })
    .post(function (req, res, next) {
        //获取表单内容
        var username = req.body.username;
        var password = req.body.password;
        //验证表单内容
        if(!username || !password){
            res.send('<p>用户名或者密码不能为空</p>');
            return;
        }

        //连接数据库，验证用户信息
        var db = mongoose.createConnection('mongodb://localhost:27017/mydb');
        var User = db.model('user', new mongoose.Schema({
            username: String,
            password: String
        }));
        User.findOne({username: username}, 'password', function (err, data, affectNums) {
            if(!data){
                res.send('<p>用户不存在</p>')
                return;
            }
            if(data.password === password){
                req.session.user = {username: username};
                res.redirect('/');
                return;
            }
            res.send('<p>用户名或者密码不正确</p>')
        })
    });
module.exports = router;