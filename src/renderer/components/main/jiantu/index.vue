<template>
    <div id="jiantu" v-loading="$store.state.loadingStatus" :element-loading-text="$store.state.loadingText">
        <div id="container">
            <div id="ros" v-show="$store.state.havConnection"></div>
        </div>
    </div>
</template>

<script>
let ros = require('../../../ros').default
export default {
    data() {
        return {
        }
    },
    created() {
        this.$store.commit('loadingStatus', true)
        ros.addConnectiontLisener(() => {
            this.$message({
                message: '连接成功',
                type: 'success'
            })
            this.$store.commit('loadingText', '加载地图中...')
        })
        ros.addCloseLisener(() => {
            this.$store.commit('loadingStatus', true)
            this.$store.commit('loadingText', '连接异常，重新连接中...')
        })
        ros.addMapLisener(rep => {
            this.reloadMap(rep)
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

            container.style.left = jiantu.clientWidth / 2 - width / 2 + 'px'
            container.style.top = jiantu.clientHeight / 2 - height / 2 + 'px'

            container.onmousedown = this.dropMap
            if (container.childElementCount > 1) {
                container.removeChild(container.childNodes[1])
            }
            container.appendChild(canvas)
            this.$store.commit('loadingStatus', false)
        },
        drawMap(canvas, width, height, mapData) {
            canvas.width = width
            canvas.height = height
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
            var container = document.getElementById('container')
            var e = e || window.event
            container.startX = e.clientX - container.offsetLeft
            container.startY = e.clientY - container.offsetTop
            document.onmousemove = function(e) {
                var e = e || window.event
                container.style.left = e.clientX - container.startX + 'px'
                container.style.top = e.clientY - container.startY + 'px'
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
    #container {
        position: absolute;
        #ros {
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: red;
            border-radius: 50%;
            z-index: 100;
        }
    }
}
</style>