import { h, init } from 'snabbdom'

// 1. hello  world
// 参数：数组、模块
// init函数返回值：patch函数，作用对比两个vnode的差异更新到真实DOM
let patch = init([])


// h()第一个参数：标签+选择器
// h()第二个参数：如果是字符串的话就是标签中的内容
let vnode = h('div#container.cls', 'Hello World')

// #app的div是占位用的
let app = document.querySelector('#app')

// patch()第一个参数：可以是DOM元素，内容会把DOM元素转换成VNode
// patch()第二个参数：VNode
// 返回值：VNode
let oldVnode = patch(app, vnode)

// 假设的时刻(重新赋值，会更新DOM)
vnode = h('div', 'Hello Snabbdom')

patch(oldVnode,vnode)

// 2. div中放置子元素 h1, p
