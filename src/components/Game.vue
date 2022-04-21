<template>
  <div id="game">
    <transition appear name="title-screen"> 
      <title-screen
        v-if="!gameStarted"
        key="title-screen"
        :save-exists="saveExists"
        @new-game="newGame"
        @resume-game="resumeGame"
      />
    </transition>
    <div class="overlay-wrapper" key="overlay-wrapper">
      <transition appear name="menu-bar"> 
        <menu-panel
					v-if="gameStarted"
					:currentChapterIndex="chapterHistory.length-1"
					@share-status="shareStatus"
					@restart-game="restartGame"
				/>
      </transition>
      <transition appear name="side-bar"> 
        <sidebar-panel
          v-if="gameStarted"
          key="sidebar-panel"
          :currentState="stateHistory[this.stateHistory.length-1]"
					:currentFounder="currentFounder"
					:currentHeadquarters="currentHeadquarters"
          :chosenOption="optionHistory[this.optionHistory.length-1]"
          @next-tutorial="nextTutorial()"
        />
      </transition>
    </div>
    <transition appear name="content-main">
      <content-panel
        v-if="!gameOver && gameStarted"
        key="content-panel"
        ref="content-panel"
        :currentState="stateHistory[this.stateHistory.length-1]"
        :currentChapterInfo="currentChapterInfo"
        :currentChapterIndex="chapterHistory.length-1"
        :chosenOption="optionHistory[this.optionHistory.length-1]"
        @choose-option="chooseOption($event)"
        @next-prompt="nextPrompt()"
        @undo-state-change="undoStateChange()"
        @update-state="updateState($event)"
				@restart-game="restartGame"
      />
    </transition>
    <transition appear name="game-over">
      <gameover-panel
        v-if="gameOver && gameStarted"
        key="gameover-panel"
				ref="gameover-panel"
        :currentState="stateHistory[this.stateHistory.length-1]"
        :currentChapterInfo="currentChapterInfo"
        :currentChapterIndex="chapterHistory.length-1"
        :chosenOption="optionHistory[this.optionHistory.length-1]"
        @undo-state-change="undoStateChange()"
				@share-status="shareStatus"
				@restart-game="restartGame"
      />
    </transition>
    <devtools-panel
      v-if="gameStarted && devMode"
      :chapterHistory="chapterHistory"
      :currentStateString="JSON.stringify(stateHistory[this.stateHistory.length-1], null, 5)"
      @go-to-chapter="goToChapter($event)"
      @restart-game="restartGame()"
      @undo-state-change="undoStateChange()"
      @update-state="updateState($event)"
      @set-game-over="setGameOver"
    />
  </div>
</template>

