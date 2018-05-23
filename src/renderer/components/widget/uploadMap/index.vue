<template>
    <div id="uploadMap">
        <el-upload :on-success="success" :on-change="filelistChange" ref="upload" :auto-upload="false" :limit="2" drag :action="upURL" multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖拽或点击此处</div>
            <div class="el-upload__tip" slot="tip">请选择匹配的
                <b>.ymal</b> 和
                <b>.pgm</b> 文件</div>
        </el-upload>
        <el-button @click="submit">上传</el-button>

    </div>
</template>

<script>
let ros = require('../../../ros').default
export default {
    data() {
        return {
            isOk: false,
            errorMsg: '请选择文件',
            upURL: `http://${ros.ip}:8080/v1/maps/upload`
        }
    },
    methods: {
        success(response, file, fileList) {
            console.log(response)
            console.log(file)
            console.log(fileList)
        },
        filelistChange(_, fileList) {
            let yaml = fileList.find(file => {
                return file.name.endsWith('.yaml')
            })
            let pgm = fileList.find(file => {
                return file.name.endsWith('.pgm')
            })
            this.isOk = false
            if (yaml == undefined) {
                this.errorMsg = '未选择 yaml 文件'
                return
            } else if (pgm == undefined) {
                this.errorMsg = '未选择 pgm 文件'
                return
            }
            this.isOk = true
        },
        submit() {
            if (this.isOk) {
                this.$refs.upload.submit()
                return
            }
            this.$message.warning(this.errorMsg)
        }
    }
}
</script>

<style lang="scss" scoped="" type="text/css">
#uploadMap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .el-button {
        width: 360px;
        margin-top: 8px;
    }
}
</style>