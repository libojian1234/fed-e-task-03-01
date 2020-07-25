class Watcher {
    constructor (vm, key, cb) {
        this.vm = vm
        // data中的属性名称
        this.key = key
        // 回调函数负责更新视图
        this.cb = cb

        // 把watcher对象记录到Dep类的静态属性target
        Dep.target = this
        // 触发get方法，在get方法中会调用addSub，访问vm[key]是就会触发Observer中的get方法，就会调用addSub
        this.oldValue = vm[key]
        // 已经调用了addSub 添加了这个watcher，把Dep.target置空防止以后重复添加
        Dep.target = null
    }
    // 当数据发生变化的时候更新视图
    update () {
        let newValue = this.vm[this.key]
        if (this.oldValue === newValue) {
            return
        }
        this.cb(newValue)
    }
}