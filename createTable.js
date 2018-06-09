
var options = process.argv;
console.log(options[2])
if(options.length==3){
let  tableName=options[2]
const table=require('./app/modal/'+tableName);
table.sync({force: true}).then(function(){
	console.log(tableName+"  Table Success")
})
}else{
	const Novel=require('./app/modal/novel');
const novelChapter=require('./app/modal/novelChapter');
Novel.sync({force: true}).then(function(){
	console.log(" Novel Table Success")
})

novelChapter.sync({force: true}).then(function(){
	console.log(" novelChapter Table Success")
})

const novelContent=require('./app/modal/novelContent');
novelContent.sync({force: true}).then(function(){
	console.log(" novelChonet Table Success")
})

const rule=require('./app/modal/rule');
rule.sync({force: true}).then(function(){
	console.log(" rule Table Success")
})
const user=require('./app/modal/user');
user.sync({force: true}).then(function(){
	console.log(" user Table Success")
})
const sysdd=require('./app/modal/sysdd');
sysdd.sync({force: true}).then(function(){
	console.log(" sysdd Table Success")
})
const sysdditem=require('./app/modal/sysdditem');
sysdditem.sync({force: true}).then(function(){
	console.log(" sysdditem Table Success")
})
}
