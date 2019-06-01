/*
使用 mongoose 操作 mongodb 的测试文件
1. 连接数据库
1.1. 引入 mongoose
1.2. 连接指定数据库 (URL 只有数据库是变化的 )
1.3. 获取连接对象
1.4. 绑定连接完成的监听 ( 用来提示连接成功 )
2. 得到对应特定集合的 Model
2.1. 字义 Schema( 描述文档结构 )
2.2. 定义 Model( 与集合对应 , 可以操作集合 )
3. 通过 Model 或其实例对集合数据进行 CRUD 操作
3.1. 通过 Model 实例的 save() 添加数据
3.2. 通过 Model 的 find()/findOne() 查询多个或一个数据
3.3. 通过 Model 的 findByIdAndUpdate() 更新某个数据
3.4. 通过 Model 的 remove() 删除匹配的数据
*/
/*1.连接数据库*/
const md5 = require('blueimp-md5');
//1.1引入mongoose
const mongoose = require('mongoose');
//1.2连接指定数据库（URL只有数据库是变化的）
mongoose.connect('mongodb://localhost:27017/gzhipin_test');
//1.3获取连接对象
const conn = mongoose.connection;
//1.4绑定连接完成的监听（用来提示连接成功）
conn.on('connected',function(){//连接成功回调
    console.log("数据库连接成功啦！YE！！！");
})
/*2.得到特定集合的Model*/
//2.1定义Schema（描述文档结构）
const userSchema = mongoose.Schema({//指定文档结构:属性名/属性值的类型,是否是必要的，默认值
    username:{type:String,required:true},
    password:{type:String,required:true},
    type:{type:String,required:true},
    header:{type:String}
})
//2.2定义Model(与集合对应，可以操作集合)
const UserModel = mongoose.model('user',userSchema)//集合的名称：users,第一个参数必须是集合名去掉s
/*3. 通过 Model 或其实例对集合数据进行 CRUD 操作*/
//3.1. 通过 Model 实例的 save() 添加数据
function testsave(){
    //创建UserModel的实例
    const userModel = new UserModel({username:'Bob',password:md5('123'),type:'laoban'})
    //调用save()保存,要知道保存成功与否要写回调函数function
    userModel.save(function(error,user){
        console.log('save()',error,user)
    })
}
//testsave()
//3.2. 通过 Model 的 find()/findOne() 查询多个或一个数据
function testfind(){
    //查询多个
    UserModel.find({_id:'5ce56f53d4a9b923c8cfcebe'},function (error,users) {//得到的是包含所有匹配文档对象的数组，如果没有匹配的就是[]
       console.log('find()',error,users)
    })
    //查询一个
    UserModel.findOne({_id:'5ce56f53d4a9b923c8cfcebe'},function (error,user) {
        //得到的是匹配文档对象，如果没有匹配的就是null
        console.log('findOne()',error,user)
    })
}
//testfind()
//3.3. 通过 Model 的 findByIdAndUpdate() 更新某个数据
function testUpdate(){
    UserModel.findByIdAndUpdate({_id:'5ce56f53d4a9b923c8cfcebe'},{username:'Tom'},function(error,oldUser){
        console.log('findByIdAndUpdate()',error,oldUser)
    })
}
//testUpdate()
//3.4. 通过 Model 的 remove() 删除匹配的数据
function testDelete(){
    UserModel.remove({_id:'5ce56f53d4a9b923c8cfcebe'},function(error,result){
        console.log('remove()',error,result)
    })
}
//testDelete()