const Sequelize=require('sequelize');
let sequelize=require('../../sequ-orm');
let Novle = sequelize.define(
    // 默认表名（一般这里写单数），生成时会自动转换成复数形式
    // 这个值还会作为访问模型相关的模型时的属性名，所以建议用小写形式
    'novel',
    // 字段定义（主键、created_at、updated_at默认包含，不用特殊定义）
    {
        'name': {
            'type': Sequelize.STRING, // 字段类型
            'allowNull': false,         // 是否允许为NULL
        },
        'url': {
            'type': Sequelize.STRING, // 字段类型
            'allowNull': false,         // 是否允许为NULL
        },
        'url_space': {
            'type': Sequelize.STRING, // 字段类型
            'allowNull': false,         // 是否允许为NULL
        },
        'allchapter': {
            'type': Sequelize.INTEGER, // 字段类型
            //'allowNull': false,         // 是否允许为NULL
        },
        'chaptered': {
            'type': Sequelize.INTEGER, // 字段类型
            //'allowNull': false,         // 是否允许为NULL
        },
        'rule': {
            'type': Sequelize.INTEGER, // 字段类型
            //'allowNull': false,         // 是否允许为NULL
        },
         'charset': {
            'type': Sequelize.STRING, // 字段类型
            //'allowNull': false,         // 是否允许为NULL
        },
         'statusType': {
            'type': Sequelize.INTEGER, // 字段类型
            'allowNull': true,         // 是否允许为NULL
        },
         'statusName': {
            'type': Sequelize.STRING, // 字段类型
            'allowNull': true,         // 是否允许为NULL
        },
        
    },
    {
    	// 自定义表名
        'freezeTableName': true,
        'tableName': 'novel',
    }
);
module.exports=Novle