<script>

  import DilemmaCompiler from './DilemmaCompiler.js' 
  import FlagIndex from "./FlagIndex.js"
	import NoteIndex from "./NoteIndex.js"

  import GameMenu from './GameMenu.vue'
  import GameSidebar from './GameSidebar.vue'
  import GameContent from './GameContent.vue'
  import GameDevtools from './GameDevtools.vue'
  import GameOver from './GameOver.vue'
  import GameTitleScreen from './GameTitleScreen.vue'

	const ExternalLinks = {
		StartupAgenda: 'https://www.engine.is/news/category/engine-releases-2022-startup-agenda',
		StartupEquity: 'https://www.engine.is/news/category/engine-releases-making-the-startup-ecosystem-more-equitable',
		Engine: 'https://www.engine.is/',
		GameLanding: 'game landing page URL',
		GamePlay: 'https://engine-report-2022.web.app/', // UPDATE WHEN LIVE
		Patent: 'https://www.engine.is/news/category/prioritizing-quality-and-balance-to-promote-innovation'
	}

	const Founders = [
		{
			Name: "Jasmine",
			Asset: "Engineering Background",
			Bio: "Grew up in NYC. A recent graduate of a state college with a well-regarded computer engineering program.",
			Image: "founder-0.svg",
			Note: "founder-0"
		},
		{
			Name: "Sarah",
			Asset: "Social Media Following",
			Bio: "Attended small liberal arts college where she started a popular fashion Instagram account.",
			Image: "founder-1.svg",
			Note: "founder-1"
		},
		{
			Name: "Andre",
			Asset: "Product Design Background",
			Bio: "Mid-career, leaving a job at a big company in the tech industry to start out on his own.",
			Image: "founder-2.svg",
			Note: "founder-2"
		},
		{
			Name: "Michael",
			Asset: "Wealthy Connections",
			Bio: "Recent grad from an elite school with a reputation for turning out startup founders. The child of a Fortune 500 vice president.",
			Image: "founder-3.svg",
			Note: "founder-3"
		}
	]

  export default {
    name: 'game',
    components: {
      'title-screen': GameTitleScreen,
      'menu-panel': GameMenu,
      'sidebar-panel': GameSidebar,
      'content-panel': GameContent,
      'devtools-panel': GameDevtools,
			'gameover-panel': GameOver,
    },
    provide: {
			'external-links': ExternalLinks,
      'dilemma-compiler': DilemmaCompiler,
      'flag-index': FlagIndex,
			'note-index': NoteIndex,
			'founders': Founders
    },
    data () {
      return {
        initialState: [{
          capital: 5,
          users: 5,
          capabilities: 5,
          focus: 3,
					founderDilution: 0,
          pastEvents: []
        }],
        stateHistory: [],
        chapterHistory: [],
        currentChapterInfo: {},
        optionHistory: [null],
        gameStarted: false,
        devMode: false,
        preventGameOver: false
      }
    },
		computed: {
			gameOver: function(){
				let showGameOverScreen = false;
				if (this.optionHistory[this.optionHistory.length-1] && this.stateHistory[this.stateHistory.length-1]){
					if (this.optionHistory[this.optionHistory.length-1].settings.resultType == 'game-over'){ // test for game over from dilemma
						showGameOverScreen = true;
					} else { // test if game over from resources
						let { capital, users, capabilities } = this.stateHistory[this.stateHistory.length-1]
						if (this.stateHistory.length && !(capital > 0 && users > 0 && capabilities > 0)){
							if (!this.preventGameOver) showGameOverScreen = true
						}
					}
				}
				return showGameOverScreen; 
			},
      saveExists: function() {
        return (
          localStorage.stateHistory && 
          localStorage.chapterHistory && 
          localStorage.currentChapterInfo && 
          localStorage.optionHistory &&
          this.chapterHistory.length > 1
          )?true:false;
      },
			currentFounder: function() {
				const { founder0, founder1, founder2, founder3 } = this.stateHistory[this.stateHistory.length-1]
				if (founder0) return Founders[0]
				if (founder1) return Founders[1]
				if (founder2) return Founders[2]
				if (founder3) return Founders[3]
				return {}
			},
			currentHeadquarters: function() {
				const { moveHQ, techHub, otherCity, collegeTown, smallTown } = this.stateHistory[this.stateHistory.length-1]
				if (moveHQ) return "Metaverse Cove"
				if (techHub) return "Big Tech Valley"
				if (otherCity) return "Crypto Hills"
				if (collegeTown) return "University Park"
				if (smallTown) return "Rustic Hollow"
				return "..."
			}
		},
    mounted () {      
      this.stateHistory = localStorage.stateHistory ? JSON.parse(localStorage.stateHistory) : JSON.parse(JSON.stringify(this.initialState))
      this.chapterHistory = localStorage.chapterHistory ? JSON.parse(localStorage.chapterHistory) : [DilemmaCompiler[0].compile()]
      this.currentChapterInfo = localStorage.currentChapterInfo ? JSON.parse(localStorage.currentChapterInfo) : DilemmaCompiler[0].compile()
      this.optionHistory = localStorage.optionHistory ? JSON.parse(localStorage.optionHistory) : []

			window.addEventListener('keydown', this.shortcutKeys)
    },
    watch: {
      stateHistory(newHistory){ localStorage.stateHistory = JSON.stringify(newHistory)},
      chapterHistory(newData){ localStorage.chapterHistory = JSON.stringify(newData)},
      currentChapterInfo(newData){ localStorage.currentChapterInfo = JSON.stringify(newData)},
      optionHistory(newData){ localStorage.optionHistory = JSON.stringify(newData)},
    },
    methods: {
      chooseOption(option, skipping = false){
        this.optionHistory.push(option)

				// Update Game State
        let newState = JSON.parse(JSON.stringify(this.stateHistory[this.stateHistory.length-1]))
          
        if(option.stateChange){          
          for (const stateVariable in option.stateChange){
            if (Number.isInteger(option.stateChange[stateVariable])){
							if ((newState[stateVariable] + option.stateChange[stateVariable]) > 100) {
								option.stateChange[stateVariable] -= (newState[stateVariable] + option.stateChange[stateVariable] - 100)
							}
              newState[stateVariable] += option.stateChange[stateVariable]
            } else {
              newState[stateVariable] = option.stateChange[stateVariable]
            }
          }
					newState.focus = Math.min(newState.focus,3)
					newState.capital = Math.min(newState.capital,100)
					newState.users = Math.min(newState.users,100)
					newState.capabilities = Math.min(newState.capabilities,100)          
        }
        if(option.addEvent){
          newState.pastEvents.unshift(option.addEvent)
        }
        this.updateState(newState)

				if (this.currentChapterInfo.settings.singleScreen && !skipping){
					this.nextPrompt();
				}
      },
			goToChapter(targetChapter){
				console.log('going to', targetChapter)
				let newDilemma = DilemmaCompiler[targetChapter].compile(this.stateHistory[this.stateHistory.length-1])
        this.chapterHistory.push(newDilemma)
        this.optionHistory.push(null)
        this.stateHistory.push(JSON.parse(JSON.stringify(this.stateHistory[this.stateHistory.length-1])))
        this.currentChapterInfo = newDilemma
			},
      nextPrompt(){
        // console.log('ch length', this.chapterHistory.length)
        let newDilemma = DilemmaCompiler[this.chapterHistory.length].compile(this.stateHistory[this.stateHistory.length-1])
        this.chapterHistory.push(newDilemma)
        this.optionHistory.push(null)
        this.stateHistory.push(JSON.parse(JSON.stringify(this.stateHistory[this.stateHistory.length-1])))
        this.currentChapterInfo = newDilemma

				// check for single screen with state change
				if (newDilemma.settings.singleScreen){
					if (Object.keys(newDilemma.dilemmaOptions[0].stateChange).length > 4 || newDilemma.dilemmaOptions[0].stateChange.capital || newDilemma.dilemmaOptions[0].stateChange.users || newDilemma.dilemmaOptions[0].stateChange.capabilities){
						console.log('skipping because', newDilemma.dilemmaOptions[0].stateChange)
						this.chooseOption(newDilemma.dilemmaOptions[0], 'skipping')
					}
				}

				this.$gtag.event('View Dilemma', { dilemmaTitle: this.currentChapterInfo.dilemmaTitle })

      },
      restartGame(){
        console.log('restarting')
        this.stateHistory = JSON.parse(JSON.stringify(this.initialState))
        this.chapterHistory = [DilemmaCompiler[0].compile()]
        this.currentChapterInfo = DilemmaCompiler[0].compile()
        this.optionHistory = [null]
      },
      undoStateChange(){
        if(this.optionHistory.length > 1){
          this.stateHistory.pop()
          this.optionHistory.pop()
          if (this.optionHistory[this.optionHistory.length-1] != null) {
            this.chapterHistory.pop()
            this.currentChapterInfo = DilemmaCompiler[this.chapterHistory.length-1].compile(this.stateHistory[this.stateHistory.length-1])
            console.log('new dilemma', this.currentChapterInfo.dilemmaPrompt)
          } 
          console.log('undoing')
        }
      },
      updateState(newState){
        this.stateHistory.push(newState)
      },
      newGame() {
        this.stateHistory = JSON.parse(JSON.stringify(this.initialState))
        this.chapterHistory = [DilemmaCompiler[0].compile()]
        this.currentChapterInfo = DilemmaCompiler[0].compile()
        this.optionHistory = []
        this.gameStarted = true
      },
      resumeGame() {
        this.gameStarted = true
      },
      nextTutorial() {
        this.$refs['content-panel'].$refs['dilemma-panel'].nextTutorial();
      }, 
      setGameOver(val) {
        console.log(val)
        this.preventGameOver = val
      },
			shortcutKeys(e) {
				if (e.key == 'D') this.devMode = !this.devMode
			},
			populateClipboard(text) {
				if (navigator.clipboard) return navigator.clipboard.writeText(text) // for modern browsers
				else return new Promise((resolve,reject) => { // legacy for older browsers
					var textArea = document.createElement("textarea")
					textArea.value = text
					
					textArea.style.top = "0"
					textArea.style.left = "0"
					textArea.style.position = "fixed"

					document.body.appendChild(textArea)
					textArea.focus()
					textArea.select()

					try {
						var successful = document.execCommand('copy')
					} catch (err) {
						document.body.removeChild(textArea)
						reject()
					}
					document.body.removeChild(textArea)
					if (successful) resolve()
					else reject()				
				})					
			},
			shareStatus(e) {
				const
					labelCapital = '\u{1F4B5}',
					labelUsers = '\u{1F465}',
					labelCapabilities = '\u{1F527}',
					meterCapital = '\u{1F7E9}',
					meterUsers = '\u{1F7E6}',
					meterCapabilities = '\u{1F7EA}',
					meterBlank = '\u{2B1B}\u{FE0F}',
					meterEmpty = '\u{274C}',
					meterFocus = '\u{1F552}',
					meterFocusBlank = '\u{26AB}\u{FE0F}',
					scoreRank = '\u{1F984}',
					newLine = '\n'

				const
					CurrentState = this.stateHistory[this.stateHistory.length-1],
					ProgressMax = DilemmaCompiler.length - 1,
					ProgressCurrent = Math.max(0,this.chapterHistory.length - 1) // Progress values are manually adjusted for the 1 timeline-hidden chapter - will need to change if we add more hidden

				const
					capital = Math.max(0,Math.min(5,Math.ceil(CurrentState.capital / 20))),
					users = Math.max(0,Math.min(5,Math.ceil(CurrentState.users / 20))),
					capabilities = Math.max(0,Math.min(5,Math.ceil(CurrentState.capabilities / 20))),
					focus = Math.max(0,Math.min(3,CurrentState.focus))

				let ShareText = `STARTUP TRAIL${newLine}`				
				if (this.gameOver) ShareText += `${newLine + this.$refs['gameover-panel'].endingTitle.tag} - ${this.$refs['gameover-panel'].endingTitle.title + newLine}`
				ShareText += `Progress: ${ProgressCurrent.toString()}/${ProgressMax.toString() + newLine}`
				if (ProgressCurrent < 2) ShareText += `${newLine}I'm about to embark on the Startup Trail${newLine.repeat(2)}`
				else if (this.gameOver) ShareText += `Rank: ${scoreRank.repeat(this.$refs['gameover-panel'].endingRank) + newLine.repeat(2)}`
				else ShareText += newLine

				// Capital Meter
				ShareText += labelCapital + ' '
				if (capital <= 0) ShareText += meterEmpty + meterBlank.repeat(4)
				else ShareText += meterCapital.repeat(capital) + meterBlank.repeat(5-capital)
				ShareText += newLine

				// Users Meter
				ShareText += labelUsers + ' '
				if (users <= 0) ShareText += meterEmpty + meterBlank.repeat(4)
				else ShareText += meterUsers.repeat(users) + meterBlank.repeat(5-users)
				ShareText += newLine

				// Capabilities Meter
				ShareText += labelCapabilities + ' '
				if (capabilities <= 0) ShareText += meterEmpty + meterBlank.repeat(4)
				else ShareText += meterCapabilities.repeat(capabilities) + meterBlank.repeat(5-capabilities)
				ShareText += newLine.repeat(2)

				// Focus Clocks
				if (focus > 0) ShareText += meterFocus.repeat(focus) + meterFocusBlank.repeat(3-focus) + newLine.repeat(2)

				// Call To Action
				ShareText += `Play: ${ExternalLinks.GamePlay}`

				this.populateClipboard(ShareText).then(
					() => e.target.dispatchEvent(new Event('share-success')),
					() => e.target.dispatchEvent(new Event('share-fail'))
				)

			}
    }
  }
