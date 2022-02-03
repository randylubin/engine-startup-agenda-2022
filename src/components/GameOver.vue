<template>
  <div id="content-panel" v-if="currentChapterInfo">
    <h2>
      <span>
        <strong>
          Game Over:
        </strong> 
        {{currentChapterInfo.dilemmaTitle}}
      </span>
    </h2>
    <result-panel
      key="result-panel"
      ref="result-panel"
      :forceGameOver="true"
      :currentChapterInfo="currentChapterInfo"
      :chosenOption="chosenOption"
      @undo-choice="undoChoice"
    />
  </div>
</template>

<script>

  import ContentResult from './ContentResult.vue'

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
