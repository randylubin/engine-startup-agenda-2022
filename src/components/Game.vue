<template>
  <div id="game">
    <i>The entire game, from Game.vue</i>
    <app-state-sidebar
      :currentState="stateHistory.at(-1)"
    ></app-state-sidebar>
    <app-chapter-control-panel
      @restart-game="restartGame()"
    ></app-chapter-control-panel>
    <app-dilemma
      :currentState="stateHistory.at(-1)"
      :currentChapterInfo="currentChapterInfo"
      :chosenOption="optionHistory.at(-1)"
      @choose-option="chooseOption($event)"
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
  import ChapterControlPanel from './ChapterControlPanel.vue'

  export default {
    name: 'game',
    components: {
      'app-state-sidebar': StateSidebar,
      'app-dilemma': Dilemma,
      'app-chapter-control-panel': ChapterControlPanel,
    },
    data () {
      return {
        initialState: [{
          capital: 20,
          users: 30,
          capabilities: 10,
          focus: 3,
        }],
        stateHistory: [],
        chapterHistory: [],
        currentChapterInfo: {},
        optionHistory: [],
      }
    },
    mounted () {      
      this.stateHistory = localStorage.stateHistory ? JSON.parse(localStorage.stateHistory) : JSON.parse(JSON.stringify(this.initialState))

      this.chapterHistory = localStorage.currentChapterInfo ? JSON.parse(localStorage.currentChapterInfo) : this.chapterHistory.push(DilemmaCompiler[0]())
      this.currentChapterInfo = localStorage.currentChapterInfo ? JSON.parse(localStorage.currentChapterInfo) : DilemmaCompiler[0]()
      this.optionHistory = localStorage.optionHistory ? JSON.parse(localStorage.optionHistory) : []
    },
    watch: {
      stateHistory(newHistory){ localStorage.stateHistory = JSON.stringify(newHistory)},
      chapterHistory(newData){ localStorage.currentChapterInfo = JSON.stringify(newData)},
      currentChapterInfo(newData){ localStorage.currentChapterInfo = JSON.stringify(newData)},
      optionHistory(newData){ localStorage.optionHistory = JSON.stringify(newData)},
    },
    methods: {
      chooseOption(option){
        this.optionHistory.push(option)
      },
      nextPrompt(){
        let newDilemma = DilemmaCompiler[this.chapterHistory.length](this.stateHistory.at(-1))
        this.chapterHistory.push(newDilemma)
        this.optionHistory.push(null)
        this.currentChapterInfo = newDilemma
      },
      restartGame(){
        console.log('restarting')
        this.stateHistory = JSON.parse(JSON.stringify(this.initialState))
        this.chapterHistory = [DilemmaCompiler[0]()]
        this.currentChapterInfo = DilemmaCompiler[0]()
        this.optionHistory = []
      },
      undoStateChange(){
        this.stateHistory.pop()
        this.optionHistory.pop()

      },
      updateState(newState){
        this.stateHistory.push(newState)
      },
    }
  }
</script>

<style lang="scss">

</style>