</script>

<style>

@import url("https://use.typekit.net/yom6whl.css");

/* Colours Etc. */

:root {
	/* Engine Palette: 3 colours in dark/med/light */
	
	--en-1d: rgb(233,29,81);   --en-2d: rgb(232,90,66);   --en-3d: rgb(231,127,37);
	--en-1m: rgb(236,65,102);  --en-2m: rgb(238,117,85);  --en-3m: rgb(240,155,41);
	--en-1l: rgb(240,110,143); --en-2l: rgb(244,157,119); --en-3l: rgb(250,201,63);
	
	/* States */
	
	--bg-capital: rgb(0,176,144) linear-gradient(to bottom, rgba(0,0,0,0) 10%, rgba(0,0,0,.2) 90%);
	--bg-users: rgb(2,152,245) linear-gradient(to bottom, rgba(0,0,0,0) 10%, rgba(0,0,0,.2) 90%);
	--bg-capabilities: rgb(204,122,177) linear-gradient(to bottom, rgba(0,0,0,0) 10%, rgba(0,0,0,.2) 90%);

	--bg-state-zero: rgb(211, 64, 64) linear-gradient(to bottom, rgba(0,0,0,0) 10%, rgba(0,0,0,.2) 90%);

	/* Dark Theme */
	
	--c-base: rgb(30,20,25);   /* main background */
	--c-over: rgb(50,40,45);   /* sidebar background */
	--c-top: rgb(255,255,255); /* master text colour */

	--c-accent-1: rgb(63, 50, 57);
	--c-accent-2: rgb(94,84,93);
	--c-accent-3: rgb(124,112,121);
	--c-accent-4: rgb(154,151,160);
	--c-accent-5: rgb(193, 189, 201);
	--c-accent-6: rgb(219,215,226);

  --sh-overlay: none; /* 5px 5px 10px rgba(0,0,0,.8); /* for overlay wrapper combining multiple elements */

  --sh-menu: 0 2rem 2rem rgba(30,20,25,1);
  --bg-menu: linear-gradient(to right,var(--en-1d) 0,var(--en-2d) 60%);
	
	--sh-sidebar: none; /* defer to overlay wrapper */
	--c-sidebar-text: var(--c-accent-5);
	--bg-sidebar-icon: var(--c-over) linear-gradient(135deg,rgba(255,255,255,1) 10%, rgba(255,255,255,.5) 100%);
	--bg-sidebar-accent: linear-gradient(to right,var(--en-1d) 0,var(--en-2d) 100%);
	--sh-sidebar-accent:
			inset -.2rem .2rem #f99,
			inset -.2rem -.2rem #f99,
			inset 0 .4rem rgba(0,0,0,.2),
			0 .5rem 0 #933,
			0 .75rem 0 rgba(0,0,0,.2),
			0 -1rem 1rem rgba(0,0,0,.15);
	--c-sidebar-accent-border: #f99;
	--sh-sidebar-accent-text:
			0 -2px 0 rgba(0,0,0,.2),
			0 1px 0 rgba(255,255,255,.3);

	--c-content-text: var(--c-accent-6);
	--bo-content-divider: .3rem ridge var(--c-accent-3);
	
	--c-button-light: rgb(242,223,196);
	--bg-button-light-accent: linear-gradient(45deg, var(--en-1m) 0,var(--en-2d) 100%);
	--c-button-light-text: rgb(84,72,57);
	--c-button-light-shadow: rgb(173,143,116);

	--c-button-light-hover: var(--en-2m);
	--c-button-light-hover-text: rgb(70, 60, 47);
	--c-button-light-hover-shadow: rgb(153, 51, 51);

	--bg-button-dark: var(--en-2d);
	--bg-button-dark-accent: linear-gradient(45deg, var(--en-2l) 0,var(--en-2m) 100%);
	--c-button-dark-text: rgba(255,255,255,.8);
	--c-button-dark-shadow: rgb(153, 51, 51);
	
	--bg-button-dark-hover: var(--en-2m);
	--c-button-dark-hover-text: var(--c-button-dark-text);
	--c-button-dark-hover-shadow: var(--en-2d);

	--bg-button-disabled: rgb(90,90,90);
	--bg-button-disabled-accent: rgba(0,0,0,.6);
	--c-button-disabled-text: rgba(0,0,0,.3);
	--c-button-disabled-shadow: rgb(50,50,50);

	--bg-button-menu: var(--c-accent-2);
	--bg-button-menu-accent: rgba(255,255,255,.25);
	--c-button-menu-shadow: rgba(255,255,255,.1);

	--bg-button-menu-hover: var(--c-accent-3);
	--bg-button-menu-hover-accent: rgba(255,255,255,.25);
	--c-button-menu-hover-shadow: rgba(255,255,255,.2);

	--bg-button-share: rgb(1,134,110);
	--c-button-share-shadow: rgb(0, 100, 82);

	--bg-results-up: linear-gradient(to bottom,rgb(120,120,120) 20%,rgb(170,170,170) 40%,rgb(170,170,170) 60%,rgb(120,120,120) 80%);
	--bg-results-down: linear-gradient(to bottom,rgb(120,120,120) 20%,rgb(170,170,170) 40%,rgb(170,170,170) 60%,rgb(120,120,120) 80%);
	--bg-results-zero: rgb(120,120,120);
	
	--bg-timeline: var(--c-accent-1);
	--c-timeline: var(--c-accent-4);
	--bg-tl-chapter: var(--c-accent-3);
	--bg-tl-chapter-past: var(--en-3l);
	--bg-tl-chapter-current: var(--en-3d);
	--bg-tl-spacer: transparent;

	--sh-timeline:
			inset -.2rem .2rem var(--c-accent-2),
			inset -.2rem -.2rem var(--c-accent-2),
			inset .2rem -.2rem var(--c-accent-2),
			inset .2rem .2rem var(--c-accent-2),
			inset 0 .4rem rgba(0,0,0,.2),
			0 .4rem 0 rgba(255,255,255,.07);
	--sh-timeline-text:
			0 -2px 0 rgba(0,0,0,.25),
			0 1px 0 rgba(255,255,255,.2);
	
	/* Tooltips */
	
	--c-tooltip: white;
	--c-tooltip-text: #444;
	--sh-tooltip: 0px 0px 4px rgba(0,0,0,70%);
	
	--bg-tooltip-lock: rgb(237,157,157);
	--bg-tooltip-unlock: rgb(132,206,120);
	--bg-tooltip-focus: rgb(154,178,232);

	--bg-message-success: rgb(132,206,120);
	--bg-message-fail: rgb(237,157,157);

	/* Issue Notes */

	--c-issue-border: var(--en-3l);
	
	/* Meters */
	
	--c-meter-bg: rgba(0,0,0,0.1);
	--c-meter-border: rgba(255,255,255,.3);
	--sh-meter-shine: 0 .1rem 0 rgba(255,255,255,.15);	
	--sh-meter-highlight: 0 0 4px rgba(237,157,157,.75);
	
	/* Activity List */
	
	--bg-activity-default: linear-gradient(to bottom,rgb(91,80,87) 5%, rgb(71,60,67) 95%);
	--c-activity-default-text: inherit;
	--bg-activity-default-icon: var(--bg-sidebar-icon);	
}

	/* Activity List Custom Item Styles */
	
	div.activity-flag.focus::before {
		mask-image: url("/assets/icons/icon-focus.svg");
	}

