<template>
    <div id="connect">
        <span class="icon-engineer">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
            <span class="path4"></span>
            <span class="path5"></span>
            <span class="path6"></span>
            <span class="path7"></span>
            <span class="path8"></span>
            <span class="path9"></span>
            <span class="path10"></span>
            <span class="path11"></span>
            <span class="path12"></span>
            <span class="path13"></span>
            <span class="path14"></span>
            <span class="path15"></span>
            <span class="path16"></span>
            <span class="path17"></span>
            <span class="path18"></span>
            <span class="path19"></span>
            <span class="path20"></span>
            <span class="path21"></span>
            <span class="path22"></span>
            <span class="path23"></span>
            <span class="path24"></span>
            <span class="path25"></span>
        </span>
        <input class="etIp" type="text" v-model="ip" required placeholder="底盘 IP">
        <button @click="connect" class="btnSubmit btn--raised btn--blue">开始建图</button>
    </div>
</template>

<script>
let ros = require('../../../ros').default
export default {
    data() {
        return {
            ip: '192.168.3.166'
        }
    },
    methods: {
        connect() {
            ros.init(this.ip)
            this.$router.push('/jiantu')
        }
    }
}
</script>

<style lang="scss" scoped="" type="text/css">
#connect {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon-engineer {
        font-size: 150px;
        display: flex;
        margin-bottom: 50px;
    }
    .etIp {
        width: 200px;
        height: 20px;
    }
    .btnSubmit {
        margin-top: -20px;
        width: 200px;
    }
}
</style>