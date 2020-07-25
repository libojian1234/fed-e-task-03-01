// 2. div中放置子元素 h1, p
import { h, init } from 'snabbdom'

let patch = init([])

let vnode = h('div#container', [
    h('h1', 'Hello Snabbdom'),
    h('p', '这里是p标签')
])

let app = document.querySelector('#app')

let oldVnode = patch(app,vnode)

// 2秒钟后改变DOM
// setTimeout(() =>{
//     vnode = h('dev#container', [
//         h('h1', 'Hello World'),
//         h('p', 'Hello P')
//     ])
//     patch(oldVnode,vnode)
// }, 2000)

// 2秒钟后清空页面元素
// patch(oldVnode, null)   官网写法，错误的
setTimeout(()=> {
    patch(oldVnode, h('!'))
}, 2000)