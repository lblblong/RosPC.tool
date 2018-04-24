<template>
    <div id="jiantu" v-loading="loadingStatus" :element-loading-text="loadingText">
    </div>
</template>

<script>
let ros = require('../../../ros').default
export default {
    data() {
        return {
            timer: null,
            loadingStatus: true,
            loadingText: '连接中...'
        }
    },
    created() {
        ros.addConnectiontLisener(() => {
            this.$message({
                message: '连接成功',
                type: 'success'
            })
            this.loadingText = '加载地图中...'
        })
        ros.addCloseLisener(() => {
            this.loadingStatus = true
            this.loadingText = '连接异常，重新连接中...'
        })
        ros.addMapLisener(rep => {
            if (this.timer) clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.reloadMap(rep)
            }, 3000)
        })
        ros.connect()
        this.initKeyLisener()
    },
    methods: {
        initKeyLisener() {
            document.onkeydown = function(event) {
                var e =
                    event ||
                    window.event ||
                    arguments.callee.caller.arguments[0]

                if (e && e.keyCode == 38) {
                    //上
                    ros.move(1)
                } else if (e && e.keyCode == 37) {
                    // 左
                    ros.move(3)
                } else if (e && e.keyCode == 40) {
                    // 下
                    ros.move(2)
                } else if (e && e.keyCode == 39) {
                    // 右
                    ros.move(4)
                }
            }
        },
        reloadMap(rep) {
            let info = rep.info
            this.$store.commit('mapInfo', info)
            let mapData = rep.data
            let width = info.width
            let height = info.height

            let jiantu = document.getElementById('jiantu')
            let canvas = document.createElement('canvas')
            canvas.id = 'canvas'
            this.drawMap(canvas, width, height, mapData)

            canvas.style.position = 'absolute'
            canvas.style.left = jiantu.clientWidth / 2 - width / 2 + 'px'
            canvas.style.top = jiantu.clientHeight / 2 - height / 2 + 'px'

            canvas.onmousedown = this.dropMap
            jiantu.removeChild(jiantu.childNodes[0])
            jiantu.appendChild(canvas)
            this.loadingStatus = false
        },
        drawMap(canvas, width, height, mapData) {
            canvas.width = width
            canvas.height = height
            // let ctx = canvas.getContext('webgl')
            let ctx = canvas.getContext('2d')
            let x, y, d
            for (let i = 0; i < mapData.length; i++) {
                x = parseInt(i % width)
                y = parseInt(i / width)
                d = parseInt(mapData[i])
                ctx.fillStyle = '#7F7F7F'
                if (d == 100) {
                    ctx.fillStyle = '#000000'
                } else if (d == 0) {
                    ctx.fillStyle = '#FFFFFF'
                }
                ctx.fillRect(x, y, 1, 1)
            }
        },
        dropMap(e) {
            var canvas = document.getElementById('canvas')
            var e = e || window.event
            canvas.startX = e.clientX - canvas.offsetLeft
            canvas.startY = e.clientY - canvas.offsetTop
            document.onmousemove = function(e) {
                var e = e || window.event
                canvas.style.left = e.clientX - canvas.startX + 'px'
                canvas.style.top = e.clientY - canvas.startY + 'px'
            }
            document.onmouseup = function() {
                document.onmousemove = null
                document.onmouseup = null
            }
        }
    }
}
</script>

<style lang="scss" scoped="" type="text/css">
#jiantu {
    width: 100%;
    height: 100%;
    position: relative;
    // display: flex;
    // justify-content: center;
    // align-items: center;
}
</style>