<template>
  <div>
    <div id="devtools-panel">
      <button v-on:click="restartGame()"><span>Restart</span></button>
      <button v-on:click="undoChoice()" :disabled="chapterHistory.length == 1"><span>Previous</span></button>
      <button v-on:click="toggleDebug()"><span>Debug</span></button>
    </div>
    <div id="debug-panel" v-if="debugOpen">
      <h1 class="text-center">Debug Options</h1>
      <div class="state-editor">
        <textarea v-model="editedStateString" cols="30" rows="10"></textarea>
        <div>{{jsonError}}</div>
        <button v-on:click="updateState(editedStateString)" :disabled="currentStateString == editedStateString || jsonError">Update</button>
      </div>
      <div class="go-to-chapter">
        Go to chapter: <input v-model="targetChapter" type="text" id="input-go-to-chapter"> <button v-on:click="goToChapter(targetChapter)" :disabled="!targetChapter">Go</button>
      </div>
      <div class="allow-gameover">
        Prevent state-based gameover: <input type="checkbox" id="prevent-gameover" v-model="preventGameOver">
      </div><br>
      <button v-on:click="toggleDebug()">Close</button>


    </div>
  </div>
</template>

<script>

  export default {
    name: 'devtools-panel',
    props: {
      chapterHistory: Array,
      currentStateString: String,
    },
    components: {
    },
    data () {
      return {
        debugOpen: false,
        targetChapter: null,
        editedStateString: null, 
        preventGameOver: true
      }
    },
    mounted () {
      this.editedStateString = this.currentStateString
    },
    computed: {
      jsonError: function(){
        try {
          JSON.parse(this.editedStateString)
          return null
        } catch(e) {
          return e;
        }
      }
    },
    watch: {
      currentStateString: function(state){
        this.editedStateString = state;
      },
      preventGameOver: function(val) {
        this.$emit('set-game-over',val)
      }
    },
    methods: {
      restartGame () {
        this.$emit('restart-game')
      },
      undoChoice(){
        this.$emit('undo-state-change')
      },
      toggleDebug(){
        this.debugOpen = !this.debugOpen
      },
      goToChapter(targetChapter){
        this.$emit('go-to-chapter', targetChapter);
        this.toggleDebug();
        this.targetChapter = null;
      },
      updateState(newStateString){
        this.$emit('update-state', JSON.parse(newStateString));
      }
    }
  }
</script>

<style lang="scss" >

div#devtools-panel {
	display: flex;
	position: fixed;
	left: 0; bottom: 0;
	padding: .5em;
	background: #000;
	z-index: 5000;
}

div#devtools-panel button {
	column-gap: .25em;
	font-size: .75em;
	padding: .25em;
	padding-right: 1em;
	margin-right: .5em;
	margin-bottom: 0;
	
	background: var(--bg-button-disabled);
}

div#devtools-panel button::before { content: '' }

div#debug-panel {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 5001;
  background: black;
  width: 500px;
  padding: 1em;

  button {
    width: auto;
  }
}

.go-to-chapter {
  display: inline;
}

#input-go-to-chapter {
  width: 35px;
  margin: 0px 10px;
  display: inline;
}

</style>