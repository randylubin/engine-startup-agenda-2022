<template>
  <div id="game-dilemma" v-if="currentChapterInfo">
  
    <h2><strong>{{chosenOption == null?"Dilemma":"Result"}}:</strong> <span>{{currentChapterInfo.dilemmaTitle?currentChapterInfo.dilemmaTitle:"Placeholder Title"}}</span></h2>

	<div v-if="chosenOption == null">
		<p>{{currentChapterInfo.dilemmaPrompt}}</p>
        <div class="dilemma-options-list">
          <div class="dilemma-option"
            v-for="(option, index) in currentChapterInfo.dilemmaOptions" v-bind:key="index"
          >
            <button
              :disabled="isOptionLocked(option.optionRequirements)"
              v-on:click="selectOption(option)"
              v-bind:title="option.optionToolTip"
              v-if="isOptionVisible(option.optionVisibility)"
            >
				<ul>
					<li class="capital" v-if="doesOptionRequire('capital',option.optionRequirements)"></li>
					<li class="users" v-if="doesOptionRequire('users',option.optionRequirements)"></li>
					<li class="capabilities" v-if="doesOptionRequire('capabilities',option.optionRequirements)"></li>
					<li class="focus" v-if="doesOptionRequire('focus',option.optionRequirements)"></li>
				</ul>
				<span>{{option.optionText}}</span>
				
            </button>
          </div>
        </div>
		<div v-if="currentChapterInfo.dilemmaNote">
        <h3>Dilemma Note</h3>
        <div>
          {{currentChapterInfo.dilemmaNote}}
        </div>
		</div>
    </div>

    <div v-if="chosenOption">
      <p>{{chosenOption.resultsText}}</p>
      <ul id="consequences-status" v-if="chosenOption.stateChange.capital || chosenOption.stateChange.users || chosenOption.stateChange.capabilities">
        <li :class="{capital: true, increase: chosenOption.stateChange.capital > 0, decrease: chosenOption.stateChange.capital < 0}"></li>
        <li :class="{users: true, increase: chosenOption.stateChange.users > 0, decrease: chosenOption.stateChange.users < 0}"></li>
        <li :class="{capabilities: true, increase: chosenOption.stateChange.capabilities > 0, decrease: chosenOption.stateChange.capabilities < 0}"></li>
      </ul>
      <div id="consequences-nav-buttons">
        <button id="nav-continue" class="dark" v-if="!chosenOption.gameOver" v-on:click="nextPrompt()"><span>Continue</span></button>
        <button id="nav-back" v-on:click="undoChoice()"><span>Back</span></button>       
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
      isOptionVisible(requirements){
        if (!requirements) {
          return true;
        } else {
          let visible = false

          for (const requirement in requirements){
            if ((this.currentState[requirement] == requirements[requirement] || this.currentState[requirement] >= requirements[requirement])){
              visible = true;
            }
          }
          

          return visible
        }
      },
		doesOptionRequire(check,requirements) {
		if(!requirements) {
			return false;
		} else {
			if (requirements[check] > 0) {
				return true;
			} else {
				return false;
			}
		}
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
            if (Number.isInteger(option.stateChange[stateVariable])){
              newState[stateVariable] += option.stateChange[stateVariable]
  
              if (newState[stateVariable] < 0){
                newState[stateVariable] = 0
              }
              // TODO logic for ending the game if player runs out of cash
            } else {
              newState[stateVariable] = option.stateChange[stateVariable]
            }

            
          }          
        }

        if(option.addEvent){
          newState.pastEvents.unshift(option.addEvent)
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

<style>

</style>
