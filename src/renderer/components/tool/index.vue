<template>
    <div id="tool">
        <div class="action">
            <div @click="$router.push('/')">切换底盘</div>
            <div @click="help2=true">模式切换</div>
            <div @click="help=true">帮助</div>
        </div>
        <el-dialog title="使用帮助" :visible.sync="help">
            <h6>如何控制机器人？</h6>
            <p>键盘上的上、下、左、右键可以控制机器人前进后退，左转右转</p>
            <h6>什么是模式切换？</h6>
            <p>首先需要了解模式，机器人有两种模式，一个是建图，一个是正常模式，在正常模式下，建图功能会关闭，可导航。</p>
        </el-dialog>
        <el-dialog title="模式切换" :visible.sync="help2">
            <h6>模式切换暂未开放，切换模式请在Ubuntu系统中切换。</h6>
        </el-dialog>
        <div class="status">地图大小：{{$store.state.mapInfo.width}} x {{$store.state.mapInfo.height}}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            help: false,
            help2: false
        }
    }
}
</script>

<style lang="scss" scoped="" type="text/css">
#tool {
    width: 100%;
    height: 26px;
    background-color: #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    .action {
        height: 26px;
        display: flex;
        line-height: 26px;
        div {
            padding: 0 8px;
            cursor: pointer;
            &:hover {
                background-color: #cfcfcf;
            }
        }
    }
    .status {
        height: 26px;
        display: flex;
        line-height: 26px;
        padding: 0 8px;
    }
}
</style>