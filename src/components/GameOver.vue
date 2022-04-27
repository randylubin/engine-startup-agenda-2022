<template>
  <div id="content-panel" v-if="currentChapterInfo">
    <h2>
      <span>
        <strong>
          {{endingTitle.tag?endingTitle.tag:'Game Over'}}:
        </strong> 
        {{endingTitle.title?endingTitle.title:currentChapterInfo.dilemmaTitle}}
      </span>
    </h2>
    <result-panel
      key="result-panel"
      ref="result-panel"
      :gameOver="true"
      :endingSummary="endingSummary"
      :endingTitle="endingTitle.title"
      :endingScore="endingScore"
      :endingRank="endingRank"
      :currentState="currentState"
      :currentChapterInfo="currentChapterInfo"
      :currentChapterIndex="currentChapterIndex"
      :chosenOption="chosenOption"
      @undo-choice="undoChoice"
      @share-status="$emit('share-status',$event)"
      @restart-game="$emit('restart-game')"
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
        let summary = ""

        for (const i in EndingScoringFactors){
          if (this.currentState[EndingScoringFactors[i].endingProp]){
            summary = EndingScoringFactors[i].summary
            return summary
          }
        }

        if (this.currentState.capital <= 0) summary = "In your rush to grow the company, you've burned through all your cash. "
        if (this.currentState.users <= 0) summary += "Despite early growth, your user base has become stagnant. Your site is full of bots and dead accounts. "
        if (this.currentState.capabilities <=0) summary += "The most capable members of your team have left and your tech stack is a massive libability. Your product is stuck decaying feature by feature. "
        summary += "Better luck next time!"
        
        return summary
      },
      endingTitle: function() {
        let title = false
        let tag = false

        for (const i in EndingScoringFactors){
          if (this.currentState[EndingScoringFactors[i].endingProp]){
            title = EndingScoringFactors[i].scoreName
            tag = EndingScoringFactors[i].tag
            return { title, tag }
          }
        }

        tag = 'Game Over'

        if (this.currentState.capital <= 0) title = 'Out of Money'
        else if (this.currentState.users <= 0) title = 'Stagnant User Base'
        else if (this.currentState.capabilities <=0) title = 'Decaying Product'

        return { title, tag }
      },
      endingScore: function(){
        let scoringData = {
          total: 0,
          factors: []
        }

        // Quantitative factors
        scoringData.factors.push ({
          scoreName: "Financial Health",
          scoreClass: ["ii","capital"],
          scoreValue: Math.max(0,this.currentState.capital),
          showValue: true,
          filterValue: true
        })

        scoringData.factors.push ({
          scoreName: "Users",
          scoreClass: ["ii","users"],
          scoreValue: Math.max(0,this.currentState.users),
          showValue: true,
          filterValue: true
        })

        scoringData.factors.push ({
          scoreName: "Tech & Talent",
          scoreClass: ["ii","capabilities"],
          scoreValue: Math.max(0,this.currentState.capabilities),
          showValue: true,
          filterValue: true
        })

        scoringData.factors.push ({
          scoreName: "Ownership Stake",
          scoreClass: ["ii","arrow"],
          scoreValue: this.currentState.founderDilution?100-this.currentState.founderDilution:100,
          showValue: true,
          append: '%'
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
      },
      endingRank: function() {
        const { capital, users, capabilities } = this.currentState
        if (capital <= 0 || users <= 0 || capabilities <= 0) return 1

        // Ending types:
        // endingWindDown
        // endingAcquihire
        // endingAcquisitionB
        // endingAcquisitionC
        // endingPrivate
        // endingIPO
        // endingFAANG
        // endingNewCEO

        let breakpoints

        if (this.currentState['endingWindDown'])            breakpoints = [999]
        else if (this.currentState['endingDeadEnd'])        breakpoints = [999]
        else if (this.currentState['endingAcquihire'])      breakpoints = [210,999]
        else if (this.currentState['endingAcquisitionB'])   breakpoints = [175,225,999]
        else if (this.currentState['endingAcquisitionC'])   breakpoints = [0,175,225,999]
        else                                                breakpoints = [0,150,175,225,999]

        if (this.endingScore.total < breakpoints[0]) return 1
        else if (this.endingScore.total < breakpoints[1]) return 2
        else if (this.endingScore.total < breakpoints[2]) return 3
        else if (this.endingScore.total < breakpoints[3]) return 4
        else return 5
        
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