/* General Settings */

*:not(a) { cursor: default; } /* Prevent text selection cursor for more gamelike feel */
a * { cursor: pointer; }

html { font-size: calc(6px + 0.5vw);}
body { 
	font-family: aglet-slab, serif;
	font-size: 1.5em; 
	font-weight: 400;
	padding: 0;
	margin: 0;
}

a,a:link,a:visited,a:active {
	text-decoration: none;
	color: var(--en-3m);
}

a:hover {
	color: var(--en-3l);
}

h1,h2,h3,h4 {
	margin: 1.25em 0 .75em;
	padding: 0;
	line-height: 1.2;
}

h1:first-child,h2:first-child,h3:first-child,h4:first-child {
	margin-top: 0;
}

p { margin-bottom: 1em; }

/* Master Layout */

div#app {
	position: absolute; top: 0;  left: 0; right: 0; bottom: 0;
}

div#game {
	position: relative;
	overflow: auto;
	width: 100%;
	height: 100%;
	min-width: 1024px;
	
	background-color: var(--c-base);
	color: var(--c-top);
}

div.overlay-wrapper {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  z-index: 100;
  filter: drop-shadow(var(--sh-overlay));
  pointer-events: none;
  overflow: hidden;
}

div.overlay-wrapper * { pointer-events: auto; }

