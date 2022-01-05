<template>
  <div id="chapter-control-panel">
    <button v-on:click="restartGame()">Restart</button>
    <button v-on:click="undoChoice()" :disabled="chapterHistory.length == 1">Prior Dilemma</button>
  </div>
</template>

<script>

  export default {
    name: 'chapter-control-panel',
    props: {
      chapterHistory: Array
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
      },
      undoChoice(){
        this.$emit('undo-state-change')
      },
    }
  }
</script>

<style lang="scss">

</style>