const path = require('path')
//导入吹history 模式的模块
const history = require('connect-history-api-fallback')
//导入express
const express = require('express')

const app = express()
//注册处理history 模式的中间件
//如果屏蔽掉app.use(history())，刷新的时候会找不到路由
app.use(history())
//处理静态资源的中间件，网站根目录 ../web
app.use(express.static(path.join(__dirname, '../web')))

//开启服务器，端口3000
app.listen(3000, () => {
    console.log('服务器已开启，端口：3000')
})