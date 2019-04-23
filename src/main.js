// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// vuex
import store from './store/index'
// el-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// api
import {server} from 'api/api'
// 添加 server 接口
Vue.prototype.$server = server

// 组件网站标题
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

/**
 * 路由拦截
 */
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})


// 环信IM
import websdk from 'easemob-websdk'
let WebIM = window.WebIM = websdk
Vue.prototype.$WebIM = WebIM

var conn = new WebIM.connection({    
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,    
  https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',    
  url: WebIM.config.xmppURL,    
  heartBeatWait: WebIM.config.heartBeatWait,    
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,    
  autoReconnectInterval: WebIM.config.autoReconnectInterval,    
  apiUrl: WebIM.config.apiURL,    
  isAutoLogin: true
});

const options = {    
  apiUrl: WebIM.config.apiURL,    
  user: '****',
  pwd: '1',    
  appKey: WebIM.config.appkey,    
  success:function (token) {        
    console.log(' %c 登陆成功', 'color: green')    
    console.log(token)
  },    
  error:function (err) {    
    console.log('%c *** err ***', 'color: red')    
    console.log(err)
  }
}

Vue.prototype.$imConn = conn
Vue.prototype.$imoption = options



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
