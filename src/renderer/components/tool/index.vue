<template>
    <div id="tool">
        <!-- 左边工具栏 -->
        <div class="action">
            <div @click="changeRos">切换底盘</div>
            <!-- 模式切换 -->
            <el-dropdown placement="top" @command="changeMode">
                <span class="el-dropdown-link">
                    模式
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="navigation">标准</el-dropdown-item>
                    <el-dropdown-item command="mapping">建图</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <!-- 地图相关操作 -->
            <el-dropdown placement="top" @command="mapCorrelation">
                <span class="el-dropdown-link">
                    地图
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="saveMapDialog">保存地图</el-dropdown-item>
                    <el-dropdown-item command="showMapList">地图列表</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <div @click="help=true">帮助</div>
            <div @click="about=true">关于</div>
        </div>

        <!-- 弹窗内容 -->
        <el-dialog title="地图列表" :visible.sync="mapDialog" class="maplist" width="50%">
            <div style="height:200px;overflow-y: scroll;">
                <div @click="changeMap(item)" v-for="item of maplist" v-bind:key="item" class="item" v-html="item"></div>
            </div>
        </el-dialog>
        <el-dialog title="保存地图" :visible.sync="saveMapDialog" width="50%">
            <input class="etMapName" type="text" v-model="etMapName" required placeholder="地图名字">
            <button @click="saveMap()" class="btnSubmit btn--raised btn--blue">保存地图</button>
        </el-dialog>
        <el-dialog title="使用帮助" :visible.sync="help">
            <h6>如何控制底盘？</h6>
            <p>键盘上的上、下、左、右键可以控制底盘前进后退，左转右转</p>
            <h6>标准 和 建图？</h6>
            <p>首先需要了解模式，底盘有两种模式，一个是建图，一个是正常模式，在正常模式下，建图功能会关闭，可导航。</p>
            <p>切换模式会导致连接短暂断开，大概30秒</p>
        </el-dialog>
        <el-dialog title="关于" :visible.sync="about">
            <h4>ZTools</h4>
            <p>版本号：v1.1</p>
            <h4>开发者</h4>
            <p>公司：智汇机器人</p>
            <p>维护联系人：李北龙</p>
            <p>联系方式：lblblong@foxmail.com</p>
            <p>手机版ZTools：http://fir.im/ztool</p>
        </el-dialog>

        <!-- 右边状态栏 -->
        <div class="status">
            <div>
                <span class="icon-battery">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                    <span class="path4"></span>
                    <span class="path5"></span>
                </span>
                {{$store.state.batteryRatio>0?$store.state.batteryRatio:'--'}} %
            </div>
            <div>
                <span class="icon-map">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                    <span class="path4"></span>
                    <span class="path5"></span>
                </span>
                {{$store.state.mapInfo.width}} x {{$store.state.mapInfo.height}}
            </div>
        </div>
    </div>
</template>

<script>
let ros = require('../../ros').default
let axios = require('axios')
export default {
    data() {
        return {
            help: false,
            about: false,
            saveMapDialog: false,
            mapDialog: false,
            maplist: ['sdf', 'qweor', 'asd'],
            etMapName: ''
        }
    },
    methods: {
        mapCorrelation(command) {
            if (command == 'saveMapDialog') {
                this.saveMapDialog = true
            } else if (command == 'showMapList') {
                this.showMapList()
            }
        },
        // 切换地图
        async changeMap(mapname) {
            if (!this.$store.state.havConnection) {
                this.$message.warning('请先连接底盘')
                return
            }
            mapname = mapname.slice(0, mapname.length - 4)
            this.$message('切换地图中...')
            try {
                let rep = await axios.post(`http://${ros.ip}:8080/v1/maps`, {
                    name: mapname
                })
                rep = rep.data
                let code = rep.code
                if (code == 404) {
                    this.$message.error('切换失败，请稍后再试。')
                } else if (code == -1) {
                    throw Error()
                } else if (code == 0) {
                    if (rep.data.code == 0) {
                        this.$message.success(`切换地图成功`)
                    } else {
                        this.$message.warning(`切换失败：${rep.data.message}`)
                    }
                } else {
                    this.$message.error('出现无法处理的异常')
                }
            } catch (e) {
                this.$message.error(`切换地图失败`)
            }
        },
        // 切换地图列表的点击事件
        async showMapList() {
            if (!this.$store.state.havConnection) {
                this.$message.warning('请先连接底盘')
                return
            }
            this.mapDialog = true
            try {
                let rep = await axios.get(`http://${ros.ip}:8080/v1/maps`)
                rep = rep.data
                if (rep.code == 0) {
                    this.maplist = rep.data
                } else {
                    throw Error()
                }
            } catch (e) {
                this.$message.warning(`获取地图列表失败，请稍后再试`)
            }
        },
        async saveMap() {
            if (this.etMapName.length == 0) {
                this.$message.warning('请输入地图名字')
                return
            }
            if (!this.$store.state.havConnection) {
                this.$message.warning('请先连接底盘')
                return
            }
            this.$message('保存地图中...')
            try {
                let rep = await axios.post(
                    `http://${ros.ip}:8080/v1/maps/save`,
                    {
                        name: this.etMapName
                    }
                )
                console.log(rep)
                rep = rep.data
                let code = rep.code
                if (code == 404) {
                    this.$message.error('保存失败，请稍后再试。')
                } else if (code == -1) {
                    throw Error()
                } else if (code == 0) {
                    if (rep.data.code == 0) {
                        this.$message.success(`保存地图成功`)
                    } else {
                        this.$message.warning(`保存失败：${rep.data.message}`)
                    }
                } else {
                    this.$message.error('出现无法处理的异常')
                }
            } catch (e) {
                this.$message.error(`保存地图失败`)
            }
        },
        changeRos() {
            this.$router.push('/')
            ros.close()
        },
        async changeMode(mode) {
            if (!this.$store.state.havConnection) {
                this.$message.warning('请先连接底盘')
                return
            }
            let type = ''
            if (mode == 'navigation') {
                type = '标准'
            } else {
                type = '建图'
            }
            this.$message('切换模式中...')
            try {
                let rep = await axios.get(
                    `http://${ros.ip}:8080/v1/system/${mode}`
                )
                rep = rep.data
                console.log(rep)
                let code = rep.code
                if (code == 404) {
                    this.$message.error('切换失败，请稍后再试。')
                } else if (code == -1) {
                    throw Error()
                } else if (code == 0) {
                    if (rep.data.code == 0) {
                        this.$message.success(`成功切换到${type}模式`)
                    } else {
                        this.$message.warning(`切换失败：${rep.data.message}`)
                    }
                } else {
                    this.$message.error('出现无法处理的异常')
                }
            } catch (e) {
                this.$message.error(`切换到${type}模式失败`)
            }
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
        .el-dropdown-link {
            font-size: 12px;
            color: #333;
        }
    }
    .status {
        height: 26px;
        display: flex;
        line-height: 26px;
        padding: 0 8px;
        div {
            padding: 0 8px;
            display: flex;
            align-items: center;
            .icon-map {
                font-size: 14px;
                display: flex;
                margin-right: 8px;
            }
            .icon-battery {
                font-size: 24px;
                display: flex;
                margin-right: 4px;
            }
        }
    }
}

.maplist {
    .item {
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 16px;
        cursor: pointer;
        &:hover {
            background: #efefef;
        }
    }
}
</style>