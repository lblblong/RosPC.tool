<template>
    <div id="editMapToolbar">
        <div @click="toJT()">
            <span class="icon-back">
                <span class="path1"></span>
                <span class="path2"></span>
            </span>
            <div class="tip">退出</div>
        </div>
        <div @click="saveChange()">
            <span class="icon-save"></span>
            <div class="tip">保存</div>
        </div>
        <div @click="changeDarw('拖拽')">
            <span class="icon-drag"></span>
            <div class="tip">拖拽</div>
        </div>
        <div @click="changeDarw('直线')">
            <span class="icon-line"></span>
            <div class="tip">直线</div>
        </div>
        <div @click="changeDarw('画笔')">
            <span class="icon-brush"></span>
            <div class="tip">画笔</div>
        </div>
        <div @click="changeDarw('矩形')">
            <span class="icon-rect"></span>
            <div class="tip">矩形</div>
        </div>
        <div @click="changeDarw('橡皮')">
            <span class="icon-eraser"></span>
            <div class="tip">橡皮</div>
        </div>
        <div @click="changeDarw('撤回')">
            <span class="icon-revocation"></span>
            <div class="tip">撤回</div>
        </div>
    </div>
</template>

<script>
import editHelp from '../../../tool/EditMapHelp'
import { throws } from 'assert'
let ros = require('../../../ros').default
let axios = require('axios')
export default {
    methods: {
        changeDarw(action) {
            switch (action) {
                case '拖拽':
                    editHelp.drag()
                    break
                case '直线':
                    editHelp.drawLine()
                    break
                case '画笔':
                    editHelp.drawBrush()
                    break
                case '矩形':
                    editHelp.drawRect()
                    break
                case '橡皮':
                    editHelp.drawEraser()
                    break
                case '撤回':
                    editHelp.back()
                    break
            }
        },
        toJT() {
            this.$router.push('/jiantu')
        },
        async saveChange() {
            try {
                // 获取当前地图名字
                let rep = await axios.get(`http://${ros.ip}:8080/v1/map/name`)
                rep = rep.data
                let code = rep.code
                if (code != 0) throw Error('保存失败')
                let name = rep.data

                // canvas 转 pgm 字符串
                let data = `P2\n# Create by RosTools\n${editHelp.canvas.width} ${
                    editHelp.canvas.height
                }\n255\n`

                let imageDate = editHelp.ctx.getImageData(
                    0,
                    0,
                    editHelp.canvas.width,
                    editHelp.canvas.height
                )

                for (let i = 0; i < imageDate.data.length; i += 4) {
                    let r = imageDate.data[i + 0]
                    let g = imageDate.data[i + 1]
                    let b = imageDate.data[i + 2]
                    let gray = (r + g + b) / 3
                    if (gray == 159) {
                        gray = 127
                    }
                    data = data + gray + ' '
                }

                // 上传替换当前地图
                rep = await axios.post(
                    `http://${ros.ip}:8080/v1/maps/replace`,
                    {
                        name,
                        data
                    }
                )
                rep = rep.data
                code = rep.code
                if (code != 0) throw Error('保存失败')
                this.$message.success(`保存成功`)
            } catch (error) {
                this.$message.warning(error.message)
            }
        }
    }
}
</script>

<style lang="scss" scoped="" type="text/css">
#editMapToolbar {
    width: 40px;
    height: 100%;
    position: relative;
    div {
        position: relative;
        height: 40px;
        color: black;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover {
            background-color: black;
            color: white;
            .tip {
                display: flex;
                left: 40px;
            }
        }
        .tip {
            display: none;
            left: 0px;
            position: absolute;
            width: 40px;
            margin: auto;
            font-size: 12px;
            transition: 0.3s;
            background-color: black;
            color: #fff;
        }
    }
    .icon-back {
        display: flex;
    }
}
</style>