<template>
    <div id="tool">
        <div class="action">
            <div @click="$router.push('/')">切换底盘</div>
            <el-popover ref="navigation" placement="top" title="提示" width="200" trigger="hover" content="切换时提示状态有问题，请忽略。">
            </el-popover>
            <div @click="navigation" v-popover:navigation>标准</div>
            <el-popover ref="mapping" placement="top" title="提示" width="200" trigger="hover" content="切换时提示状态有问题，请忽略。">
            </el-popover>
            <div @click="mapping" v-popover:mapping>建图</div>
            <div @click="help=true">帮助</div>
            <div @click="about=true">关于</div>
        </div>
        <el-dialog title="使用帮助" :visible.sync="help">
            <h6>如何控制底盘？</h6>
            <p>键盘上的上、下、左、右键可以控制底盘前进后退，左转右转</p>
            <h6>标准 和 建图？</h6>
            <p>首先需要了解模式，底盘有两种模式，一个是建图，一个是正常模式，在正常模式下，建图功能会关闭，可导航。</p>
        </el-dialog>
        <el-dialog title="关于" :visible.sync="about">
            <h4>ZTools</h4>
            <p>版本号：v1.0</p>
            <h4>开发者</h4>
            <p>公司：智汇机器人</p>
            <p>维护联系人：李北龙</p>
            <p>联系方式：lblblong@foxmail.com</p>
        </el-dialog>
        <div class="status">地图大小：{{$store.state.mapInfo.width}} x {{$store.state.mapInfo.height}}</div>
    </div>
</template>

<script>
let ros = require('../../ros').default
let axios = require('axios')
export default {
    data() {
        return {
            help: false,
            about: false
        }
    },
    methods: {
        async navigation() {
            if (!this.$store.state.havConnection) {
                this.$message.warning('请先连接底盘')
                return
            }
            this.$store.commit('loadingStatus', true)
            this.$store.commit('loadingText', '切换模式中...')
            try {
                let rep = await axios.get(
                    `http://${ros.ip}:8080/v1/system/navigation`
                )
                console.log(rep)
                let code = rep.data.code
                if (code == 404) {
                    this.$message.error('切换失败，请检查底盘Ros是否启动。')
                } else if (code == -1) {
                    throw Error()
                } else {
                    this.$message.success('成功切换到标准模式')
                }
            } catch (e) {
                this.$message.error('切换到标准模式失败')
            }
            this.$store.commit('loadingStatus', false)
        },
        async mapping() {
            if (!this.$store.state.havConnection) {
                this.$message.warning('请先连接底盘')
                return
            }
            this.$store.commit('loadingStatus', true)
            this.$store.commit('loadingText', '切换模式中...')
            try {
                let rep = await axios.get(
                    `http://${ros.ip}:8080/v1/system/mapping`
                )
                console.log(rep)
                let code = rep.data.code
                if (code == 404) {
                    this.$message.error('切换失败，请检查底盘Ros是否启动。')
                } else if (code == -1) {
                    throw Error()
                } else {
                    this.$message.success('成功切换到建图模式')
                }
            } catch (e) {
                this.$message.error('切换到建图模式失败')
            }
            this.$store.commit('loadingStatus', false)
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