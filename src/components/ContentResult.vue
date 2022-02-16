<template>
  <div key="result-panel">
    <p>{{chosenOption.resultsText}}</p>
    <ul id="consequences-status" :class="{ 'game-over' : gameOver }" v-if="primaryStateChange || chosenOption.stateChange.focus">
      <li
        v-if="primaryStateChange"
        :class="{
          capital: true,
          increase: chosenOption.stateChange.capital > 0,
          decrease: chosenOption.stateChange.capital < 0,
          zero: currentState.capital <= 0
        }" 
      ></li>
      <li
        v-if="primaryStateChange" 
        :class="{
          users: true,
          increase: chosenOption.stateChange.users > 0, 
          decrease: chosenOption.stateChange.users < 0,
          zero: currentState.users <= 0
        }" 
      ></li>
      <li
        v-if="primaryStateChange" 
        :class="{
          capabilities: true, 
          increase: chosenOption.stateChange.capabilities > 0, 
          decrease: chosenOption.stateChange.capabilities < 0,
          zero: currentState.capabilities <= 0
        }"
      ></li>
      <li class="focus replenish" v-if="chosenOption.stateChange.focus > 0">Your&ensp;<strong class="ii focus">Time &amp; Focus</strong> has been replenished.</li>
      <li class="focus deplete" v-if="chosenOption.stateChange.focus < 0">Some of your&ensp;<strong class="ii focus">Time &amp; Focus</strong> has been occupied.</li>
    </ul>
    <div class="game-over-scoring" v-if="gameOver">
      <div class="ending-summary" v-html="endingSummary"></div>
      <div class="ending-score">
        <div class="total-score">
          Your score: {{endingScore.total}}
          <li v-for="scoreFactor in endingScore.factors" :key="scoreFactor.name">
            {{scoreFactor.scoreName}}: {{scoreFactor.scoreValue}}
          </li>
        </div>
      </div>
    </div>
    <issue-note
      v-if="chosenOption.settings.issueNote"
      :noteKey="chosenOption.settings.issueNote"
    />
    <div id="consequences-nav-buttons">
      <button id="nav-continue" class="" v-if="!gameOver" v-on:click="nextPrompt()"><span>Continue</span></button>
      <button id="nav-back" v-on:click="undoChoice()" v-if="!(currentChapterInfo.settings.singleScreen)"><span>Back</span></button>       
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
      currentState: Object,
      chosenOption: Object,
      currentChapterInfo: Object,
      gameOver: Boolean,
      endingSummary: String,
      endingScore: Object
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
