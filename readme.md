## 一、简答题

### 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。

```javascript
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```

> 不是响应式数据，这样写就行了： this.$set(this.dog, 'name', 'Trump')，
>
> 原理是：$set 调用了defineProperty

### 2、请简述 Diff 算法的执行过程

- 首先执行用户设置的 prepatch 钩子函数
- 执行  create 钩子函数
  - 首先执行模块的 create 钩子函数
  - 然后执行用户设置的 create 钩子函数
- 如果 vnode.text 未定义
  - 如果 oldVnode.children 和 oldVnode.children 都有值
    - 调用 updateChildren()
    - 使用 diff 算法对比子节点，更新子节点
  - 如果 vnode.children 有值，oldVnode.children 无值
    - 清空 DOM 元素
    - 调用 addVnodes()，批量添加子节点
  - 如果 oldVnode.children 有值，vnode.children 无值
    - 调用 remiveVnodes()，批量移除子节点
  - 如果 oldVnode.text 有值
    - 清空 DOM 元素的内容
- 如果设置了 Vnode.text 并且和 oldVnode.text 不等
  - 如果老节点有子节点，全部移除
  - 设置 DOM 元素的 textContent 为 vnode.text
- 最后执行用户设置的 postpatch 钩子函数

## 二、编程题

代码在homework文件夹下