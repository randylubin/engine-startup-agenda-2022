<template>
 <div id="chapter-control-panel">
    <button v-on:click="restartGame()">Restart</button>
    <button v-on:click="undoChoice()" :disabled="chapterHistory.length == 1">Previous</button>
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

<style>

div#chapter-control-panel {
	display: inline-block;
	position: absolute;
	left: 0; bottom: 0;
	padding: .5em;
	background: #000;
}

div#chapter-control-panel button {
	display:inline-block;
	font-size: .75em;
	width: 40%;
	margin-right: 1em;
}

</style>