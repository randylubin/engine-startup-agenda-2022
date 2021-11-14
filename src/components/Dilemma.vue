<template>
  <div id="game-dilemma" v-if="currentChapterInfo">
    <h2>The Dilemma Section</h2>

    <div v-if="chosenOption == null">
      <div>
        <h3>Dilemma Prompt</h3>
        {{currentChapterInfo.dilemmaPrompt}}
      </div>
      <div>
        <h3>Dilemma Options</h3>
        <div class="dilemma-options-list">
          <div class="dilemma-option"
            v-for="(option, index) in currentChapterInfo.dilemmaOptions" v-bind:key="index"
          >
            <button
              :disabled="isOptionLocked(option.optionRequirements)"
              v-on:click="selectOption(option)"
              v-bind:title="option.optionToolTip"
            >
              {{option.optionText}}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="chosenOption">
      <h3>Option Consequences</h3>
      <div>{{chosenOption.resultsText}}</div>
      <div v-if="chosenOption.stateChange">
        <div v-if="chosenOption.stateChange.capital">
          Capital: {{chosenOption.stateChange.capital}}
        </div>
        <div v-if="chosenOption.stateChange.users">
          Users: {{chosenOption.stateChange.users}}
        </div>
        <div v-if="chosenOption.stateChange.capabilities">
          Capabilities: {{chosenOption.stateChange.capabilities}}
        </div>
      </div>
      <div class="consequences-nav-buttons">
        <button v-on:click="undoChoice()">Back</button>
        <button v-if="!chosenOption.gameOver" v-on:click="nextPrompt()">Continue</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'dilemma',
    props: {
      currentState: Object,
      currentChapterInfo: Object,
      chosenOption: Object,
    },
    data () {
      return {
      }
    },
    mounted () {
    },
    methods: {
      isOptionLocked(requirements){
        let locked = false
        for (const requirement in requirements){
          if (!(this.currentState[requirement] == requirements[requirement] || this.currentState[requirement] >= requirements[requirement])){
            locked = true;
          }
        }
        return locked
      },
      nextPrompt(){
        this.$emit('next-prompt')
      },
      selectOption(option){
        this.$emit('choose-option', option)

        // Update Game State
        let newState = JSON.parse(JSON.stringify(this.currentState))
          
        if(option.stateChange){          
          for (const stateVariable in option.stateChange){
            newState[stateVariable] += option.stateChange[stateVariable]

            if (newState[stateVariable] < 0){
              newState[stateVariable] = 0
            }

            // TODO logic for ending the game if player runs out of cash
          }          
        }

        this.updateState(newState)
      },
      undoChoice(){
        this.$emit('undo-state-change')
        
      },
      updateState(newState){
        this.$emit('update-state', newState)
      }
    }
  }
</script>

<style lang="scss">

</style>
