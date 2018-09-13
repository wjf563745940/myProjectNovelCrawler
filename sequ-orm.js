const Sequelize=require('sequelize');

var sequelize ;
if(!sequelize){
   sequelize= new Sequelize(
    'crawler', // 数据库名
    'root',   // 用户名
    '1qazxsw2',   // 用户密码
    {
        'dialect': 'mysql',  // 数据库使用mysql
        'host': 'localhost', // 数据库服务器ip
        'port': 3306,        // 数据库服务器端口
        
        'logging':false,
        'pool':{
             max: 5,
    min: 0,
    idle: 10000
        }
    }
); 
}
module.exports=sequelize;

