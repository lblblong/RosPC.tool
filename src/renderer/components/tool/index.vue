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
                    <el-dropdown-item command="editMap">编辑地图</el-dropdown-item>
                    <el-dropdown-item command="showMapList">地图列表</el-dropdown-item>
                    <el-dropdown-item command="uploadMap">上传地图</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <div @click="help=true">帮助</div>
            <div @click="about=true">关于</div>
            <div @click="setting=true">首选项</div>
        </div>

        <!-- 弹窗内容 -->
        <el-dialog title="地图列表" :visible.sync="mapDialog" class="maplist" width="50%">
            <v-maplist v-if="mapDialog"></v-maplist>
        </el-dialog>
        <el-dialog title="保存地图" :visible.sync="saveMapDialog" width="50%">
            <input class="etMapName" type="text" v-model="etMapName" required placeholder="地图名字">
            <button @click="saveMap()" class="btnSubmit btn--raised btn--blue">保存地图</button>
        </el-dialog>
        <el-dialog title="上传地图" :visible.sync="uploadMapDialog" width="50%">
            <v-uploadMap v-if="uploadMapDialog"></v-uploadMap>
        </el-dialog>
        <el-dialog title="使用帮助" :visible.sync="help">
            <v-help></v-help>
        </el-dialog>
        <el-dialog title="关于" :visible.sync="about">
            <v-about></v-about>
        </el-dialog>
        <el-dialog title="首选项" :visible.sync="setting">
            <v-setting></v-setting>
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
import setting from '../widget/setting'
import uploadMap from '../widget/uploadMap'
import maplist from '../widget/maplist'
import help from '../widget/help'
import about from '../widget/about'
let ros = require('../../ros').default
let axios = require('axios')
export default {
    components: {
        'v-setting': setting,
        'v-uploadMap': uploadMap,
        'v-maplist': maplist,
        'v-help': help,
        'v-about': about
    },
    data() {
        return {
            help: false,
            about: false,
            saveMapDialog: false,
            mapDialog: false,
            uploadMapDialog: false,
            setting: false,
            maplist: [],
            etMapName: ''
        }
    },
    methods: {
        mapCorrelation(command) {
            if (!this.$store.state.havConnection) {
                this.$message.warning('请先连接底盘')
                return
            }
            if (command == 'saveMapDialog') {
                this.saveMapDialog = true
            } else if (command == 'showMapList') {
                this.mapDialog = true
            } else if (command == 'uploadMap') {
                this.uploadMapDialog = true
            } else if (command == 'editMap') {
                this.$router.push('/editMap')
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
</style>