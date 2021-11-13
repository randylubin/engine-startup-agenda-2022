<template>
  <div id="game">
    <i>The entire game, from Game.vue</i>
    <app-state-sidebar
      :currentState="stateHistory.at(-1)"
    ></app-state-sidebar>
    <app-dilemma
      :currentState="stateHistory.at(-1)"
      :currentChapterInfo="currentChapterInfo"
      @next-prompt="nextPrompt()"
      @undo-state-change="undoStateChange()"
      @update-state="updateState($event)"
    ></app-dilemma>
  </div>
</template>

<script>
  import StateSidebar from './StateSidebar.vue'
  import Dilemma from './Dilemma.vue'
  import DilemmaCompiler from './DilemmaCompiler.js'

  export default {
    name: 'game',
    components: {
      'app-state-sidebar': StateSidebar,
      'app-dilemma': Dilemma,
    },
    data () {
      return {
        stateHistory: [],
        chapterHistory: [],
        currentChapterInfo: {},
      }
    },
    mounted () {
      this.stateHistory.push ({
        capital: 20,
        users: 30,
        capabilities: 10,
        focus: 3,
      })

      console.log('current history', this.stateHistory.at(-1))

      this.currentChapterInfo = DilemmaCompiler[0]()

    },
    methods: {
      nextPrompt(){
        let newDilemma = DilemmaCompiler[this.chapterHistory.length](this.stateHistory.at(-1))
        this.chapterHistory.push(newDilemma)
        this.currentChapterInfo = newDilemma
      },
      undoStateChange(){
        this.stateHistory.pop()
      },
      updateState(newState){
        this.stateHistory.push(newState)
      },
    }
  }
</script>

<style lang="scss">

</style>
