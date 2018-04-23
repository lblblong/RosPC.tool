<template>
  <div id="app">
    <v-header></v-header>
    <v-main></v-main>
    <v-tool></v-tool>
  </div>
</template>

<script>
import header from './components/header'
import main from './components/main'
import tool from './components/tool'
export default {
    components: {
        'v-header': header,
        'v-tool': tool,
        'v-main': main
    }
}
</script>

<style lang="scss" scoped="" type="text/css">
#app {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
