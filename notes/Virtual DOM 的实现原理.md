#### 什么是Virtual DOM

- Virtual DOM（虚拟DOM），是由普通的 JS 对象来描述 DOM 对象，因为不是真实的 DOM 对象，所以叫 Virtual DOM
- 真实 DOM 成员很多

#### 为什么使用 Virtual DOM

- 手动操作 DOM 比较麻烦，还需要考虑浏览器兼容问题，虽然有jQuery等库简化DOM操作，但是随着项目的复杂，DOM操作复杂提升
- 为了简化DOM的复杂操作，于是出现了各种MVVM框架，MVVM框架解决了视图和状态的同步问题
- 为了简化视图的操作，我们可以使用模板引擎，但是模板引擎没有解决跟踪状态变化的问题，于是Virtual DOM 出现了
- Virtual DOM 的好处是，当状态改变时不需要立即更新DOM，只需要创建一个虚拟树来描述DOM，Virtual DOM 内部将弄清楚如何有效（diff）的更新DOM
- 参考github上virtual-dom的描述
  - 虚拟DOM可以维护程序的状态，跟踪上一次的状态
  - 通过比较前后两次状态的差异更新真实DOM

#### 虚拟DOM的作用

- 维护视图和状态的关系
- 复杂视图情况下提升渲染性能
- 除了渲染DOM以外，还可以实现 SSR(Nuxt.js/Next.js)、原生应用(Weex/React Native)、小程序(mpvue/uni-app)等

#### Virtual DOM 库

- Snabbdom
  - Vue 2.x 内部使用的 Virtual DOM 就是改造的 Snabbdom
  - 大约 200 SLOC (single line of code)
  - 通过模块可扩展
  - 源码使用 TypeScript 开发
  - 最快的 Virtual DOM 之一
- virtual-dom

#### Snabbdom基本使用

##### 创建项目

- 打包工具为了方便使用 parcel

- 创建项目，并安装 parcel

  ````
  # 创建项目目录
  md snabbdom-demo
  # 进入项目目录
  cd snabbdom-demo
  # 创建 package-json
  yarn init -y
  # 本地安装 parcel
  yarn add parcel-bundler
  ````

- 配置 package.json 的script

  ````json
  "scripts": {
  	"dev": "parcel index.html --open",
  	"build": "parcel build index.html"
  }
  ````

- 创建目录结构

  ````
  | index.html
  | package.json
  |_src
  		01-basicusage.js
  ````

  #### Snabbdom 的核心
  
  - 使用 h() 函数创建 JavaScript 对象(VNode)描述真实的 DOM
  - init() 设置模块，创建 patch()
  - patch() 比较新旧两个Vnode
  - 把变化的内容更新到真实DOM树上
  
  #### snabbdom 原理
  
  - patch(oldVnode, newVnode)
  - 打补丁，把新节点中变化的内容渲染到真实DOM，最后返回新节点作为下一次处理的旧节点
  - 对比新旧Vnode，是否为相同节点（节点的key和sel相同）
  - 如果不是相同节点，删除之前的内容，重新渲染
  - 如果是相同节点，再判断新的Vnode 是否有 text，如果有text并且 和oldVnode 的 text 不同，直接更新文本内容
  - 如果新的 Vnode 有children，判断子节点是否有变化，判断子节点的过程使用的就是 diff 算法
  - diff 过程只进行同层级比较