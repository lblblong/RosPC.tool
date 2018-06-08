import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: require('@/components/main/connect').default,
            // redirect: '/editMap'
        },
        {
            path: '/jiantu',
            component: require('@/components/main/jiantu').default
        },
        {
            path: '/editMap',
            component: require('@/components/main/editMap').default
        }
    ]
})
