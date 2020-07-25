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
            href: '#' + this.to
          }
        }, [this.$slots.default])
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
    window.addEventListener('hashchange', () => {
      // 把地址传给current，会加载这个组件
      console.log(window.location.hash)
      this.data.current = window.location.hash.substr(1)
    })
  }
}
