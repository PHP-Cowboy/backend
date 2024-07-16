import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [

    //首页
    {
        path: '/',
        component: () => import('../views/main.vue'),
        name: 'home1',
        redirect: '/home',
        children: [

            {
                path: '/home',
                name: 'home',
                component: () => import('../views/home.vue')
            }
        ],
    },
    // 登录
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue'),
        children: [],
    },

    //设置
    {
        path: '/QR',
        name: 'QR',
        component: () => import('../views/QR.vue'),
        children: [],
    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router