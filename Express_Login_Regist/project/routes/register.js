/**
 * Created by vince on 2017/7/11.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.route('/')
    .get(function (req, res, next) {
        res.render('register');
    })
    .post(function (req, res, next) {
        //获取post的表单数据
        var username = req.body.username,
            password = req.body.password,
            passwordComfirm = req.body['password-confirm'],
            userData = {username: username, password: password}; //这才是我们最终需要的数据
        //验证账号密码是否为空
        if(username == '' || password == ''){
            res.json({
                'message':'Password or Account can not be null'
            });
            return;
        }
        //验证两次密码是否一致
        if(password !== passwordComfirm){
            res.json({
                'message':'Password and confirm password do not match'
            });
            return;
        }
        //连接数据库
        var db = mongoose.createConnection('mongodb://localhost:27017/mydb');
        var Schema = new mongoose.Schema({
            username: String,
            password: String
        });
        var User = db.model('user',Schema);

        //数据库查重，如果已经存在账号，那么注册失败
        User.findOne({username: username},function (err, data) {
            if(err){
                res.send(err);
            }
            if(data){
                res.send('<p>Account already exists</p>');  //账号重复，注册失败
                return;
            }
            //如果没有错误，将新的账号密码存储在数据库中
            User.create(userData,function (err, data, affectNums) {
                if(err){
                    res.json({
                        message: err
                    });
                    return;
                }
                if(affectNums == 0){
                    res.send('<p> Register Error </p>');
                    return;
                }
                req.session.user = {username: username}; //注册完成后，自动设置session，表示用户已经登录
                res.redirect('/'); //返回index页面
            });
        })
    });
module.exports = router;
