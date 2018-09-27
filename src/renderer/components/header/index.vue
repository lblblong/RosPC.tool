<template>
    <div id="header" style="-webkit-app-region: drag">
        <div id="icon">
            <span class="icon-ic">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
            </span>
            <div class="title">RosTools</div>
        </div>
        <div id="action" style="-webkit-app-region: no-drag">
            <div @click="minus">
                <span class="icon-minus"></span>
            </div>
            <div @click="cross">
                <span class="icon-cross"></span>
            </div>
        </div>
    </div>
</template>

<script>
var ipcRenderer = require('electron').ipcRenderer
export default {
    methods: {
        minus() {
            ipcRenderer.send('window-min')
        },
        cross() {
            ipcRenderer.send('window-close')
        }
    }
}
</script>

<style lang="scss" scoped="" type="text/css">
#header {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    #icon {
        padding: 0 8px;
        display: flex;
        .icon-ic {
            font-size: 16px;
            display: flex;
            line-height: 30px;
        }
        .title {
            line-height: 30px;
            font-size: 12px;
            margin-left: 8px;
        }
    }
    #action {
        display: flex;
        div {
            width: 50px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            font-size: 10px;
            color: #777;
            &:hover {
                background-color: #dfdfdf;
            }
        }
    }
}
</style>