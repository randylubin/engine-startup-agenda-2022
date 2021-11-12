<template>
  <div id="game">
    <i>The entire game, from Game.vue</i>
    <app-state-sidebar
      :currentState="stateHistory.at(-1)"
    ></app-state-sidebar>
    <app-dilemma
      :currentState="stateHistory.at(-1)"
      :currentChapterInfo="currentChapterInfo"
      @update-state="updateState($event)"
      @undo-state-change="undoStateChange()"
    ></app-dilemma>
  </div>
</template>

<script>
  import StateSidebar from './StateSidebar.vue'
  import Dilemma from './Dilemma.vue'

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
        users: 0,
        capabilities: 10
      })

      console.log('current history', this.stateHistory.at(-1))

      this.currentChapterInfo = {
        dilemmaPrompt: "The dilemma for this round is lorem ipsum... what do you do?",
        dilemmaOptions: [
          {
            optionText: "Do nothing",
            resultsText: "You lose... click back to choose a different option",
            stateChange: {
              capital: -10,
              users: 5,
              capabilities: 0,
            },
            gameOver: true,
          },
          {
            optionText: "Do a little",
          },
          {
            optionText: "Do a lot",
          },
          {
            optionText: "Magically fix it",
          },
        ],
      }

    },
    methods: {
      updateState(newState){
        this.stateHistory.push(newState)
      },
      undoStateChange(){
        this.stateHistory.pop()
      }
    }
  }
</script>

<style lang="scss">

</style>
