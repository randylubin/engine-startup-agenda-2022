<template>
  <div key="dilemma-panel">

    <!-- Tutorial Page -->
    <template v-if="currentChapterInfo.specialChapterType == 'tutorialPage'">
      <p><strong>You're about to embark on the Silicon Trail. Can your startup survive?</strong></p>
      <p>In this game, you'll make choices to guide your company through a variety of dilemmas. You'll need to use your time and resources carefully, secure ongoing funding, and navigate the many challenges of succeeding as a tech startup.</p>
      <transition-group name="tutorial" mode="out-in">
        <template v-if="!tutorialActive && !tutorialFinished">  
          <button id="start-tutorial" key="start-tutorial" @click="nextTutorial"><span>How does it work?</span></button>
          <button id="skip-tutorial" key="skip-tutorial" @click="nextPrompt"><span>I've played before, let's get started!</span></button>   
        </template>
        <template v-else-if="tutorialFinished">
          <p key="finish-tutorial-text">The game will track your decisions and their impact on things like <strong>your founder's stake in your company</strong>. This may impact the way your journey ends!</p>
          <button id="start-game" key="start-game" @click="nextPrompt"><span>I'm ready &mdash; let's get started!</span></button>   
        </template>
      </transition-group>
    </template>

    <!-- Regular Dilemma Display -->
    <template v-else>
      <p>{{currentChapterInfo.dilemmaPrompt}}</p>
      <div class="dilemma-options-list">
        <dilemma-option 
          v-for="(option,index) in currentChapterInfo.dilemmaOptions"
          :currentState = "currentState"
          :option = "option"
          :key = "index"
          @click-option = "selectOption"
        />
      </div>
      <div v-if="currentChapterInfo.dilemmaNote">
        <h3>Dilemma Note</h3>
        <div>{{currentChapterInfo.dilemmaNote}}</div>
      </div>
    </template>
  </div>    
</template>

<script>
  import DilemmaOption from './DilemmaOption.vue';

  const TutorialScript = [
    function(vm) {
      vm.tutorialActive = true
      const ttItemList = document.querySelectorAll('#sidebar-panel .tt-container')
      ttItemList.forEach(el => {
        el.classList.remove('tt-container')
        el.classList.add('tt-paused')
      })
      const ttItem = document.getElementById('meter-capital')
      ttItem.classList.add('tt-force')
    },
    function() {
      const ttLastItem = document.getElementById('meter-capital')
      const ttItem = document.getElementById('meter-users')
      ttLastItem.classList.remove('tt-force')
      ttItem.classList.add('tt-force')
    },
    function() {
      const ttLastItem = document.getElementById('meter-users')
      const ttItem = document.getElementById('meter-capabilities')
      ttLastItem.classList.remove('tt-force')
      ttItem.classList.add('tt-force')
    },
    function() {
      const ttLastItem = document.getElementById('meter-capabilities')
      const ttItem = document.getElementById('counter-focus')
      ttLastItem.classList.remove('tt-force')
      ttItem.classList.add('tt-force')
    },
    function() {
      const ttLastItem = document.getElementById('counter-focus')
      const ttItem = document.getElementById('list-activity')
      ttLastItem.classList.remove('tt-force')
      ttItem.classList.add('tt-force')
    },
    function(vm) {
      const ttLastItem = document.getElementById('list-activity')
      ttLastItem.classList.remove('tt-force')
      const ttItemList = document.querySelectorAll('#sidebar-panel .tt-paused')
      ttItemList.forEach(el => {
        el.classList.remove('tt-paused')
        el.classList.add('tt-container')
      })
      vm.tutorialActive = false
      vm.tutorialFinished = true
    }
  ]

  export default {
    name: 'dilemma-panel',
    components: {
      'dilemma-option': DilemmaOption
    },
    props: {
      currentState: Object,
      currentChapterInfo: Object
    },
    data () {
      return {
        tutorialProgress: -1,
        tutorialActive: false,
        tutorialFinished: false
      }
    },
    watch: {
      tutorialActive(val) { this.$emit('toggle-tutorial',val) }
    },
    methods: {
      selectOption(option) {
        this.$emit('select-option', option)
      },
      nextPrompt(){
        this.$emit('next-prompt')
      },
      nextTutorial() {
        TutorialScript[++this.tutorialProgress](this);
      }
    }
  }
</script>

<style>
.tutorial-enter-active { transition: opacity 1s; transition-delay: 0; }
.tutorial-leave-active { transition: opacity .5s; }
.tutorial-enter, .tutorial-leave-to {
  opacity: 0;
}
</style>