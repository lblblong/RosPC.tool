<template>
    <div id="editMap">
        <div class="tools">
            <v-edit-map-toolbar></v-edit-map-toolbar>
        </div>
        <div class="edit" id="edit">
            <canvas id="canvas" v-bind:width="mapW" v-bind:height="mapH"></canvas>
        </div>
    </div>
</template>

<script>
import editHelp from '../../../tool/EditMapHelp'
import editMapToolbar from '../../widget/editMapToolbar'
export default {
    data() {
        return {
            // window.map 在 jiantu 中随地图变化
            mapW: window.map.width,
            mapH: window.map.height
        }
    },
    components: {
        'v-edit-map-toolbar': editMapToolbar
    },
    mounted() {
        let canvas = document.getElementById('canvas')
        let edit = document.getElementById('edit')
        let editMap = document.getElementById('editMap')
        editHelp.setElement(canvas, edit, editMap)
        // 默认设置为画笔
        editHelp.drawBrush()
    }
}
</script>

<style lang="scss" scoped="" type="text/css">
#editMap {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .tools {
        width: 40px;
        position: absolute;
        z-index: 100;
        left: 0;
        top: 100px;
    }
    .edit {
        position: absolute;
    }
}
</style>