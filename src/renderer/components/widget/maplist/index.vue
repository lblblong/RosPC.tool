<template>
    <div id="maplist">
        <div style="height:200px;overflow-y: scroll;">
            <div v-for="item of maplist" v-bind:key="item" class="item">
                <div v-html="item"></div>
                <div class="action">
                    <a :href="basepath + '/public/' + item + '.pgm'" download="">PGM</a>
                    <a :href="basepath + '/public/' + item + '.yaml'" download="">YAML</a>

                    <div @click="delMap(item)">删除</div>
                    <div @click="changeMap(item)">切换</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
let ros = require('../../../ros').default
let axios = require('axios')
export default {
    data() {
        return {
            maplist: [],
            basepath: `http://${ros.ip}:8080`
        }
    },
    async created() {
        this.reloadMapList()
    },
    methods: {
        // 下载地图
        async dowMap(mapname) {
            window.open(`http://${ros.ip}:8080/public/${mapname}.pgm`)
            window.open(`http://${ros.ip}:8080/public/${mapname}.yaml`)
        },
        // 删除地图
        async delMap(mapname) {
            try {
                let rep = await axios.delete(
                    `http://${ros.ip}:8080/v1/maps/${mapname}`
                )
                rep = rep.data
                if (rep.code == 0) {
                    this.$message.success('删除成功')
                } else {
                    throw Error()
                }
            } catch (e) {
                this.$message.warning(`删除失败`)
            }
        },
        async reloadMapList() {
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
        // 切换地图
        async changeMap(mapname) {
            if (!this.$store.state.havConnection) {
                this.$message.warning('请先连接底盘')
                return
            }
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
                        this.$message.success(`切换地图成功，重新加载地图`)
                        setTimeout(() => {
                            this.reloadMap()
                        }, 1000)
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
        async reloadMap() {
            this.$message('重载地图中...')
            try {
                let rep = await axios.get(
                    `http://${ros.ip}:8080/v1/system/navigation`
                )
                rep = rep.data
                let code = rep.code
                if (code == 404) {
                    this.$message.error('重载失败，请稍后再试。')
                } else if (code == -1) {
                    throw Error()
                } else if (code == 0) {
                    if (rep.data.code == 0) {
                        this.$message.success(`地图已重载`)
                    } else {
                        this.$message.warning(`重载失败：${rep.data.message}`)
                    }
                } else {
                    this.$message.error('出现无法处理的异常')
                }
            } catch (e) {
                this.$message.error(`重载失败`)
            }
        }
    }
}
</script>

<style lang="scss" scoped="" type="text/css">
#maplist {
    .item {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        &:hover {
            background: #efefef;
        }
        .action {
            display: flex;
            div {
                margin-right: 8px;
                cursor: pointer;
                color: blueviolet;
            }
            a {
                color: blueviolet;
                text-decoration: none;
                background: none;
                font-size: 14px;
                margin-right: 8px;
            }
        }
    }
}
</style>