div#menu-panel {
  position: fixed; top: 0; left: calc(200px + 19% - 1.5rem); right: 3.5rem;
  z-index: 60;

  height: 5rem;
  box-sizing: border-box;

	border-bottom-right-radius: .7rem;
	border-bottom-left-radius: .7rem;

	background-color: var(--c-over);
	box-shadow: var(--sh-menu);
}

div#sidebar-panel {
	position: absolute; top: 0; left: 0;
  z-index: 40;
	
	display: flex;
	flex-direction: column;
	
	width: calc(200px + 15%);
	min-height: calc(100%);
	
	box-sizing: border-box;
	padding: 1.5em 2em 0;
	
	background-color: var(--c-over);
	filter: drop-shadow(var(--sh-sidebar));
	
}

div#content-panel {
	position: fixed; top: 5rem; right: 0; bottom: 0;
	left: calc(200px + 19%);
  z-index: 30;
	
	box-sizing: border-box;
	overflow-y: scroll;
	padding: 1.5em 4rem 1.5em 0;

  transition: opacity .5s ease-out;
}

div#content-panel.fade-active {
  opacity: .1;
  transition: opacity .5s ease-out;
}

/* Sidebar Master Styles */

#sidebar-panel h2 {
	font-size: 1.5em;
	color: var(--c-sidebar-text);
}

#sidebar-panel h3 {
	font-size: 1em;
	font-weight: 800;
	text-transform: uppercase;
	padding: calc(.25em + .05rem) 2em calc(.25em - .05rem);
	margin: 1.25em calc(-2em - .8rem) calc(1.25em + .5rem) -2em;
	border-top-right-radius: .7rem;
	border-bottom-right-radius: .7rem;
	/*border: .3rem solid var(--c-sidebar-accent-border);
	border-left: none;*/
	background: var(--bg-sidebar-accent);
	box-shadow: var(--sh-sidebar-accent);
	text-shadow: var(--sh-sidebar-accent-text);
}

#sidebar-panel ul {
	list-style: none;
	margin: 0; padding: 0;
}

#sidebar-panel ul#company-info li {
	font-size: .95em;
	margin-bottom: .4em;
	line-height: 1;
}

#sidebar-panel ul#company-info li strong {
	color: var(--c-sidebar-text);
	text-transform: uppercase;
}

/* State Meter Layout */

div#game-state-meters > div {
	display: flex;
	align-items: stretch;
	column-gap: 4%;
	box-sizing: border-box;
	width: 100%;
	margin-bottom: .75em;	
}

div#game-state-meters > div:last-child {
	margin-bottom: 0;
}

div#game-state-meters > div.highlight {
	filter: drop-shadow(var(--sh-meter-highlight));
}

/* State Meter Icons */

div.icon-meter {
	display: inline-block;
	width: 12%;
}

div.icon-meter::before {
	content: url("/assets/icons/icon-sizer.svg");
	display: block;
	line-height: 0;
	background: var(--bg-sidebar-icon);
	mask-repeat: no-repeat;
}

div.icon-capital::before { mask-image: url("/assets/icons/icon-capital.svg"); }
div.icon-users::before { mask-image: url("/assets/icons/icon-users.svg"); }
div.icon-capabilities::before { mask-image: url("/assets/icons/icon-capabilities.svg"); }


/* Focus Clocks */

div#game-state-focus {
	display: flex;
	column-gap: 8%;
	align-items: stretch;
}

div#game-state-focus > div {
	flex: 1;
	position: relative;
}

div#game-state-focus > div::before {
	position: relative;
	content: url("/assets/icons/icon-sizer.svg");
	display: block;
	line-height: 0;
	background: var(--bg-sidebar-icon);
	mask-image: url("/assets/icons/icon-focus.svg");
	mask-repeat: no-repeat;
	opacity: 1;
	transition: opacity .7s ease-out;
}

div#game-state-focus > div::after {
	content: '';
	position: absolute; top: 0; left: 0;
	width: 100%; height: 100%;
	box-sizing: border-box;
	border-radius: 50%;
	border: 4px dotted var(--c-top);
	opacity: 0;
	transition: opacity .25s ease-out;
	transition-delay: .25s;
}

@keyframes wobble {
  0% { transform: none }
  15% { transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg) }
  30% { transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg) }
  45% { transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg) }
  60% { transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg) }
  75% { transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg) }
  100% { transform: none }
}

div#game-state-focus > div.used::before { animation: wobble .7s linear 1; opacity: 0; }
div#game-state-focus > div.used::after { opacity: .25; }

@keyframes steady-wobble {
  0% { transform: none }
  25% { transform: translate3d(-3%, 0, 0) }
  75% { transform: translate3d(3%, 0, 0) }
  100% { transform: none }
}

div#game-state-focus > div.highlight::before {
	animation: steady-wobble .4s linear infinite;
}

/* Activity List */

#game-state-flags {
	flex-grow: 1;
	max-width: 100%;
}

div.activity-flag {
	display: flex;
	background: var(--bg-activity-default);
	color: var(--bg-activity-text);
	line-height: 1;
	padding: .5em;
	margin-bottom: .5em;
	border-radius: .9em;
	font-weight: 500;
}

div.activity-flag > span.text {
	display: block;
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	mask-image: linear-gradient(to right,rgba(255,255,255,1) 93%,rgba(255,255,255,0) 98%);
}

div.activity-flag::before {
	flex-shrink:0;
	content: url("/assets/icons/icon-sizer.svg");
	line-height: 0;
	background: var(--bg-activity-default-icon);
	margin-right: .5em;
	mask-image: url("/assets/icons/icon-circle.svg");
	mask-repeat: no-repeat;
	width: 1em;
}

