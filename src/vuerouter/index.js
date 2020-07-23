let _Vue = null
/*eslint-disable*/ 
export default class VueRouter {
    static install (Vue) {
        // 判断插件是否安装过
        if (VueRouter.install.installed) {
            return
        } 
        VueRouter.install.installed = true
        // 把Vue构造函数记录到全局变量
        _Vue = Vue
        // 把创建Vue实例时传入的router对象注入到所有Vue实例上
        // 混入
        _Vue.mixin({
            beforeCreate() {
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                    this.$options.router.init()
                }
                
            }
        })
    }
    constructor(options) {
        this.options = options
        this.routeMap = {}
        // vue 提供的observable可以把对象处理成响应式
        this.data = _Vue.observable({
            current: this.initCurrentPath()
        })
    }

    // isModeHash 判断是否是 hash模式
    isModeHash() {
        return this.options.mode === 'hash'
    }

    // 获取初始路由地址，用户刷新时的路由
    initCurrentPath() {
        if (this.isModeHash()) {
            // hash模式, 如果当前为路径为/,自动修改为/#/
            if (location.hash === '') {
                console.log('shezh')
                history.pushState({}, '', '#/')
            }
            return location.hash.substr(1)
        } else {
            return location.pathname
        }
    }
    

    init() {
        this.createRouteMap()
        this.initComponents(_Vue)
        this.initEvent()
    }

    // 把路由规则转换成键值对，存储到routeMap
    createRouteMap() {
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        })
    }

    initComponents(Vue) {
        // 处理hash模式下，href前添加 #， url pathname 前添加 #
        const basepath = this.isModeHash() ? '#' : ''
        Vue.component('router-link', {
            props: {
                to: String
            },
            // 运行时不支持 模板写法，可以添加vue配置文件vue.config.js,配置runtimeCompiler: true
            // template: '<a :href="to"><slot></slot></a>', // <slot></slot> 插槽，占位
            // 这里不适用编译器的方式
            render(h) {
                
                
                return h('a', {
                    attrs: {
                        href: basepath + this.to,
                    },
                    on: {
                        click: this.clickHandler 
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandler (e) {
                    // 阻止链接刷新浏览器的默认事件，并改变浏览器url显示
                    history.pushState({}, '', basepath + this.to)
                    this.$router.data.current = this.to
                    e.preventDefault()
                }
            }
        })

        const self = this
        Vue.component('router-view', {
            render(h) {
                const component = self.routeMap[self.data.current]
                return h(component)
            }
        })
    }

    initEvent() {
        window.addEventListener('popstate', () => {
            this.data.current = window.location.pathname
        })
    }
}