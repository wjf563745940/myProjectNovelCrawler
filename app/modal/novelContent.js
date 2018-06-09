const Sequelize=require('sequelize');
let sequelize=require('../../sequ-orm');
let NovleContent = sequelize.define(
    // 默认表名（一般这里写单数），生成时会自动转换成复数形式
    // 这个值还会作为访问模型相关的模型时的属性名，所以建议用小写形式
    'novel_content',
    // 字段定义（主键、created_at、updated_at默认包含，不用特殊定义）
    {
        'content': {
            'type': Sequelize.TEXT('long'), // 字段类型
            'allowNull': false,         // 是否允许为NULL
        },
        'novel_chapter_id': {
            'type': Sequelize.INTEGER, // 字段类型
            'allowNull': false,         // 是否允许为NULL
        },
        'novel_id': {
            'type': Sequelize.INTEGER, // 字段类型
            'allowNull': false,         // 是否允许为NULL
        }
    },
    {//提供给Sequelize 构造函数的一些默认值
    	// 自定义表名
        'freezeTableName': true,
        'tableName': 'novel_content',
    }
);
module.exports=NovleContent