@keyframes ani-activity-highlight {
	0% { background-position: 0 0; }
	100% { background-position: 0 2em; }
}

div.activity-flag > span.ani {
	display: none;
	position: absolute; top: 0; right: 0; bottom: 0; left: 0;
	background-image: 
		linear-gradient(
		-45deg, 
		rgba(0, 0, 0, .1) 25%, 
		transparent 25%, 
		transparent 50%, 
		rgba(0, 0, 0, .1) 50%, 
		rgba(0, 0, 0, .1) 75%, 
		transparent 75%, 
		transparent
	);
	z-index: 1;
	background-size: 2em 2em;
	background-repeat: repeat;
	animation: ani-activity-highlight .5s linear infinite reverse;
}

div.activity-flag.highlight > span.ani {
	display: block;
}

/* Main Panel */

div#content-panel { font-size: 1.3em; }

div#content-panel h2 {
	font-size: 1.4em;
	font-weight: 800;
	padding-bottom: .5em;
	border-bottom: var(--bo-content-divider);
}

div#content-panel h2 strong {
	color: var(--en-2l)
}

div#content-panel p {
	font-size: 1.1em;
	line-height: 1.5;
	color: var(--c-content-text);
	white-space:pre-line;
}

div#content-panel p.dilemma-note {
	font-weight: 500;
}

/* Choices & General Button Styles */

button {
	-webkit-appearance: button;
	text-transform: none;
	font-size: inherit;

	display: flex;
	align-items: center;
	column-gap: 1em;
	
	background-color: var(--c-button-light);
	box-shadow: 0 .2rem 0 var(--c-button-light-shadow);
	border: 0;
	border-radius: .3em;
	width: 100%;
	overflow: hidden;
	
	position: relative;
	padding: .5em .7em;
	margin-bottom: .5em;
	cursor: pointer;
	line-height: 1.4;
	text-align: left;
	font-family: aglet-slab, serif;
	font-weight: 500;
	color: var(--c-button-light-text);
	
	transition:
		background-color .2s ease-out,
		box-shadow .2s ease-out,
		color .2s ease-out,
		transform .2s ease-out;
}

button * { cursor: pointer; }

button::before {
	order: 1;
	flex-shrink:0;
	content: url("/assets/icons/icon-sizer.svg");
	line-height: 0;
	background: var(--bg-button-light-accent);
	mask-image: url("/assets/icons/icon-triangle.svg");
	mask-repeat: no-repeat;
	width: 1em;
}

button.unlock::before {
	mask-image: url("/assets/icons/icon-lock-open.svg");
}

button > span {
	order: 2;
	flex-shrink:1;
	width: 100%;
}

button:hover {
	background-color: var(--c-button-light-hover);
	box-shadow: 0 .2rem 0 var(--c-button-light-hover-shadow);
	color: var(--c-button-light-hover-text);
}

button:active {
	transform: translateY(.1rem);
	background-color: var(--c-button-light-hover);
	color: var(--c-button-light-hover-text);
	box-shadow: 0 .1rem 0 var(--c-button-light-hover-shadow);
	transition:
		background-color .2s ease-out,
		box-shadow 0s,
		color .2s ease-out,
		transform 0s;
}

button.dark { 
	background: var(--bg-button-dark);
	color: var(--c-button-dark-text);
	box-shadow: 0 .2rem 0 var(--c-button-dark-shadow);
}

button.dark:hover {
	background: var(--bg-button-dark-hover);
	color: var(--c-button-dark-hover-text);
	box-shadow: 0 .2rem 0 var(--c-button-dark-hover-shadow);
}

button.dark:active {
	background-color: var(--c-button-dark-hover);
	color: var(--c-button-dark-hover-text);
	box-shadow: 0 .1rem 0 var(--c-button-dark-hover-shadow);
}

button.dark::before { background: var(--bg-button-dark-accent); }
button.dark:hover { background: var(--bg-button-dark-hover); } 

button[disabled],button[disabled]:hover,button[disabled]:active { 
	cursor: not-allowed;
	transform: none;
	background: var(--bg-button-disabled);
	color: var(--c-button-disabled-text);
	box-shadow: 0 .2rem 0 var(--c-button-disabled-shadow);
}

button[disabled]:hover {
	cursor: not-allowed;
	background: var(--bg-button-disabled);
	color: var(--c-button-disabled-text);
	box-shadow:  0 .2rem 0 var(--c-button-disabled-shadow);
}

button[disabled] * { cursor: not-allowed; }

button[disabled]::before {
	background: var(--bg-button-disabled-accent);
	mask-image: url("/assets/icons/icon-lock.svg");
}

div.dilemma-option button ul {
	order: 3;
	margin: 0;
	padding: 0;
	
	display: flex;
	align-items: stretch;
	column-gap: .2em;
	
	list-style: none;
}

div.dilemma-option button ul li {
	width: 1em;
	margin-left: .1em;
}

div.dilemma-option button ul li.satisfied {
	opacity: .4;
}

div.dilemma-option button ul li::before {
	content: url("/assets/icons/icon-sizer.svg");
	display: block;
	line-height: 0;
	background: var(--bg-button-light-accent);
	mask-repeat: no-repeat;
}

div.dilemma-option button[disabled] ul li::before {
	background: var(--bg-button-disabled-accent);
}

div.dilemma-option button ul li.capital::before { mask-image: url("/assets/icons/icon-capital.svg"); }
div.dilemma-option button ul li.users::before { mask-image: url("/assets/icons/icon-users.svg"); }
div.dilemma-option button ul li.capabilities::before { mask-image: url("/assets/icons/icon-capabilities.svg"); }
div.dilemma-option button ul li.focus::before { mask-image: url("/assets/icons/icon-focus-small.svg"); }

/* Results */

ul#consequences-status {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	column-gap: 10%;
	list-style: none;
	margin: 0 0 1.5em 0;
	padding: 1.5em 1.5em;
	border-top: var(--bo-content-divider);
	border-bottom: var(--bo-content-divider);
	border-bottom-style: groove;
}

