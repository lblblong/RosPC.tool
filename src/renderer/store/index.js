import Vue from 'vue'
import Vuex from 'vuex'
import { stat } from 'fs-extra-p'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        mapInfo: { width: 0, height: 0 },
        // 建图页加载状态
        loadingStatus: true,
        loadingText: '连接中...',
        // 连接状态
        havConnection: false,
        batteryRatio: 0
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
        },
        batteryRatio(state, batteryRatio) {
            state.batteryRatio = batteryRatio
        }
    }
})

export default store
