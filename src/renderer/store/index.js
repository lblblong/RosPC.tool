import Vue from 'vue'
import Vuex from 'vuex'
import { stat } from 'fs-extra-p'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        mapInfo: { width: 0, height: 0 },
        loadingStatus: true,
        loadingText: '连接中...',
        havConnection: false
    },
    mutations: {
        mapInfo(state, mapInfo) {
            state.mapInfo = mapInfo
        },
        loadingStatus(state, loadingStatus) {
            state.loadingStatus = loadingStatus
        },
        loadingText(state, loadingText) {
            state.loadingText = loadingText
        },
        havConnection(state, havConnection) {
            state.havConnection = havConnection
        }
    }
})

export default store
