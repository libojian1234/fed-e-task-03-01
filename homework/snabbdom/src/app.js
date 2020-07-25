import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'
import { styleModule } from 'snabbdom/build/package/modules/style'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'

const patch = init([
    styleModule,
    eventListenersModule
])

let data = [
    {id: 1, name: '剑圣', age: 90, elmHeight: 0, offsetTop: 0},
    {id: 2, name: '女王', age: 29, elmHeight: 0, offsetTop: 0},
    {id: 3, name: '虚空', age: 57, elmHeight: 0, offsetTop: 0},
    {id: 4, name: '赏金', age: 66, elmHeight: 0, offsetTop: 0},
    {id: 5, name: '大牛', age: 34, elmHeight: 0, offsetTop: 0},
    {id: 6, name: '小牛', age: 23, elmHeight: 0, offsetTop: 0},
    {id: 7, name: '蓝猫', age: 43, elmHeight: 0, offsetTop: 0}
]

// 获取最后一个 hero 的id
let lastId = data[data.length - 1] ? data[data.length - 1].id + 1 : 1
let oldVnode = null

function render (heroes) {
    // 第一个 hero 的 offsetTTop 等于 10
    data[0] && (data[0].offsetTop = 10)
    // 从第二个 hero 起， 每一个 hero 的 offsetTop 都等于他上一个 hero 对象的 offsetTop + elm的高度 + 10
    for (let i = 1; i < data.length; i++) {
        let preHero = data[i-1]
        let hero = data[i]
        hero.offsetTop = preHero.offsetTop + preHero.elmHeight + 10
    }

    // 第二种写法
    // data.reduce((arr, hero) => {
    //     let last = arr[arr.length - 1]
    //     hero.offsetTop = last ? last.offsetTop + last.elmHeight + 10 : 10
    //     return arr.concat(hero)
    // }, [])

    oldVnode = patch(oldVnode, view(heroes))
}

function  view(heroes) {
    return h('div.main', [
        h('div.btn-group', [
            h('div.btn.add', {on: { click: add}}, '增加'),
            h('div.btn.sort', {on: {click: sort}}, '排序')
        ]),
        h('div.content', [heroListView(heroes)])
    ])
}

function  heroListView(heroes) {
    return h(
        'ul',
        heroes.map(hero => {
            return h(
                'li.hero',
                {
                    key: hero.id,
                    hook: {
                        insert: vnode => {
                            hero.elmHeight = vnode.elm.offsetHeight
                        }
                    },
                    style: {
                        opacity: 0,
                        // transition: ['opacity 5s linear','transform 5s linear'],
                        // transition: 'all 2s linear',
                        transform: `translateY(0px)`,
                        delayed: {
                            opacity: 1,
                            transform: `translateY(${hero.offsetTop}px)`
                        },
                        remove: {
                            opacity: 0
                        }
                    }
                },
                [
                   h('div', [
                       h(
                           'span.left',
                           {
                               style: {
                                   destroy: {
                                       color: 'red'
                                   }
                               }
                           },
                           '姓名：' + hero.name
                       ),
                       h(
                           'span.left.l30',
                           {
                               style: {
                                   destroy: {
                                       color: 'blue'
                                   }
                               }
                           },
                           '年龄：' + hero.age
                       ),
                       h('span.right.close', {on: {click: [closeX, hero.id]}}, 'X')
                   ]) 
                ]
            )
        })
    )
}

// 增加
function add() {
    lastId++
    data.unshift({
        name: Math.floor(Math.random() * 10000).toString(16).substr(0, 2),
        age: Math.floor(Math.random() * 100),
        id: lastId,
        elmHeight: 42,
        offsetTop: 10
    })
    render(data)
}

// 删除
function closeX (id) {
    data = data.filter(hero => {
        return hero.id !== id
    })
    render(data)
}

// 排序
function sort () {
    data = data.sort((a,b) => {
        return a.age - b.age
    })
    render(data)
}

let app = document.querySelector('#app')
oldVnode = patch(app, view(data))

render(data)