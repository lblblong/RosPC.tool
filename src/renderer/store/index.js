import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        mapInfo: { width: 0, height: 0 }
    },
    mutations: {
        mapInfo(state, mapInfo) {
            state.mapInfo = mapInfo
        }
    }
})

export default store
