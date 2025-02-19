import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import './assets/less/index.less'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store/index.js'
import api from './api/api'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.config.globalProperties.$api = api
store.commit("addMenu", router);

function checkRouter(path) {
    let hasCheck = router.getRoutes().filter(route => route.path === path).length
    return !!hasCheck;
}

router.beforeEach((to, from, next) => {
    store.commit('getToken')
    const token = store.state.token
    if (!token && to.name !== 'login') {
        if (to.name === "QR"){
            next({name: 'QR'})
        }else {
            next({name: 'login'})
        }
    } else if (!checkRouter(to.path)) {
        next({name: 'home'})
    } else {
        next()
    }
})
app.use(router).use(store)
app.mount('#app')
