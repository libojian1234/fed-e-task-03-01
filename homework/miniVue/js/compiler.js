class Compiler {
    constructor (vm) {
        this.el = vm.$el
        this.vm = vm
        this.compile(this.el)
    }
    // 编译模板，处理文本节点和元素节点
    compile (el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            // 处理文本节点
            if (this.isTextNode(node)) {
                this.compileText(node)
            } else if(this.isElementNode(node)) {
                this.compileElement(node)
            }
            
            // 判断node节点，是否有子节点，如果有子节点，要递归调用comlipe
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }
    // 编译元素节点，处理指令 v-  
    compileElement (node) {
        console.log(node.attributes)
        // 遍历所有的属性节点
        Array.from(node.attributes).forEach(attr => {
            // 判断是否是指令（是否 v- 开头）
            let attrName = attr.name
            if (this.isDirective(attrName)){
                // v-text --> text
                // v-on --> on
                attrName = attrName.substr(2)
                // on:click="handler" --> handler
                let key = attr.value
                this.update(node, key, attrName)

                // 判断是否是处理事件的指令
                if (this.isEventDirective(attrName)) {
                    this.eventHandler(node, this.vm, attrName, key)
                }

            } else if (this.isDirectiveShorthand(attrName)) {
                // @click --> click
                // @input --> input
                attrName = attrName.replace(/\@/, 'on:')
                // @click="handler" --> handler
                let key = attr.value
                this.update(node, key, attrName)
                // 判断是否是处理事件的指令
                if (this.isEventDirective(attrName)) {
                    this.eventHandler(node, this.vm, attrName, key)
                }
            }
        })
        
    }
    // 判断是否是处理事件的指令
    isEventDirective (attrName) {
        return attrName.indexOf('on') === 0
    }
    eventHandler (node, vm, attrName, fnName) {
        // attrName是(on:click   on:input)
        let eventType = attrName.substr(attrName.indexOf(':') + 1)
        let fn = this.vm.$options.methods && this.vm.$options.methods[fnName]
        fn && node.addEventListener(eventType, fn.bind(this.vm))
    }
    update (node, key, attrName) {
        let updateFn = this[attrName + 'Update']
        // 用call改变this的指向，调用updateFn不是指向的Compiler，现在我们需要指向Compiler
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }
    // 处理 v-text 指令(v-text 用textContent赋值)
    textUpdate (node, value, key) {
        node.textContent = value
        // 创建watcher对象，当数据改变更新视图
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }
    // 处理 v-model指令(v-model 用value赋值)
    modelUpdate (node, value, key) {
        node.value = value
        // 创建watcher对象，当数据改变更新视图
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })

        // 双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }
    // 处理 v-html 指令
    htmlUpdate (node, value, key) {
        node.innerHTML = value
        // 创建watcher对象，当数据改变更新视图
        new Watcher(this.vm, key, (newValue) => {
            node.innerHTML = newValue
        })
    }
    // 编译文本节点，处理差值表达式{{  }}
    compileText (node) {
        // console.dir 打印的结果是对象
        // console.dir(node)
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])

            // 创建watcher对象，当数据改变更新视图
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }
    }
    // 判断元素属性是否是指令
    isDirective (attrName) {
        return attrName.startsWith('v-')
    }
    // 判断元素属性是否是@指令的简写
    isDirectiveShorthand (attrName) {
        return attrName.startsWith('@')
    }
    // 判断节点是否是文本节点
    isTextNode (node) {
        return node.nodeType === 3
    }
    // 判断节点是否是元素节点
    isElementNode (node) {
        return node.nodeType === 1
    }
}