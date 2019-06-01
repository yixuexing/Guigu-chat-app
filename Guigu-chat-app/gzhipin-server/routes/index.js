var express = require('express');
var router = express.Router();

const {UserModel,ChatModel} = require('../db/models');
const md5 = require ("blueimp-md5");
const filter = {password:0, __v:0};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
//注册一个路由：用户注册
/*a)path:/register
b)请求方式:post
c)接收username和password参数
d）admin是已注册用户
e）注册成功返回:{code:0,data:{_id:'abc',username:'xxx',password:'123'}}
f)注册失败返回:{code:1,msg:"c此用户已存在"}*/
/*router.post("/register",function(req,res){
  //获取请求参数
    const {username,password} = req.body;
   //处理
  if(username==='admin'){//注册会失败
    //返回响应数据(失败)
       res.send({code:1,msg:'此用户已存在xixi'})
  }else{//注册会成功
    //返回响应数据（成功)
       res.send({code:0,data:{id:'abc123',username,password}})
  }
})*/
//注册的路由
router.post('/register',function(req,res){
  //获取请求参数
  const{username,password,type}= req.body;
  //处理数据
  // 2.1根据 username 查询数据库 , 看是否已存在 user
  UserModel.findOne({username},function(err,user){
    if (user){
      res.send({code:1,msg:'该用户名已存在'})
    } else {
        //如果不存在，将提交的User保存到数据库
        new UserModel({username, type, password: md5(password)}).save(function (error, user) {
            res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24});
            const data = {username,type,_id:user._id};
            res.send({code: 0,data})//返回的数据不携带密码
        })
    }
    })
  });
//登陆的路由
 router.post('/login',function(req,res){
   const {username,password} = req.body;
     UserModel.findOne({username,password:md5(password)},filter,function(err,user){
       if(user){//登陆成功
           res.cookie('userid',user._id,{maxAge:1000*60*60*24})
           res.send({code:0,data:user})
       }else {//登陆失败
           res.send({code: 1, msg: '用户名或密码错误！'})
       }
     })
 });
//更新用户信息的路由
router.post('/update',function(req,res){
const userid = req.cookies.userid;
//如果不存在，直接返回一个提示信息结果
if(!userid){
    return res.send({code:1,msg:'请先登录'});
}
//存在，根据userid更新对应的user文档数据
//得到提交的用户数据
    const user = req.body;
    UserModel.findByIdAndUpdate({_id:userid},user,function (error,oldUser) {
    if(!oldUser){//没有id,通知浏览器删除user
        res.clearCookie('userid');
        res.send({code:1,msg:'请先登录'});
    }else{
        const {_id,username,type} = oldUser;
        const data = Object.assign({_id,username,type},user);
        res.send({code:0,data});
    }
});
});
//获取用户信息的路由
router.get('/user',function (req,res) {
    const userid = req.cookies.userid;
    if(!userid){
        return res.send({code:1,msg:"请先登录"});
    }
    UserModel.findOne({_id:userid},filter,function (error,user) {
        if(user){
            res.send({code:0,data:user});
        }else{
            res.clearCookie('userid');
            res.send({code:1,msg:'请先登录'});
        }
    })
});
//获取用户列表
router.get('/userlist',function(req,res){
    const {type}  = req.query;
    UserModel.find({type},filter,function (error,users) {
        res.send({code:0,data:users})
    })
});
//获取当前用户所有相关聊天消息列表
router.get('/msglist',function (req,res) {
      //获取cookie中的userid
      const userid = req.cookies.userid;
      //查询得到所有user文档数组
      UserModel.find(function(err,userDocs) {
          //用对象存储所有user信息，key为user的_id，val为name和header组成的user对象
          const users = userDocs.reduce((users, user) => {
              users[user._id] = {username: user.username, header: user.header}
              return users
          }, {})
          /*查询userid相关的所有聊天信息
            参数1：查询条件
            参数2：过滤条件
            参数3：回调函数
          */
          ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
              //返回包含所有用户和当前用户相关的所有聊天消息的数据
              res.send({code: 0, data: {users, chatMsgs}})
          })
      })
});
//修改指定消息为已读
router.post('/readmsg',function (req,res) {
   //得到请求中的from和to
    const from = req.body.from;
    const to = req.cookies.userid;
    /*更新数据库中的chat数据
      参数1：查询条件
      参数2：更新为指定的数据对象
      参数3：是否1次更新多条，默认只更新一条
      参数4：更新完成的回调函数
    */
    ChatModel.update({from,to,read:false},{read:true},{multi:true},function (err,doc){
      console.log('readmsg',doc);
      res.send({code:0,data:doc.nModified});//更新的数量
    })
});
module.exports = router;

