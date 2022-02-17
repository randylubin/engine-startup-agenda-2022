<template>
  <div key="result-panel">
    <p>{{chosenOption.resultsText}}</p>
    <ul id="consequences-status" :class="{ 'game-over' : gameOver }" v-if="primaryStateChange || chosenOption.stateChange.focus || gameOver">
      <li
        v-if="primaryStateChange"
        :class="{
          capital: true,
          state: true,
          increase: chosenOption.stateChange.capital > 0,
          decrease: chosenOption.stateChange.capital < 0,
          zero: currentState.capital <= 0
        }" 
      ></li>
      <li
        v-if="primaryStateChange" 
        :class="{
          users: true,
          state: true,
          increase: chosenOption.stateChange.users > 0, 
          decrease: chosenOption.stateChange.users < 0,
          zero: currentState.users <= 0
        }" 
      ></li>
      <li
        v-if="primaryStateChange" 
        :class="{
          capabilities: true, 
          state: true,
          increase: chosenOption.stateChange.capabilities > 0, 
          decrease: chosenOption.stateChange.capabilities < 0,
          zero: currentState.capabilities <= 0
        }"
      ></li>
      <li class="focus replenish" v-if="chosenOption.stateChange.focus > 0 && !gameOver">Your&ensp;<strong class="ii focus">Time &amp; Focus</strong> has been replenished.</li>
      <li class="focus deplete" v-if="chosenOption.stateChange.focus < 0 && !gameOver">Some of your&ensp;<strong class="ii focus">Time &amp; Focus</strong> has been occupied.</li>
      <li class="game-over-summary" v-if="gameOver">
        <div class="ending-summary" v-html="endingSummary"></div>
        <div class="ending-score">
          <div class="total-score">
            Your score: {{endingScore.total}}
            <div v-for="scoreFactor in endingScore.factors" :key="scoreFactor.name">
              <span :class="scoreFactor.scoreClass?scoreFactor.scoreClass:''">
                {{scoreFactor.scoreName}}:
              </span> {{scoreFactor.scoreValue}}
            </div>
          </div>
        </div>
      </li>
    </ul>
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