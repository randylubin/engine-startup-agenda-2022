<template>
  <div key="result-panel">
    <p>{{chosenOption.resultsText}}</p>
    <ul id="consequences-status" v-if="primaryStateChange || chosenOption.stateChange.focus">
      <li :class="{capital: true, increase: chosenOption.stateChange.capital > 0, decrease: chosenOption.stateChange.capital < 0}" v-if="primaryStateChange"></li>
      <li :class="{users: true, increase: chosenOption.stateChange.users > 0, decrease: chosenOption.stateChange.users < 0}" v-if="primaryStateChange"></li>
      <li :class="{capabilities: true, increase: chosenOption.stateChange.capabilities > 0, decrease: chosenOption.stateChange.capabilities < 0}" v-if="primaryStateChange"></li>
      <li class="focus replenish" v-if="chosenOption.stateChange.focus > 0">Your&ensp;<strong class="ii focus">Time &amp; Focus</strong> has been replenished.</li>
      <li class="focus deplete" v-if="chosenOption.stateChange.focus < 0">Some of your&ensp;<strong class="ii focus">Time &amp; Focus</strong> has been occupied.</li>
    </ul>
    <issue-note
      v-if="chosenOption.settings.issueNote"
      :noteKey="chosenOption.settings.issueNote"
    />
    <div id="consequences-nav-buttons">
      <button id="nav-continue" class="" v-if="!chosenOption.gameOver && !forceGameOver" v-on:click="nextPrompt()"><span>Continue</span></button>
      <button id="nav-back" v-on:click="undoChoice()" v-if="!(currentChapterInfo.specialChapterType == 'singleScreen')"><span>Back</span></button>       
    </div>
  </div>    
</template>

<script>
import IssueNote from './IssueNote.vue';
  export default {
    name: 'result-panel',
    components: {
        IssueNote
    },
    props: {
      chosenOption: Object,
      currentChapterInfo: Object,
      forceGameOver: Boolean
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
    methods: {
      nextPrompt(){
        this.$emit('next-prompt')
      },
      undoChoice(){
        this.$emit('undo-choice')
      }
    }
  }
</script>
