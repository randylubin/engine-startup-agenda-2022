<template>
  <div id="content-panel" v-if="currentChapterInfo">
    <h2>
      <span>
        <strong>
          Game Over:
        </strong> 
        {{endingTitle?endingTitle:currentChapterInfo.dilemmaTitle}}
      </span>
    </h2>
    <result-panel
      key="result-panel"
      ref="result-panel"
      :gameOver="true"
      :endingSummary="endingSummary"
      :endingScore="endingScore"
      :currentState="currentState"
      :currentChapterInfo="currentChapterInfo"
      :chosenOption="chosenOption"
      @undo-choice="undoChoice"
    />
  </div>
</template>

<script>

  import ContentResult from './ContentResult.vue'
  import EndingScoringFactors from './EndingScoringFactors.js'

  export default {
    name: 'game-over',
    components: {
      'result-panel': ContentResult
    },
    props: {
      currentState: Object,
      currentChapterInfo: Object,
      currentChapterIndex: Number,
      chosenOption: Object,
    },
    data () {
      return {
      }
    },
    computed: {
      endingSummary: function(){
        // Ending types:
        // endingWindDown
        // endingAcquihire
        // endingAcquisition
        // endingPrivate
        // endingIPO
        // endingFAANG
        // endingNewCEO

        let summary = ""

        for (const i in EndingScoringFactors){
          if (this.currentState[EndingScoringFactors[i].endingProp]){
            summary = EndingScoringFactors[i].summary
            return summary
          }
        }

        if (this.currentState.capital <= 0) summary = "In your rush to grow the company, you've burned through all your cash. "
        if (this.currentState.users <= 0) summary += "Despite early growth, your user base has become stagnant. Your site is full of bots and dead accounts. "
        if (this.currentState.capabilities <=0) summary += "The most capable members of your team have left and your tech stack is a massive libability. You're product is stuck decaying feature by feature. "
        summary += "Better luck next time!"
        
        return summary
      },
      endingTitle: function() {
        let title = false

        for (const i in EndingScoringFactors){
          if (this.currentState[EndingScoringFactors[i].endingProp]){
            title = EndingScoringFactors[i].scoreName
            return title
          }
        }

        if (this.currentState.capital <= 0) title = "Out of Money"
        else if (this.currentState.users <= 0) title = "Stagnant User Base"
        else if (this.currentState.capabilities <=0) title = "Decaying Product"

        return title
      },
      endingScore: function(){
        let scoringData = {
          total: 0,
          factors: []
        }

        // Quantitative factors
        scoringData.factors.push ({
          scoreName: "Remaining capital",
          scoreValue: this.currentState.capital * 100
        })

        scoringData.factors.push ({
          scoreName: "Users",
          scoreValue: this.currentState.users * 100
        })

        scoringData.factors.push ({
          scoreName: "Tech and Talent",
          scoreValue: this.currentState.capabilities * 100
        })

        // Check EndingScoringFactors.js for all of the qualitiative factors
        for (const i in EndingScoringFactors){
          if (this.currentState[EndingScoringFactors[i].endingProp]){
            scoringData.factors.push(EndingScoringFactors[i])
          }
        }

        // Add up the score
        for (const i in scoringData.factors){
          scoringData.total += scoringData.factors[i].scoreValue
        }

        return scoringData
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
