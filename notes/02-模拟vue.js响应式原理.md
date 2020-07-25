#### 数据驱动

- 数据响应式、双向绑定、数据驱动
- 数据响应式
  - 数据模型仅仅是普通的JavaScript对象，而当我们修改数据时，视图会进行更新，避免了繁琐的DOM操作，提高开发效率
- 双向绑定
  - 数据改变，视图改变；视图改变，数据改变
  - 我们可以使用v-model在表单元素上创建双向数据绑定
- 数据驱动是Vue最独特的特性之一
  - 开发过程中仅需要关注数据本身，不需要关心数据是如何渲染到视图的

#### 数据响应式核心原理 - Vue2

浏览器兼容IE8以上（不包括IE8），主要是因为defineProperty不支持，也不能向下转换，所以Vue只支持IE8及其以上版本

````html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>defineProperty 一个成员</title>
</head>

<body>
    <div id="app">hello</div>
</body>
<script>
    // 模拟 Vue 中的 data 选项
    let data = {
        msg: 'hello'
    }

    // 模拟Vue的实例
    let vm = {}

    // 数据劫持： 当访问或者设置 vm 的时候，做一些干预操作
    Object.defineProperty(vm, 'msg', {
        // 可枚举（可遍历）
        enumerable: true,
        // 可配置（可以使用 delete 删除，可以通过 defineProperty 重新定义）
        configurable: true,
        // 当获取值得时候执行
        get () {
            console.log('get', data.msg)
            return data.msg
        },
        // 当设置值得时候执行
        set (newVal) {
            console.log('set', newVal)
            if (newVal === data.msg) {
                return
            }
            data.msg = newVal
            // 数据更改，更新 DOM 的值
            document.querySelector('#app').textContent = data.msg
        }
    })

    // 测试
    vm.msg = 'Hello World'
    console.log(vm.msg)
</script>
</html>
````

````html

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>defineProperty 多个成员</title>
</head>

<body>
    <div id="app">hello</div>
</body>
<script>
    // 模拟 Vue 中的 data 选项
    let data = {
        msg: 'hello',
        count: 10
    }

    // 模拟Vue的实例
    let vm = {}

    proxyData(data)

    function proxyData (data) {
        // 遍历 data 对象中的属性
        Object.keys(data).forEach(key => {
            //把 data 中的属性，转换成 vm 的setter/getter
            // 数据劫持： 当访问或者设置 vm 的时候，做一些干预操作
            Object.defineProperty(vm, key, {
                // 可枚举（可遍历）
                enumerable: true,
                // 可配置（可以使用 delete 删除，可以通过 defineProperty 重新定义）
                configurable: true,
                // 当获取值得时候执行
                get () {
                    console.log('get', key, data[key])
                    return data[key]
                },
                // 当设置值得时候执行
                set (newVal) {
                    console.log('set', key, newVal)
                    if (newVal === data[key]) {
                        return
                    }
                    data[key] = newVal
                    // 数据更改，更新 DOM 的值
                    document.querySelector('#app').textContent = data[key]
                }
            })
        });
    }

    

    // 测试
    vm.msg = 'Hello World'
    console.log(vm.msg)
</script>
</html>
````

#### 数据响应式核心原理 - Vue3

- Proxy
- 直接监听对象，而非属性
- ES6中新增，IE不支持，性能由浏览器优化

````html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proxy</title>
</head>

<body>
    <div id="app">hello</div>
</body>
<script>
    // 模拟 Vue 中的 data 选项
    let data = {
        msg: 'hello',
        count: 10
    }

    // 模拟Vue的实例
    let vm = new Proxy(data, {
        // 执行代理行为的函数
        // 当访问 vm 的成员会执行
        //target 就是data
        get(target, key) {
            console.log('get', key, target[key])
            return target[key]
        },
        // 当设置值得时候执行
        set(target, key, newVal) {
            console.log('set, key: ', key, newVal)
            if (newVal === target[key]) {
                return
            }
            target[key] = newVal
            // 数据更改，更新 DOM 的值
            document.querySelector('#app').textContent = target[key]
        }
    })

    // 测试
    vm.msg = 'Hello World'
    console.log(vm.msg)
</script>

</html>
````

#### 发布订阅模式

- 订阅者
- 发布者
- 信号中心

> 我们假定，存在一个“信号中心”，某个任务执行完成，就向信号中心“发布”（publish）一个信号，从而知道什么时候自己可以开始执行，**这就叫做“发布订阅模式 ”（publish-subscribe pattern）**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>发布订阅模式</title>
</head>
<body>
    <script>
        // 事件触发器
        class EventEmitter {
            constructor () {
                // {'click': [fn1, fn2], 'change': [fn1,fn2]}
                this.subs = Object.create(null)
            }

            // 注册事件
            $on (eventType, handler) {
                this.subs[eventType] = this.subs[eventType] || []
                this.subs[eventType].push(handler)
            }

            // 触发事件
            $emit (eventType) {
                if (this.subs[eventType]) {
                    this.subs[eventType].forEach(handler => {
                        handler()
                    });
                }
            }
        }

        // 测试
        let em = new EventEmitter()
        em.$on('change', () => {
            console.log('change1')
        })

        em.$on('change', () => {
            console.log('change2')
        })

        em.$emit('change')
    </script>
</body>
</html>
```

输出：

````
click1
click2
````

#### 观察者模式

- 观察者（订阅者）-- Watcher
  - update(): 当时间发生时，具体要做的事情
- 目标（发布者）-- Dep
  - subs数组: 存储所有的观察者
  - addSub(): 添加观察者
  - notify(): 当事件发生，调用所有观察者的 update() 方法
- 没有事件中心

````html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>观察者模式</title>
</head>
<body>
    <script>
        // 发布者 - 目标
        class Dep {
            constructor () {
                // 记录所有的订阅者
                this.subs = []
            }
            // 添加订阅者
            addSub (sub) {
                if (sub && sub.update) {
                    this.subs.push(sub)
                }
            }
            // 发布通知
            notify () {
                this.subs.forEach(sub => {
                    sub.update()
                })
            }
        }

        // 订阅者 - 观察者
        class Watcher {
            update () {
                // 这里订阅者可以做想做的事
                console.log('update')
            }
        }

        // 测试
        let dep = new Dep()
        let watch = new Watcher()

        dep.addSub(watch)
        dep.notify()
    </script>
</body>
</html>
````

输出：

````
update
````

#### 发布订阅和观察者模式总结

- **观察者模式**是由具体目标调度，比如当事件触发，Dep就会去调用观察者的方法，所以观察者模式的订阅者和发布者之间是存在依赖的
- **发布/订阅模式**是由统一调度中心调用，因此发布者和订阅者不需要知道对方的存在