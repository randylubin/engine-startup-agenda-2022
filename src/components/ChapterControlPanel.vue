<template>
  <div id="chapter-control-panel">
    <button v-on:click="restartGame()">Restart</button>
  </div>
</template>

<script>

  export default {
    name: 'chapter-control-panel',
    props: {
      
    },
    components: {
    },
    data () {
      return {
      }
    },
    mounted () {
    },
    methods: {
      restartGame () {
        this.$emit('restart-game')
      }
    }
  }
</script>

<style lang="scss">

</style>