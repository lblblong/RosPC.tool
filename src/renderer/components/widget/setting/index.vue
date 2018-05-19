<template>
    <div id="setting">
        <div class="item">
            <div class="title">移动速度</div>
            <el-slider @change="speedChange" v-model="speed" :step="1" show-stops :max="10"></el-slider>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            speed: 0
        }
    },
    created() {
        this.speed = parseInt(window.localStorage.speed)
    },
    methods: {
        speedChange(val) {
            window.localStorage.speed = parseInt(val)
        }
    }
}
</script>

<style lang="scss" scoped="" type="text/css">
#setting {
    .item {
        padding: 8px;
        .title {
            font-size: 24px;
            margin-bottom: 8px;
        }
        .el-slider {
            margin-left: 8px;
        }
    }
}
</style>