ul#consequences-status li.state {
	margin: 0;
	width: 17%;
	display: flex;
	align-items: stretch;
	flex-shrink: 1;
	line-height: 0;
	opacity: .25;
	filter: grayscale(1) brightness(10);
}

ul#consequences-status li.state::before {
	content: url("/assets/icons/icon-sizer.svg");
	display: block;
	width: 55%;
	margin-right: 10%;
	line-height: 0;
	background: white;	
	mask-repeat: no-repeat;
}

ul#consequences-status li.state::after {
	flex-grow: 1;
	content: url("/assets/icons/icon-sizer.svg");
	display: block;
	margin: 10% 0;
	line-height: 0;
	background: white;
	
	mask-image: url("/assets/icons/icon-bar.svg");
	mask-repeat: no-repeat;
}

@keyframes ani-pulse {
	0% {
		filter: brightness(100%);
	}
	20% { 
		filter: brightness(100%);
	}
	50% { 
		filter: brightness(130%);
	}
	80% {
		filter: brightness(100%);
	}
	100% {
		filter: brightness(100%);
	}
}

ul#consequences-status li.focus,
ul#consequences-status li.dilution {
	width: 100%;
	font-size: .8em;
	margin-top: 3em;
	text-align: center;
	font-style: italic;
}

ul#consequences-status li.focus:first-child {
	margin-top: 0;
}

ul#consequences-status li.capital::before {
	background: var(--bg-capital);
	mask-image: url("/assets/icons/icon-capital.svg");
}

ul#consequences-status li.users::before {
	background: var(--bg-users);
	mask-image: url("/assets/icons/icon-users.svg");
}

ul#consequences-status li.capabilities::before {
	background: var(--bg-capabilities);
	mask-image: url("/assets/icons/icon-capabilities.svg");
}

ul#consequences-status:not(.game-over) li.increase,ul#consequences-status:not(.game-over) li.decrease,
ul#consequences-status.game-over li.zero { opacity: 1; filter:none; }

ul#consequences-status.game-over li.zero::before {
	background: var(--bg-state-zero);
}

ul#consequences-status li.increase::before,ul#consequences-status li.decrease::before {
	animation: ani-pulse 2s ease-in-out infinite;
}

@keyframes ani-status-result {
	0% { background-position: 0 -100%; }
	100% { background-position: 0 100%; }
}

ul#consequences-status li.increase::after {
	background: var(--bg-results-up);
	background-size: 100% 200%;
	mask-image: url("/assets/icons/icon-arrow.svg");
	
	animation: ani-status-result 1s linear infinite;
}

ul#consequences-status li.decrease::after {
	background: var(--bg-results-down);
	background-size: 100% 200%;
	mask-image: url("/assets/icons/icon-arrow-down.svg");
	
	animation: ani-status-result 1s linear infinite reverse;
}

ul#consequences-status.game-over li.zero::after {
	background: var(--bg-results-zero);
	animation: none;
	mask-image: url("/assets/icons/icon-x.svg");
}

/* Game Over Scoring Section */

ul#consequences-status li.game-over-summary {
	width: 94%;
} 

ul#consequences-status li.state+li.game-over-summary {
	margin-top: 1.5em;
}

div.ending-summary, div.score-total {
	text-align: center;
}

div.ending-summary {
	margin-bottom: 1em;
}

div.ending-score {
	display: flex;
	column-gap: 6%;
}

div.ending-score > div {
	flex-grow: 1;
	width: 47%;
}

div.ending-score > div span {
	font-weight: bold;
	margin-right: .25em;
}

div.score-rank {
	display: flex;
	column-gap: .25em;
	margin: .6em 0;
}

div.score-rank > img {
	flex-grow: 1;
	transform: translateX(-15%);
}

div.score-factors > div {
	margin-bottom: .5em;
}

button#share-ending {
	position: relative;
	width: 50%;
	margin: 1em auto 0;
	color: rgba(255,255,255,.8);
	background: var(--bg-button-share);
  box-shadow: 0 .2rem 0 var(--c-button-share-shadow);
}

button#share-ending::before {
	background: var(--bg-button-menu-accent);
	mask-image: url("/assets/icons/icon-share.svg");
}

button#share-ending::after {
	content: 'Share Your Score';
	order: 2;
}

button#share-ending.msg-success::after {
  content: "Score copied to clipboard!";
}

button#share-ending.msg-fail::after {
  content: "Oops! Something went wrong.";
}
*/

/* Result Navigation */

/*button#nav-continue:hover {  }*/
button#nav-continue { color: var(--en-2d);}
button#nav-back, button#nav-restart { display: inline-flex; width: 20%; filter:grayscale(1); margin-right: 1em;}
button#nav-back::before { transform: rotate(180deg); }
button#nav-restart::before { mask-image: url("/assets/icons/icon-restart.svg")}

/* Special Navigation */

button#skip-tutorial, button#founder-change { filter:grayscale(1); }
button#start-tutorial::before {	mask-image: url("/assets/icons/icon-question.svg"); }
button#founder-cancel::before { transform: rotate(180deg); }

/* Tooltips */

.tt-container, .tt-paused {
	position: relative;
	overflow: visible;
}

div.tt-positioner {
	position: absolute;
	z-index: 1000;
	overflow: visible;
	display: flex;
	
	visibility: hidden;
	opacity: 0;
}

.tt-container:hover div.tt-positioner {
	visibility: visible;
	opacity: 1;
}

div.tt-positioner.tt-option {
	bottom: calc(100% + .25em);
	left: max(25%, calc(50% - 360px));
	width: min(50%, 720px);
	
	flex-direction: row;
	justify-content: center;
	
	filter: drop-shadow(var(--sh-tooltip));
}

div.tt-positioner.tt-sidebar {
	left: 110%;
	top: 0;
	height: 100%;
	width: min(100%, 450px);
	flex-direction: column;
	justify-content: center;
	
	filter: drop-shadow(var(--sh-tooltip));
}

h3 div.tt-positioner.tt-sidebar {
  left: calc((100% - 2.75em)*1.1);
  top: 2em;
}

div.tt-frame {
  position: relative;
	padding: .6em 1em .9em;
	background-color: var(--c-tooltip);
	color: var(--c-tooltip-text);
	border-radius: 1em;
	font-family: acumin-pro-condensed, sans-serif;
	font-size: 1.4rem;
	line-height: 1.25;
  font-weight: normal;
  text-transform: none;
	text-shadow: none;
}

