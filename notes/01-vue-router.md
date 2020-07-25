#### 动态路由

````javascript
{
    path: '/about/:id',
    name: 'About',
    //开启props，会把URL 中的参数传递给组件
    //在组件中通过props 来接收URL 参数
    props: true,
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
````

````vue
<script>
export default {
  name: 'About',
  props: ["id"]
}
</script>
````

#### 编程式导航

1. this.$router.replace('/parh') ||  this.$router.replace(name:'router name')   会改变当前的历史为/path
2. this.$router.push('/parh') ||  this.$router.push(name:'router name')   不会改变当前的历史
3. this.$router.go(-1) 返回到上个页面  this.$router.go(-2) 返回到上上个页面

#### Hash和History模式的区别

##### 表现形式的区别

- Hash模式
  - https://music.163.com/#/playlist?id=123434
- History模式
  - https://music.163.com/playlist/123434

##### 原理的区别

- Hash模式是基于锚点，以及onhashchange事件
- Histoty模式是基于HTML5中的History API
  - history.pushState()      IE10以后才支持
  - history.replaceState()

#### Histoty 模式的使用

- History 需要服务器的支持
- 单页运用中，服务端不存在https://www.testurl.com/login 这样的地址，会返回找不到该页面
- 在服务端应该除了静态资源外都返回单页应用的index.html

#### History 模式 - nginx

````
# nginx.conf
...
location / {
	root html;
	index index.html index.htm;
	# 配置下面这个命令可解决history模式下，刷新出现404的情况
	try_files $url $url/ index.html;
}
...
````

#### History 模式 - node

````javascript
//app.js
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
````

> node app.js

#### Vue Router 实现原理

##### Vue 前置知识

- 插件
- 混入
- Vue.observable()
- 插槽
- render 函数
- 运行时和完整版的Vue

##### Hash 模式

- URL中# 后面的内容作为路径地址
- 监听hashchange事件
- 根据当前路由地址找到对应组件重新渲染

##### History 模式

- 通过history.pushState() 方法改变地址栏
- 监听popstate 事件
- 根据当前路由地址找到对应组件重新渲染

##### Vue的构建版本

- 运行时版：不支持template 模板，需要打包的时候提前编译
- 完整版：包含运行时和编译器，体积比运行时版大10k左右，程序运行的时候把模板转换成render函数
- vue-cli默认使用运行时版

##### 模拟history模式的vue-router

````javascript
//router/index.js中载入import VueRouter from 'vue-router'替换成import VueRouter from '../vuerouter'即可
//vue-router.js
let _Vue = null

export default class VueRouter {
  static install (Vue) {
    // 1. 判断当前插件是否已经被安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    // 2. 把Vue 构造函数记录到全局变量
    _Vue = Vue
    // 3. 把创建Vue 实例时候传入的router对象注入到Vue实例上
    // _Vue.prototype.$router = this.$options.router   //如果在这里调用，this指向VueRouter，我们需要指向Vue
    // 混入
    _Vue.mixin({
      beforeCreate () {
        // vue实例和组件都会执行beforeCreate，这里判断一下，this.$options.router只有在vue实例中才有，组件中没有
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  constructor (options) {
    this.options = options
    this.routeMap = {}
    this.data = _Vue.observable({
      current: '/'
    })
  }

  init () {
    this.createRouteMap()
    this.initCommponents(_Vue)
    this.initEvent()
  }

  createRouteMap () {
    // 遍历所有的路由规则、把路由规则解析成键值对的形式，存储到routeMap 中
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  // 运行时版的不支持template，需要打包的时候提前编译，可以在vue.config.js中设置runtimeCompiler: true
  // initCommponents (Vue) {
  //   Vue.component('router-link', {
  //     props: {
  //       to: String
  //     },
  //     template: '<a :href="to"><slot></slot></a>'
  //   })
  // }

  // 运行时，这里把template转换成render函数
  initCommponents (Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      render (h) {
        return h('a', {
          attrs: {
            href: this.to
          },
          on: {
            click: this.clickHandler
          }
        }, [this.$slots.default])
      },
      methods: {
        // 解决点击router-link页面刷新的问题（加载想要的组件，阻止a的默认行为）
        clickHandler (e) {
          history.pushState({}, '', this.to)
          this.$router.data.current = this.to
          e.preventDefault()
        }
      }
    })
    // this是VueRouter的实例
    const self = this
    Vue.component('router-view', {
      render (h) {
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }

  initEvent () {
    window.addEventListener('popstate', () => {
      // 把地址传给current，会加载这个组件
      this.data.current = window.location.pathname
    })
  }
}

````

