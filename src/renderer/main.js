import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import {
    Loading,
    Message,
    Dialog,
    Popover,
    Input,
    Dropdown,
    DropdownMenu,
    DropdownItem
} from 'element-ui'

Vue.use(Loading)
Vue.prototype.$message = Message
Vue.use(Dialog)
Vue.use(Popover)
Vue.use(Input)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
import '../../static/css/normalize'
import '../../static/css/animate'
import '../../static/surface_styles'
import '../../static/style'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app')
