<template>
  <div key="result-panel">
    <span
      v-html="'<p>' + chosenOption.resultsText.replaceAll('\n\n','</p><p>') + '</p>'"
    />
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
      <li class="dilution" v-if="chosenOption.stateChange.founderDilution">After factoring in investor and employee shares, your ownership stake in the company is now <strong>{{currentState.founderDilution?100-currentState.founderDilution:100}}%</strong></li>
      <li class="focus replenish" v-if="chosenOption.stateChange.focus > 0 && !gameOver">Your&ensp;<strong class="ii focus">Time &amp; Focus</strong> has been replenished.</li>
      <li class="focus deplete" v-if="chosenOption.stateChange.focus < 0 && !gameOver">Some of your&ensp;<strong class="ii focus">Time &amp; Focus</strong> has been occupied.</li>
      <li class="game-over-summary" v-if="gameOver">
        <div class="ending-summary" v-html="endingSummary"></div>
        <div class="ending-score">
          <div class="score-total">
            <span>Startup Rank:</span>
            <div class="score-rank">
              <img :src="endingRank>0?'/assets/unicorn.svg':'/assets/unicorn-outline.svg'">
              <img :src="endingRank>1?'/assets/unicorn.svg':'/assets/unicorn-outline.svg'">
              <img :src="endingRank>2?'/assets/unicorn.svg':'/assets/unicorn-outline.svg'">
              <img :src="endingRank>3?'/assets/unicorn.svg':'/assets/unicorn-outline.svg'">
              <img :src="endingRank>4?'/assets/unicorn.svg':'/assets/unicorn-outline.svg'">
            </div>
            <!--<span>Score:</span> {{endingScore.total}}-->
            <button
              id="share-ending"
              @click="$emit('share-status',$event)"
              @share-success="shareResult(true,$event)"
              @share-fail="shareResult(false,$event)"
            ></button>
          </div>
          <div class="score-factors">
            <div v-for="scoreFactor in endingScore.factors" :key="scoreFactor.name">
              <span :class="scoreFactor.scoreClass?scoreFactor.scoreClass:''">
                {{scoreFactor.scoreName}}{{scoreFactor.showValue?':':''}}
              </span> {{scoreFactor.showValue?scoreFactor.filterValue?parseScore(scoreFactor.scoreValue):scoreFactor.scoreValue:''}}{{scoreFactor.append?scoreFactor.append:''}}
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
      <button id="nav-restart" class="" v-if="gameOver" v-on:click="$emit('restart-game')"><span>Start Over</span></button>
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
      currentChapterIndex: Number,
      gameOver: Boolean,
      endingSummary: String,
      endingScore: Object,
      endingRank: Number,
      endingTitle: String
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
    beforeMount() {
      this.$emit('unscroll')
    },
    mounted(){
      if (this.gameOver) {
        this.$gtag.event('Game Over at ' + this.currentChapterIndex, { 
					'event_label' : this.endingTitle + ', Score: ' + this.endingScore,
					'event_category' : 'Game Progress'
				})
      }
    },
    methods: {
      nextPrompt(){
        this.$emit('next-prompt')
      },
      undoChoice(){
        this.$emit('undo-choice')
      },
      parseScore(score) {
        if (score <= 20) {
          return 'Poor'
        } else if (score <= 50) {
          return 'Okay'
        } else if (score <= 75) {
          return 'Good'
        } else if (score <= 99) {
          return 'Great'
        } else {
          return 'Excellent'
        }
      },
      shareResult(success,e) {
        const msgClass = success?'msg-success':'msg-fail'
        e.target.classList.add(msgClass)
        setTimeout(() => e.target.classList.remove(msgClass),2000)
      }
    }
  }
</script>
