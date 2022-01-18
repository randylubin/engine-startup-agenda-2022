<template>
  <div id="game-dilemma" v-if="currentChapterInfo">
  
	<transition name="title-switch" mode="out-in">
    <h2 key="result-title">
      <strong>Game Over:</strong> <span>{{currentChapterInfo.dilemmaTitle?currentChapterInfo.dilemmaTitle:"Placeholder Title"}}</span>
    </h2>
	</transition>
	<transition name="panel-switch" mode="out-in">
    <div key="result-panel">
      <p>{{chosenOption.resultsText}}</p>
      <ul id="consequences-status" v-if="primaryStateChange || chosenOption.stateChange.focus">
        <li :class="{capital: true, increase: chosenOption.stateChange.capital > 0, decrease: chosenOption.stateChange.capital < 0}" v-if="primaryStateChange"></li>
        <li :class="{users: true, increase: chosenOption.stateChange.users > 0, decrease: chosenOption.stateChange.users < 0}" v-if="primaryStateChange"></li>
        <li :class="{capabilities: true, increase: chosenOption.stateChange.capabilities > 0, decrease: chosenOption.stateChange.capabilities < 0}" v-if="primaryStateChange"></li>
        <li class="focus replenish" v-if="chosenOption.stateChange.focus > 0">Your <strong class="ii focus">Time &amp; Focus</strong> has been replenished.</li>
        <li class="focus deplete" v-if="chosenOption.stateChange.focus < 0">Some of your&ensp;<strong class="ii focus">Time &amp; Focus</strong> is occupied by this choice.</li>
      </ul>
      <div id="consequences-nav-buttons">
        <button id="nav-back" v-on:click="undoChoice()"><span>Back</span></button>       
      </div>
    </div>
	</transition>
  </div>

</template>

<script>
  export default {
    name: 'game-over',
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
      undoChoice(){
        this.$emit('undo-state-change')
      },
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
