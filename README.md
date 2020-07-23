## vue-router 原理

模拟实现一个`vue-router`,详见 [vuerouter/index.js](./src/vuerouter/index.js)

借助vuecli 搭建一个vue-router项目，替换掉VueRouter部分为我们自定义的类，目前实现的功能
- [x] history 模式
- [x] hash 模式
- [x] router-view
- [x] router-link



### vue-router 结构

#### 类图

| VueRouter |
| --------- |
| + options <br/> + data <br/> + routeMap|
| + Constructor(Options):VueRouter <br/> _ install(Vue): void <br/> + init(): void <br/> + initEvent(): void <br/> + createRouteMap(): void <br/> + initComponents(Vue): void |

- `options` 记录构造函数中的对象
- `data` 响应式对象
  - `current` 记录当前路由地址
- `routeMap` 记录路由和组件的对应关系 

- `install` 静态方法实现`vue`插件
- `initEvent` 监听浏览器地址变化
- `createRouteMap` 出事话`routeMap` 属性，把构造函数的路由规则转换成键值对存在routeMap中
- `initComponents` 创建`router-link`和`router-view`两个组件