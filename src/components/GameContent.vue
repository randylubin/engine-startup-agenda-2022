<template>
  <div id="content-panel" :class="{ 'fade-active': fadeActive }">
    <transition name="title-switch" mode="out-in" v-if="currentChapterInfo.dilemmaTitle">
      <h2 v-if="currentChapterIndex % 2" key="odd-title">
        <span>
          <strong v-if="currentChapterInfo.settings.titleTag">
            {{currentChapterInfo.settings.titleTag}}:
          </strong> 
          {{currentChapterInfo.dilemmaTitle}}
        </span>
      </h2>
      <h2 v-else key="even-title">
        <span>
          <strong v-if="currentChapterInfo.settings.titleTag">
            {{currentChapterInfo.settings.titleTag}}:
          </strong> 
          {{currentChapterInfo.dilemmaTitle}}
        </span>
      </h2>
    </transition>

    <transition name="chapter-switch" mode="out-in">
      <div v-if="currentChapterIndex % 2" key="odd-panel">
        <transition name="panel-switch" mode="out-in">
          <dilemma-panel 
            v-if="chosenOption == null"
            key="dilemma-panel"
            ref="dilemma-panel"
            :currentState="currentState"
            :currentChapterInfo="currentChapterInfo"
            @select-option="selectOption"
            @next-prompt="nextPrompt"
            @toggle-tutorial="setFade"
          />
          <result-panel
            v-else
            key="result-panel"
            ref="result-panel"
            :currentChapterInfo="currentChapterInfo"
            :chosenOption="chosenOption"
            @next-prompt="nextPrompt"
            @undo-choice="undoChoice"
          />
        </transition>
      </div>
      <div v-else key="even-panel">
        <transition name="panel-switch" mode="out-in">
          <dilemma-panel 
            v-if="chosenOption == null"
            key="dilemma-panel"
            ref="dilemma-panel"
            :currentState="currentState"
            :currentChapterInfo="currentChapterInfo"
            @select-option="selectOption"
            @next-prompt="nextPrompt"
            @toggle-tutorial="setFade"
          />
          <result-panel
            v-else
            key="result-panel"
            ref="result-panel"
            :currentChapterInfo="currentChapterInfo"
            :chosenOption="chosenOption"
            @next-prompt="nextPrompt"
            @undo-choice="undoChoice"
          />
        </transition>
      </div>
    </transition>

    
  </div>

</template>

<script>
  import ContentDilemma from './ContentDilemma.vue'
  import ContentResult from './ContentResult.vue'
  
  export default {
    name: 'content-panel',
    components: {
      'dilemma-panel': ContentDilemma,
      'result-panel': ContentResult,
    },
    props: {
      currentState: Object,
      currentChapterInfo: Object,
      currentChapterIndex: Number,
      chosenOption: Object,
    },
    data () {
      return {
        fadeActive: false
      }
    },
    mounted () {
    },
    methods: {
      nextPrompt(){
        this.$emit('next-prompt')
      },
      undoChoice(){
        this.$emit('undo-state-change')
      },
      updateState(newState){
        this.$emit('update-state', newState)
      },
      setFade(val) {
        this.fadeActive = val;
      },
      selectOption(option){
        this.$emit('choose-option', option)
      } 
    }
  }
</script>

<style>

.chapter-switch-enter-active { transition: opacity .5s; transition-delay: .4s; pointer-events: none; }
.chapter-switch-leave-active { transition: opacity .4s; pointer-events: none; }
.chapter-switch-enter, .chapter-switch-leave-to { opacity: 0; pointer-events: none; }

.panel-switch-enter-active { transition: opacity .5s; transition-delay: 0; pointer-events: none; }
.panel-switch-leave-active { transition: opacity .4s; pointer-events: none; }
.panel-switch-enter, .panel-switch-leave-to { opacity: 0; pointer-events: none; }

.title-switch-enter-active { white-space: nowrap; transition: padding-left .75s,opacity .75s; }
.title-switch-leave-active { transition: padding-left .5s,opacity .5s ease-out; }
.title-switch-enter, .title-switch-leave-to {
  white-space: nowrap;
  padding-left: 20%;
  opacity: 0;
}



</style>
