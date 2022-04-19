<template>
  <div key="dilemma-panel">

    <!-- Tutorial Page -->
    <template v-if="currentChapterInfo.settings.chapterType == 'tutorial-page'">
      <transition name="subpanel" mode="out-in">
        <template v-if="welcomePage == 0">
          <span key="welcome-page-1">
            <p key="game-intro-subtitle"><strong>You're about to embark on the Startup Trail. Can your company survive?</strong></p>
            <issue-note
              noteKey="game-intro"
              key="game-intro-note"
            />
            <button id="welcome-continue" key="welcome-continue" @click="nextWelcome"><span>Continue</span></button>
          </span>
        </template>
        <template v-else-if="!tutorialActive && !tutorialFinished">
          <span key="welcome-page-2">
            <p key="finish-tutorial-text-a">In this game, you'll make choices to guide your company through a variety of dilemmas. You'll need to use your time and resources carefully, secure ongoing funding, and navigate the many challenges of succeeding as a tech startup.</p>
            <p key="finish-tutorial-text-b">The game will track your decisions and their impact on things like <strong>your founder's stake in your company</strong>. This may impact the way your journey ends!</p>
            <button id="start-tutorial" key="start-tutorial" @click="nextTutorial"><span>How does it work?</span></button>
            <button id="skip-tutorial" key="skip-tutorial" @click="nextPrompt"><span>I've played before, let's get started!</span></button>   
          </span>
        </template>
        <template v-else-if="tutorialFinished">
          <span key="welcome-page-1">
            <p><strong>You're about to embark on the Startup Trail. Can your company survive?</strong></p>
            <button id="start-game" key="start-game" @click="nextPrompt"><span>I'm ready &mdash; let's get started!</span></button>   
          </span>
        </template>
      </transition>
    </template>

    <!-- Founder Select Page -->
    <template v-else-if="currentChapterInfo.settings.chapterType == 'founder-select'">
      <transition name="subpanel" mode="out-in">
        <template v-if="founderPage == 0">
          <span key="founder-page-0">
            <p>The founder's vision, leadership, and skills are critical to startup success. But there are still persistent inequities in the startup ecosystem. Underrepresented founders in particular face unique challenges and unwarranted barriers when launching and growing their companies.</p>
            <issue-note noteKey="founder-intro" />
            <button id="founder-proceed" key="founder-proceed" @click="founderAction('proceed')"><span>Select a founder</span></button>
          </span>
        </template>
        <template v-else-if="founderPage == 1">
          <span key="founder-page-1">
            <div class="founder-profile">
              <div class="avatar">
                <img :src="'/assets/founders/' + Founders[founderChoice].Image" />
              </div>
              <div class="info">
                <ul>
                  <li><strong>Founder:</strong> {{Founders[founderChoice].Name}}</li>
                  <li><strong>Asset:</strong> {{Founders[founderChoice].Asset}}</li>
                  <li><strong>Bio:</strong> {{Founders[founderChoice].Bio}}</li>
                </ul>
                <issue-note v-if="Founders[founderChoice].Note" :noteKey="Founders[founderChoice].Note" />
              </div>
            </div>
            <button id="founder-confirm" key="founder-confirm" @click="founderAction('confirm')"><span>Play as this founder {{founderChoice == 0?'(recommended)':''}}</span></button>
            <button id="founder-change" key="founder-change" @click="founderAction('change')"><span>Choose a different founder</span></button>
          </span>
        </template>
        <template v-else-if="founderPage == 2">
          <span key="founder-page-2">
            <p>Choose a founder to lead your startup:</p>
            <div class="founder-options">
              <div id="founder-0" @click="founderAction('select',0)">
                <img :src="'/assets/founders/' + Founders[0].Image" />
              </div>
              <div id="founder-1" @click="founderAction('select',1)">
                <img :src="'/assets/founders/' + Founders[1].Image" />
              </div>
              <div id="founder-2" @click="founderAction('select',2)">
                <img :src="'/assets/founders/' + Founders[2].Image" />
              </div>
              <div id="founder-3" @click="founderAction('select',3)">
                <img :src="'/assets/founders/' + Founders[3].Image" />
              </div>
            </div>
            <button id="founder-cancel" key="founder-cancel" @click="founderAction('select',founderChoice)"><span>Cancel</span></button>
          </span>
        </template>
      </transition>
    </template>

    <!-- Regular Dilemma Display -->
    <template v-else>
      <span
        v-html="'<p>' + currentChapterInfo.dilemmaPrompt.replaceAll('\n\n','</p><p>') + '</p>'"
      />
      <div class="dilemma-options-list">
        <dilemma-option 
          v-for="(option,index) in currentChapterInfo.dilemmaOptions"
          :currentState = "currentState"
          :option = "option"
          :key = "index"
          @click-option = "selectOption"
        />
      </div>
      <issue-note
        v-if="currentChapterInfo.settings.issueNote"
        :noteKey="currentChapterInfo.settings.issueNote"
      />
    </template>
  </div>    
</template>

<script>
  import DilemmaOption from './DilemmaOption.vue'
  import IssueNote from './IssueNote.vue'

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
      'dilemma-option': DilemmaOption,
      'issue-note': IssueNote
    },
    props: {
      currentState: Object,
      currentChapterInfo: Object
    },
    inject: {
      Founders: 'founders'
    },
    data () {
      return {
        welcomePage: 0,
        tutorialProgress: -1,
        tutorialActive: false,
        tutorialFinished: false,
        founderPage: 0,
        founderChoice: 0
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
      },
      nextWelcome() {
        this.welcomePage++
      },
      founderAction(action,val) {
        switch(action) {
          case 'proceed':
            this.founderPage = 1
            break
          case 'change':
            this.founderPage = 2
            break
          case 'select':
            this.founderChoice = val
            this.founderPage = 1
            break
          case 'confirm':
            this.selectOption(this.currentChapterInfo.dilemmaOptions[this.founderChoice])
            break
          default:
            this.founderPage = 0
        }
      }
    }
  }
</script>

<style>

div.founder-profile {
  display: flex;
  align-items: flex-start;
  margin-top: 1.5em;
  margin-bottom: 1.25em;
}

div.founder-profile > .avatar {
  display: block;
	box-sizing: border-box;
	width: 27%;
  border-radius: 100%;
  padding: 1%; 
  background-color: var(--c-accent-3);
	margin-right: 1.5em;
}

div.founder-profile > .avatar > img {
  display: block;
  width: 100%;
}

div.founder-profile > .info {
  box-sizing: border-box;
  width: 73%;
}

.info ul {
  list-style: none;
  margin-top: .25em;
  padding-left: 0;
  font-size: .9em;
}

.info ul li {
  margin-bottom: .25em;
}

.info ul li strong {
  margin-right: .25em;
  text-transform: uppercase;
  color: var(--c-accent-4);
}


div.founder-options {
  display: flex;
  justify-content: space-between;
  width: 96%;
  margin: 0 auto 1.5em;
}

div.founder-options > div {
  cursor: pointer; 
  box-sizing: border-box;
  width: 22%;
  border-radius: 100%;
  padding: 1%;
  overflow: hidden;
  background-color: var(--c-accent-3);
  transition: background-color .1s linear, transform .1s linear;
}

div.founder-options > div img {
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  display: block;
}

div.founder-options > div:hover {
  transform: scale(1.1);
  background-color: var(--c-button-light-hover);
}

.subpanel-enter-active { transition: opacity 1s; transition-delay: 0; }
.subpanel-leave-active { transition: opacity .5s; }
.subpanel-enter, .subpanel-leave-to {
  opacity: 0;
}
</style>