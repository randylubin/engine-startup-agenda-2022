<template>
 <div id="chapter-control-panel">
    <button v-on:click="restartGame()"><span>Restart</span></button>
    <button v-on:click="undoChoice()" :disabled="chapterHistory.length == 1"><span>Previous</span></button>
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
	display: flex;
	position: fixed;
	left: 0; bottom: 0;
	padding: .5em;
	background: #000;
	z-index: 5000;
}

div#chapter-control-panel button {
	column-gap: .25em;
	font-size: .75em;
	padding: .25em;
	padding-right: 1em;
	margin-right: .5em;
	margin-bottom: 0;
	
	background: var(--bg-button-disabled);
}

div#chapter-control-panel button::before { content: '' }

</style>