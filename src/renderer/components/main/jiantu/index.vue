<template>
    <div id="jiantu" v-loading="$store.state.loadingStatus" :element-loading-text="$store.state.loadingText">
        <div id="container">
            <div id="ros" v-show="$store.state.havConnection" class="animated infinite bounceIn"></div>
        </div>
    </div>
</template>

<script>
let ros = require('../../../ros').default
export default {
    data() {
        return {
            containerCenter: null
        }
    },
    created() {
        this.$store.commit('loadingText', '连接中...')
        this.$store.commit('loadingStatus', true)
        ros.addConnectiontLisener(() => {
            this.$message({
                message: '连接成功',
                type: 'success'
            })
            this.$store.commit('loadingText', '加载地图中...')
        })
        ros.addCloseLisener(() => {
            this.containerCenter = null
            this.$store.commit('loadingStatus', true)
            this.$store.commit('loadingText', '连接异常，重新连接中...')
        })
        ros.addMapLisener(rep => {
            this.reloadMap(rep)
        })
        ros.addPoseLisener(rep => {
            this.reloadPose(rep)
        })
        ros.connect()
        this.initKeyLisener()
    },
    methods: {
        // 初始化键盘按键监听
        initKeyLisener() {
            document.onkeydown = function(event) {
                var e =
                    event ||
                    window.event ||
                    arguments.callee.caller.arguments[0]

                if (e && e.keyCode == 38) {
                    ros.move(1)
                } else if (e && e.keyCode == 37) {
                    ros.move(3)
                } else if (e && e.keyCode == 40) {
                    ros.move(2)
                } else if (e && e.keyCode == 39) {
                    ros.move(4)
                }
            }
        },
        // 刷新地图
        reloadMap(rep) {
            let info = rep.info
            this.$store.commit('mapInfo', info)
            let mapData = rep.data
            let width = info.width
            let height = info.height

            let container = document.getElementById('container')
            let jiantu = document.getElementById('jiantu')
            let canvas = document.createElement('canvas')
            this.drawMap(canvas, width, height, mapData)

            // 上一次地图中心点不存在则地图显示在中心，否则显示在上一次位置
            if (!this.containerCenter) {
                container.style.left = jiantu.offsetWidth / 2 - width / 2 + 'px'
                container.style.top =
                    jiantu.offsetHeight / 2 - height / 2 + 'px'
            } else {
                container.style.left =
                    this.containerCenter.x - container.offsetWidth / 2 + 'px'
                container.style.top =
                    this.containerCenter.y - container.offsetHeight / 2 + 'px'
            }

            container.onmousedown = this.dropMap
            if (container.childElementCount > 1) {
                container.removeChild(container.childNodes[1])
            }
            container.appendChild(canvas)
            this.$store.commit('loadingStatus', false)
        },
        // 绘制地图
        drawMap(canvas, width, height, mapData) {
            canvas.width = width
            canvas.height = height
            let ctx = canvas.getContext('2d')
            for (let row = 0; row < height; row++) {
                for (let col = 0; col < width; col++) {
                    let mapI = col + (height - row - 1) * width
                    let data = mapData[mapI]
                    ctx.fillStyle = '#7F7F7F'
                    if (data === 100) {
                        ctx.fillStyle = '#000000'
                    } else if (data === 0) {
                        ctx.fillStyle = '#FFFFFF'
                    }
                    ctx.fillRect(col, row, 1, 1)
                }
            }
            // 地图变化同时刷新 window.map，编辑地图时会用
            window.map = {
                data: ctx.getImageData(0, 0, width, height),
                width,
                height
            }
        },
        // 地图可拖动事件的绑定
        dropMap(e) {
            let _this = this
            let container = document.getElementById('container')
            e = e || window.event
            container.startX = e.clientX - container.offsetLeft
            container.startY = e.clientY - container.offsetTop
            document.onmousemove = function(e) {
                e = e || window.event
                container.style.left = e.clientX - container.startX + 'px'
                container.style.top = e.clientY - container.startY + 'px'
                _this.containerCenter = {
                    x: container.offsetLeft + container.offsetWidth / 2,
                    y: container.offsetTop + container.offsetHeight / 2
                }
            }
            document.onmouseup = function() {
                document.onmousemove = null
                document.onmouseup = null
            }
        },
        // 刷新位置
        reloadPose(rep) {
            if (!ros.mapInfo) {
                return
            }
            let x = rep.position.x
            let y = rep.position.y
            x = ros.mapInfo.x - x
            y = ros.mapInfo.y - y
            let xpx = -x / ros.mapInfo.resolution
            let ypx = -y / ros.mapInfo.resolution
            let elRos = document.getElementById('ros')
            elRos.style.left = xpx - 10 + 'px'
            elRos.style.top = ypx - 10 + 'px'
        }
    }
}
</script>

<style lang="scss" scoped="" type="text/css">
#jiantu {
    width: 100%;
    height: 100%;
    position: relative;
    #container {
        position: absolute;
        #ros {
            position: relative;
            width: 20px;
            height: 20px;
            background-color: rgba(255, 0, 0, 0.7);
            border-radius: 50%;
            z-index: 100;
        }
    }
}
</style>