import {createStore} from 'vuex'
import Cookie from 'js-cookie'
import router from "../router/index.js";

export default createStore({
    state: {
        isCollapse: true,
        currentMenu: null,
        tabsList: [
            {
                path: '/',
                name: 'home',
                label: '首页',
                icon: 'home'
            }
        ],
        menu: [],
        token: ''
    },
    mutations: {
        updateIsCollapse(state, payload) {
            state.isCollapse = !state.isCollapse
        },
        selectMenu(state, val) {
            // 判断

            if (val.name === 'home') {
                state.currentMenu = null
            } else {
                state.currentMenu = val
                let result = state.tabsList.findIndex(item => item.name === val.name)
                result === -1 ? state.tabsList.push(val) : ''
            }
        },
        closeTab(state, val) {
            let res = state.tabsList.findIndex(item => item.name === val.name)
            state.tabsList.splice(res, 1)

        },
        setMenu(state, val) {
            state.menu = val
            localStorage.setItem('menu', JSON.stringify(val))
        },
        addMenu(state, router) {
            // console.log(router.options.routes)
            if (!localStorage.getItem('menu')) {
                return
            }
            const menu = JSON.parse(localStorage.getItem('menu'))
            state.menu = menu

            const rs = [
                //首页
                {
                    path: '/home',
                    name: 'home',
                    redirect: '/home',
                    children: [
                        {
                            path: '/statistics',
                            name: 'statistics',
                            component: () => import('../views/home/statistics.vue')
                        },
                        {
                            path: '/hourData',
                            name: 'hourData',
                            component: () => import('../views/home/hourData.vue')
                        },
                        {
                            path: '/hourGameData',
                            name: 'hourGameData',
                            component: () => import('../views/home/hourGameData.vue')
                        },
                    ],
                },
                //设置
                {
                    path: '/setting',
                    name: 'setting',
                    redirect: '/setting',
                    children: [
                        {
                            path: '/settingDict',
                            name: 'settingDict',
                            component: () => import('../views/setting/dict.vue')
                        },
                        {
                            path: '/settingMenu',
                            name: 'settingMenu',
                            component: () => import('../views/setting/menu.vue')
                        },
                        {
                            path: '/settingRole',
                            name: 'settingRole',
                            component: () => import('../views/setting/role.vue')
                        },
                        {
                            path: '/settingUser',
                            name: 'settingUser',
                            component: () => import('../views/setting/user.vue')
                        },
                        {
                            path: '/settingQr',
                            name: 'settingQr',
                            component: () => import('../views/setting/qr.vue')
                        },
                    ],
                },
                //礼包
                {
                    path: '/gift',
                    name: 'gift',
                    redirect: '/gift',
                    children: [
                        {
                            path: '/event',
                            name: 'event',
                            component: () => import('../views/gift/event.vue')
                        },
                        {
                            path: '/event',
                            name: 'event',
                            component: () => import('../views/gift/event.vue')
                        },
                        {
                            path: '/rechargeGift',
                            name: 'rechargeGift',
                            url:'',
                            component: () => import('../views/gift/rechargeGift.vue')
                        },
                        {
                            path: '/rechargePack',
                            name: 'rechargePack',
                            component: () => import('../views/gift/rechargePack.vue')
                        },
                        {
                            path: '/vip',
                            name: 'vip',
                            component: () => import('../views/gift/vip.vue')
                        },
                        {
                            path: '/benefit',
                            name: 'benefit',
                            component: () => import('../views/gift/benefit.vue')
                        },
                        {
                            path: '/only',
                            name: 'only',
                            component: () => import('../views/gift/only.vue')
                        },
                    ],
                },
                //活动
                {
                    path: '/activity',
                    name: 'activity',
                    redirect: '/activity',
                    children: [
                        {
                            path: '/signConfig',
                            name: 'signConfig',
                            component: () => import('../views/activity/signConfig.vue')
                        },
                        {
                            path: '/signPrize',
                            name: 'signPrize',
                            component: () => import('../views/activity/signPrize.vue')
                        },
                    ],
                },
                //邮件
                {
                    path: '/email',
                    name: 'email',
                    redirect: '/email',
                    children: [
                        {
                            path: '/emailList',
                            name: 'emailList',
                            component: () => import('../views/email/list.vue')
                        },
                        {
                            path: '/emailEvent',
                            name: 'emailEvent',
                            component: () => import('../views/email/event.vue')
                        },
                    ],
                },
                //代收
                {
                    path: '/pay',
                    name: 'pay',
                    redirect: '/pay',
                    children: [
                        {
                            path: '/payGift',
                            name: 'payGift',
                            component: () => import('../views/pay/gift.vue')
                        },
                        {
                            path: '/rechargeRecords',
                            name: 'rechargeRecords',
                            component: () => import('../views/pay/rechargeRecords.vue')
                        },
                        {
                            path: '/giveConfig',
                            name: 'giveConfig',
                            component: () => import('../views/pay/giveConfig.vue')
                        },
                    ],
                },
                //房间
                {
                    path: '/room',
                    name: 'room',
                    redirect: '/room',
                    children: [
                        {
                            path: '/roomList',
                            name: 'roomList',
                            component: () => import('../views/room/roomList.vue')
                        },
                    ],
                },
                //运营统计
                {
                    path: '/statistics',
                    name: 'statistics',
                    redirect: '/statistics',
                    children: [
                        {
                            path: '/userStatistics',
                            name: 'userStatistics',
                            component: () => import('../views/statistics/userStatistics.vue')
                        },

                        {
                            path: '/rechargeStatistics',
                            name: 'rechargeStatistics',
                            component: () => import('../views/statistics/rechargeStatistics.vue')
                        },

                        {
                            path: '/withdrawal',
                            name: 'withdrawal',
                            component: () => import('../views/statistics/withdrawal.vue')
                        },

                        {
                            path: '/paidUserRetention',
                            name: 'paidUserRetention',
                            component: () => import('../views/statistics/paidUserRetention.vue')
                        },

                        {
                            path: '/userRetention',
                            name: 'userRetention',
                            component: () => import('../views/statistics/userRetention.vue')
                        },
                    ],
                },
                //资金流水
                {
                    path: '/fundFlow',
                    name: 'fundFlow',
                    redirect: '/fundFlow',
                    children: [
                        {
                            path: '/tp',
                            name: 'tp',
                            component: () => import('../views/fundFlow/tp.vue')
                        },
                        {
                            path: '/slot',
                            name: 'slot',
                            component: () => import('../views/fundFlow/slot.vue')
                        },
                    ],
                },
                //游戏用户
                {
                    path: '/gameUser',
                    name: 'gameUser',
                    redirect: '/gameUser',
                    children: [
                        {
                            path: '/userChannel',
                            name: 'userChannel',
                            component: () => import('../views/gameUser/userChannel.vue')
                        },
                        {
                            path: '/userBank',
                            name: 'userBank',
                            component: () => import('../views/gameUser/userBank.vue')
                        },
                        {
                            path: '/userList',
                            name: 'userList',
                            component: () => import('../views/gameUser/userList.vue')
                        },
                        {
                            path: '/loginLog',
                            name: 'loginLog',
                            component: () => import('../views/gameUser/loginLog.vue')
                        },
                        {
                            path: '/giveMoney',
                            name: 'giveMoney',
                            component: () => import('../views/gameUser/giveMoney.vue')
                        },
                        {
                            path: '/userInfo',
                            name: 'userInfo',
                            component: () => import('../views/gameUser/userInfo.vue')
                        },
                    ],
                },

                //游戏数据
                {
                    path: '/gameData',
                    name: 'gameData',
                    redirect: '/gameData',
                    children: [
                        {
                            path: '/online',
                            name: 'online',
                            component: () => import('../views/gameData/online.vue')
                        },
                    ],
                },

                //支付
                {
                    path: '/passage',
                    name: 'passage',
                    redirect: '/passage',
                    children: [
                        {
                            path: '/channel',
                            name: 'channel',
                            component: () => import('../views/passage/channel.vue')
                        },
                        {
                            path: '/collection',
                            name: 'collection',
                            component: () => import('../views/passage/collection.vue')
                        },
                        {
                            path: '/payment',
                            name: 'payment',
                            component: () => import('../views/passage/payment.vue')
                        },
                    ],
                },
            ];

            const menuArray = []

            rs.forEach(item => {
                if (item.children.length !== 0) {
                    menuArray.push(...item.children)
                } else {
                    menuArray.push(item)
                }
            })

            menuArray.forEach(item => {
                router.addRoute('home1', item)
            })

        },

        setMenuMp(state, val) {
            state.menu = val
            localStorage.setItem('menuMp', JSON.stringify(val))
        },

        cleanMenu(state) {
            state.menu = []
            localStorage.removeItem('menu')
        },
        setToken(state, val) {
            state.token = val
            Cookie.set('token', val)
        },
        clearToken(state) {
            state.token = ''
            Cookie.remove('token')
        },
        getToken(state) {
            state.token = state.token || Cookie.get('token')
        }

    }
})