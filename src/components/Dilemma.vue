<template>
  <div id="game-dilemma" v-if="currentChapterInfo">
  
	<transition name="title-switch" mode="out-in">
    <h2 v-if="chosenOption == null" key="dilemma-title">
		<strong>Dilemma:</strong> <span>{{currentChapterInfo.dilemmaTitle?currentChapterInfo.dilemmaTitle:"Placeholder Title"}}</span>
	</h2>
	<h2 v-else key="result-title">
		<strong>Result:</strong> <span>{{currentChapterInfo.dilemmaTitle?currentChapterInfo.dilemmaTitle:"Placeholder Title"}}</span>
	</h2>
	</transition>
	<transition name="panel-switch" mode="out-in">
	<div v-if="chosenOption == null" key="dilemma-panel">
		<p>{{currentChapterInfo.dilemmaPrompt}}</p>
        <div class="dilemma-options-list">
			<dilemma-option 
				v-for="(option,index) in currentChapterInfo.dilemmaOptions"
				:currentState = "currentState"
				:option = "option"
				:key = "index"
				@click-option = "selectOption"
			></dilemma-option>
        </div>
		<div v-if="currentChapterInfo.dilemmaNote">
        <h3>Dilemma Note</h3>
        <div>
          {{currentChapterInfo.dilemmaNote}}
        </div>
		</div>
    </div>
    <div v-else key="result-panel">
      <p>{{chosenOption.resultsText}}</p>
      <ul id="consequences-status" v-if="primaryStateChange || chosenOption.stateChange.focus">
        <li :class="{capital: true, increase: chosenOption.stateChange.capital > 0, decrease: chosenOption.stateChange.capital < 0}" v-if="primaryStateChange"></li>
        <li :class="{users: true, increase: chosenOption.stateChange.users > 0, decrease: chosenOption.stateChange.users < 0}" v-if="primaryStateChange"></li>
        <li :class="{capabilities: true, increase: chosenOption.stateChange.capabilities > 0, decrease: chosenOption.stateChange.capabilities < 0}" v-if="primaryStateChange"></li>
		<li class="focus replenish" v-if="chosenOption.stateChange.focus > 0">Your <strong class="ii focus">Time &amp; Focus</strong> has been replenished.</li>
		<li class="focus deplete" v-if="chosenOption.stateChange.focus < 0">Some of your&ensp;<strong class="ii focus">Time &amp; Focus</strong> is occupied by this choice.</li>
      </ul>
      <div id="consequences-nav-buttons">
        <button id="nav-continue" class="" v-if="!chosenOption.gameOver" v-on:click="nextPrompt()"><span>Continue</span></button>
        <button id="nav-back" v-on:click="undoChoice()"><span>Back</span></button>       
      </div>
    </div>
	</transition>
  </div>

</template>

<script>
  import DilemmaOption from './DilemmaOption.vue';
  
  export default {
    name: 'dilemma',
    components: {
        'dilemma-option': DilemmaOption
    },
    props: {
      currentState: Object,
      currentChapterInfo: Object,
      chosenOption: Object,
    },
    data () {
      return {
      }
    },
	computed: {
		primaryStateChange: function () {
			if (!this.chosenOption) {
				return false;
			} else {
				return this.chosenOption.stateChange.capital || this.chosenOption.stateChange.users || this.chosenOption.stateChange.capabilities;
			}
		}
	},
    mounted () {
    },
    methods: {
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
              /*if (newState[stateVariable] < 0){
                newState[stateVariable] = 0
              }*/
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

.panel-switch-enter-active { transition: opacity .75s; transition-delay: .5s; }
.panel-switch-leave-active { transition: opacity .5s; }
.panel-switch-enter, .panel-switch-leave-to {
  opacity: 0;
}

.title-switch-enter-active { white-space: nowrap; transition: padding-left .75s,opacity .75s; }
.title-switch-leave-active { transition: padding-left .5s,opacity .5s ease-out; }
.title-switch-enter, .title-switch-leave-to {
  white-space: nowrap;
  padding-left: 20%;
  opacity: 0;
}



</style>
