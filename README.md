今天我们来尝试一个对新手来说比较有挑战的demo，实现一个用户注册登录登出的项目，来吧～
原文连接：http://www.vinceo.cn/2017/07/11/Express-EJS-Mongo-%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E7%94%A8%E6%88%B7%E6%B3%A8%E5%86%8C%E7%99%BB%E5%BD%95%E7%99%BB%E5%87%BA/
## 一、准备工作
- 必要条件：已经安装好了node环境和Mongo数据库，并且启动Mongo数据库

#### 具体步骤：

1、在全局安装express构造器

```
npm install express -g
```

2、新建文件夹，cd到该文件夹，用express的构造器快速搭建一个express骨架，取名为project

```
express project -e
```

3、cd到project项目目录，安装依赖包

```
cd project
npm install
```
4、因为expree构造器搭建的express初始项目都是为3000端口，而在实际项目开发的时候，3000端口往往被你不小心占用了，并且忘记关闭端口，所以我们修改初始项目中的默认端口，编译器打开project项目，找到bin目录下的www.js文件，将"var port = normalizePort(process.env.PORT || '3000');"中的3000，换成3008～

![image](http://osutuwgm1.bkt.clouddn.com/F10E1638-C81B-4FAA-990C-884F8B27DFB6.png)

5、安装我们下面要用到的两个插件express-session和mongoose

```
npm i express-session mongoose -s
```


6、在project根目录下，命令行输入npm start启动express项目

```
npm start
```

7、浏览器输入 http://localhost:3008/ ，如果出现这个，那么恭喜你第一步准备工作已经完成

![image](http://osutuwgm1.bkt.clouddn.com/F7A6125A-5DAE-4063-904E-0CE8935EFCBB.png)

- 准备工作完成，进入下一步～

## 二、路由和视图布局
- 这里我先简单地将整个项目的视图和路由大概地搭建起来，循序渐进嘛，满满来～

### 视图

1、在views中修改index.ejs为：

```
<!DOCTYPE html>
<html>
  <head>
    <title>index</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1>This is Index Page</h1>
    <a href="/login">Login Page</a>
    <a href="/register">Register Page</a>
  </body>
</html>

```
- 为啥我们这里会有两个href超链接呢，因为方便多个页面跳转

2、在views中新建登录页面 login.ejs，代码为：

```
<!DOCTYPE html>
<html>
<head>
    <title>index</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
</head>
    <body>
         <h1>This is Login Page</h1>
         <a href="/">Index Page</a>
         <a href="/register">Register Page</a>
    </body>
</html>

```

3、在views中新建注册页面 register.ejs，代码为：

```
<!DOCTYPE html>
<html>
<head>
    <title>index</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
</head>
    <body>
        <h1>This is Register Page</h1>
        <a href="/">Index Page</a>
        <a href="/login">Login Page</a>
    </body>
</html>

```
- ok，视图编写好啦，接下来我们来编写路由～

### 路由
1、修改routes文件夹中的index.js为：

```
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;

```

2、在routes文件夹中新建login.js，输入代码：

```
/**
 * Created by vince on 2017/7/11.
 */
var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login');
});

module.exports = router;

```

3、在routes文件夹中新建register.js，输入代码：

```
/**
 * Created by vince on 2017/7/11.
 */
var express = require('express');
var router = express.Router();

/* GET register page. */
router.get('/', function(req, res, next) {
    res.render('register');
});

module.exports = router;

```
4、在app.js中引入路由：
- 将以下代码：
```
var index = require('./routes/index');
var users = require('./routes/users');
```
- 修改为：

```
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
```
5、在app.js中设置路由：
- 将以下代码：

```
app.use('/', index);
app.use('/users', users);
```

- 修改为：

```
app.use('/', index);
app.use('/users', users);
app.use('/login',login);
app.use('/register',register);
```
6、路由配置完成，其实在4和5步中我们添加的代码如下所示：

![image](http://osutuwgm1.bkt.clouddn.com/FA162CC1-9425-417B-A0EF-F6243E983075.png)

7、npm start运行项目：

![image](http://osutuwgm1.bkt.clouddn.com/12831961-A947-4805-90E1-0EBC6CAC3619.png)

- 框架已经搭建好啦，我们开始书写逻辑代码～

## 三、实现登录与注册
### 1、session会话与cookie
我们要实现登录登出，session和cookie是少不了的，它在这个项目中的用处就是当用户已经登录后，在一定时间范围里不必再次输入账号密码，关于session和cookie详细知识，小伙伴们可以查看这篇文章：[cookie 和session 的区别详解](http://www.cnblogs.com/shiyangxt/articles/1305506.html)

- 在express中使用session，我们一般用express-session这个中间件


1、在app.js中引入中间件

```
var session = require('express-session');
```
2、在app.js中设置session与cookie

```
app.use(session({
    secret: 'nice_to_meet_you',
    cookie: {
        maxAge: 15*60*1000,
        secure: false
    }
}));
```
- {secret : ...}用于签名 session id，为啥要做个签名？因为要防止存在客户端浏览器cookie 下的 session id 被恶意篡改。
- {cookie:{maxAge:..., secure : false}}用来配置存入 cookie 中的 session id。maxAge表示有效期多久单位为 ms，以及允许http请求条件下也写入 cookie，若 secure 为 true，则用 http访问页面，session id 将不被写入 cookie，https反之。
4、设置完session和cookie，我们现在app.js中代码如下：

```
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'nice_to_meet_you',
    cookie: {
        maxAge: 15*60*1000,
        secure: false
    }
}));


app.use('/', index);
app.use('/users', users);
app.use('/login',login);
app.use('/register',register);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

```

### 2、主页设置
上一步我们设置好了session和cookie，那我们在主页怎么体现用户是登录状态还是未登录状态呢？

- 完善index主页

1、修改routes中的index.js为：

```
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //设置user，若还没有session，则user为空
  var user = req.session.user;
  res.render('index',{user:user});
});

module.exports = router;

```
- 当访问http://localhost:3008/时，如果已经登录，则会将session传入到user变量当中，如果没登录，那么user就为空

2、修改views中index.ejs为：

```
<!DOCTYPE html>
<html>
  <head>
    <title>index</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1>This is Index Page</h1>
    <% if(user && user.username) { %>
    <p><%= user.username %>你好，欢迎来到Index</p>
    <a href="/logout">退出</a>
    <% }else{ %>
    <p>您还没有登陆，请登陆之后再操作</p>
    <a href="/login">登陆</a>
    <a href="/register">注册</a>
    <% } %>
  </body>
</html>

```
- index.ejs分析从index.js传过来的user，若有user则显示用户已经登录，若user为空，显示未登陆
 
3、重新启动npm start，查看index页面

![image](http://osutuwgm1.bkt.clouddn.com/C13E49BD-1053-46A3-8D9F-8DA262AFBA3D.png)

### 3、实现登录
- #### 将routes中的login.js改为：

```
/**
 * Created by vince on 2017/7/11.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.route('/')
    .get(function (req, res, next) {
        res.render('login');
    })
    .post(function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        if(!username || !password){
            res.send('<p>用户名或者密码不能为空</p>');
            return;
        }

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
```

#### 代码解读：
- 因为要用到数据库，我们引入mongoose,如果对mongoose不太熟悉的小伙伴可以看下我的另外一篇文章，传送门： [「全栈初探」- Mongoose的简单使用](http://www.vinceo.cn/2017/07/10/%E3%80%8C%E5%85%A8%E6%A0%88%E5%88%9D%E6%8E%A2%E3%80%8D-Mongoose%E7%9A%84%E7%AE%80%E5%8D%95%E4%BD%BF%E7%94%A8/)

```
var mongoose = require('mongoose');
```
- 当GET请求时，直接渲染login主页

```
.get(function (req, res, next) {
        res.render('login');
    })
```
- 用户填写表单，提交POST的form表单数据，获取username和password数据

```
.post(function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        if(!username || !password){
            res.send('<p>用户名或者密码不能为空</p>');
            return;
        }
```
- 连接数据库，将表单中的username和数据库中的username匹配，并且验证password是否一致

```
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
```

- #### 修改views中的login.ejs为：

```
<!DOCTYPE html>
<html>
<head>
    <title>index</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
</head>
    <body>
         <h1>This is Login Page</h1>
         <form action="/login" method="post">
             <label><span>Account:</span><input type="text" name="username"></label>
             <label><span>Password:</span><input type="password" name="password"></label>
             <input type="submit" value="Login" >
         </form>
         <a href="/register">还没账号 ?</a>
    </body>
</html>

```
- 登录的逻辑代码完成啦，现在重新启动项目，查看login页面：

![image](http://osutuwgm1.bkt.clouddn.com/4F8A398E-D4CB-4F6D-A26B-49FB71D4840E.png)


### 4、实现注册
- 同样修改routes中的register.js为：

```
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

```
- 修改views中register的代码为：

```
<!DOCTYPE html>
<html>
<head>
    <title>index</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
</head>
    <body>
    <h1>This is Login Page</h1>
    <form action="/register" method="post" id="reg-form">
        <label><span>用户名:</span><input type="text" name="username"></label>
        <label><span>密码:</span><input type="password" name="password"></label>
        <label><span>确认密码:</span><input type="password" name="password-confirm"></label>
        <input type="submit" value="注册">
    </form>
    <a href="/login">已有账号？</a>
    <script>
    //验证表单
        (function(g, undefined){
            var form = document.querySelector('#reg-form'),
                username = document.querySelector('input[name=username]'),
                password = document.querySelector('input[name=password]'),
                rePassword = document.querySelector('input[name=password-confirm]');

            form.addEventListener('submit', function(e){
                e = e || event;
                e.preventDefault();
                if(username.value == "" || password.value == "" ){
                    alert('用户名或者密码不能为空');
                    return false;
                }

                if(password.value == ''){
                    alert('确认密码不能为空');
                    return false;
                }

                if(password.value !== rePassword.value ){
                    alert('两次密码输入不一致');
                    return false;
                }
                this.submit();
            }, false)
        })(this);
    </script>
    </body>
</html>

```
- 虽然我们在register中已经验证过表单，但是这里给大家参考一下啦～

- 到这里我们已经完成了注册，重启项目，访问register，注册试一试：

![image](http://osutuwgm1.bkt.clouddn.com/B9A6CA30-1021-4966-8711-27E8A62CB2BE.png)

- 注册成功后，跳转到index主页：

![image](http://osutuwgm1.bkt.clouddn.com/35C08130-8B5E-4916-9EA0-D5A848203AAF.png)


- 查看数据库中数据：

![image](http://osutuwgm1.bkt.clouddn.com/D533FED1-00F7-4082-A3C7-54DE29F0E0BE.png)

到这里我们已经完成了注册和登录，兴奋吧～，别忘了我们还有登出功能没实现哦

### 5、实现登出
1、我们在routes中新建logout.js。输入代码：

```
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
```

2、回到app.js中向上面那样设置路由
添加代码：

```
var logout = require('./routes/logout');
app.use('/logout',logout);
```
如图：

![image](http://osutuwgm1.bkt.clouddn.com/01E52F89-8405-48F4-A593-688CB82C81C9.png)

- 到现在为止，所有代码已经完成啦，重启项目试试吧～

## 总结
- 这个小demo中我们学会了如何设置路由、session与cookie的使用、mongo数据库读写、ejs的基本使用，收获还是不错的～
- 作为新手入门，代码写到到这里差不多了。当然在实际业务中，登录注册远比现在复杂，验证码也是必须的，折旧等着小伙伴们自己去探索吧～
- 代码已经放入GitHub中，传送门: [Express + EJS + Mongo 实现一个用户注册登录登出](https://github.com/Vincedream/Express_Login_Regist)
- 如果你觉得对你有帮助，给个star鼓励啦～
- nice to meet you～