div.tt-option div.tt-frame {
	padding: 0;
	border: .5em solid;
	border-color: var(--c-tooltip);
}

div.tt-option div.tt-frame::after {
	content: " ";
	position: absolute;
	top: calc(100% + .45em);
	left: 50%;
	margin-left: -.75em;
	border-width: .75em;
	border-style: solid;
	border-color: transparent;
	border-top-color: var(--c-tooltip);
}

div.tt-sidebar div.tt-frame::after {
	content: " ";
	position: absolute;
	top: 50%;
	right: 100%;
	margin-top: -.5em;
	border-width: .5em;
	border-style: solid;
	border-color: transparent;
	border-right-color: var(--c-tooltip);
}

div.tt-frame p { margin: 0 0 1em 0; }
div.tt-frame p:last-of-type { margin-bottom: 0; }

/* Tutorial Forced Tooltips */

.tt-frame button {
  position: absolute; right: 0; top: calc(100% + .5em);
  column-gap: .5em;
  width: auto;
  display: none;
}

.tt-force .tt-frame button {
  display: inline-flex;
}

.tt-force {
  position: relative;
	overflow: visible;
}

.tt-force div.tt-positioner {
  visibility: visible;
	opacity: 1;
  transition: opacity .5s ease-out;
}

/* Option Detail Tooltips */

ul.option-details {
	margin: 0;
	padding: 0;
	list-style: none;
}

ul.option-details li {
	padding: .75em 1em;
}

ul.option-details li::first-letter {
	text-transform: uppercase;
}

ul.option-details li:first-child {
	border-top-left-radius: .5em;
	border-top-right-radius: .5em;
}

ul.option-details li:last-child {
	margin-bottom: 0;
	border-bottom-left-radius: .5em;
	border-bottom-right-radius: .5em;
}

ul.option-details li.lock {
	list-style: none;
	font-weight: 600;
	background: var(--bg-tooltip-lock);
}

ul.option-details li.lock strong {
	font-weight: 700;
}

ul.option-details li.lock-list {
	list-style: square inside;
	background: var(--bg-tooltip-lock);
}

ul.option-details li.unlock {
	list-style: none;
	font-weight: 600;
	background: var(--bg-tooltip-unlock);
}

ul.option-details li.unlock-list {
	list-style: square inside;
	background: var(--bg-tooltip-unlock);
}

ul.option-details li.lock+li.lock-list,ul.option-details li.lock-list+li.lock-list,
ul.option-details li.unlock+li.unlock-list,ul.option-details li.unlock-list+li.unlock-list {
	padding-top: 0;
}

ul.option-details li.focus {
	background: var(--bg-tooltip-focus);
	font-style: italic;
}

ul.option-details li.note {
	list-style: none;
}

/* Inline Icons */

.ii { 
	font-style: normal; 
	margin-left: 0;
	color: currentColor;
	white-space: nowrap;
}
.ii::before {
	content: url("/assets/icons/icon-sizer.svg");
	position: relative;
	display: inline-block;
	line-height: 1;
	vertical-align: middle;
	width: 1em;
	margin-right: .2em;
	background-color: currentColor;
	mask-repeat: no-repeat;
}

a.external::after {
	content: url("/assets/icons/icon-sizer.svg");
	position: relative;
	top: -0.1em;
	display: inline-block;
	line-height: 1;
	vertical-align: middle;
	width: 1em;
	margin-left: .2em;
	background-color: currentColor;
	mask-repeat: no-repeat;
	mask-image: url("/assets/icons/icon-link.svg");
}

.ii.capital::before { mask-image: url("/assets/icons/icon-capital.svg"); }
.ii.users::before { mask-image: url("/assets/icons/icon-users.svg"); }
.ii.capabilities::before { mask-image: url("/assets/icons/icon-capabilities.svg"); }
.ii.focus::before { mask-image: url("/assets/icons/icon-focus-small.svg"); }
.ii.lock::before { mask-image: url("/assets/icons/icon-lock.svg"); top: -0.1em; }
.ii.unlock::before { mask-image: url("/assets/icons/icon-lock-open.svg"); }
.ii.circle::before { mask-image: url("/assets/icons/icon-circle.svg"); }
.ii.arrow::before { mask-image: url("/assets/icons/icon-triangle.svg"); }

/* Vue Transitions */

.title-screen-enter-active { transition: opacity 2s, filter 3s; transition-delay: 0; }
.title-screen-leave-active { transition: opacity 1.5s, filter 1.5s ease-in; }
.title-screen-enter {
  opacity: 0;
  filter: blur(0) grayscale(1);
}
.title-screen-leave-to {
  opacity: 0;
  filter: blur(2em) grayscale(1);
}

.menu-bar-enter-active { transition: transform .5s ease-out; transition-delay: .5s }
.menu-bar-leave-active { transition: transform .5s ease-out; }
.menu-bar-enter, .menu-bar-leave-to {
  transform: translateY(-100%);
}

.side-bar-enter-active { transition: transform .5s ease-out; transition-delay: .8s }
.side-bar-leave-active { transition: transform 1s ease-out; }
.side-bar-enter, .side-bar-leave-to {
  transform: translateX(-110%);
}

#content-panel.content-main-enter-active { transition: opacity 1.75s ease-out; transition-delay: 1.3s }
.content-main-leave-active { transition: opacity .5s ease-out; }
.content-main-enter, .content-main-leave-to {
  opacity: 0;
}

#content-panel.game-over-enter-active { transition: opacity 1s ease-out; transition-delay: .75s }
.game-over-leave-active { transition: opacity .5s ease-out; }
.game-over-enter, .game-over-leave-to {
  opacity: 0;
}

div#unsupported-device {
	display: none;
}

@media (max-width: 1023px) {
	div#unsupported-device {
		position: fixed; top: 0; right: 0; bottom: 0; left: 0;
		
		display: flex !important;
		justify-content: center;
		align-items: center;
		color: white;
		background: var(--c-base);
	}

	div#game {
		display: none !important;
	}
}

</style>
