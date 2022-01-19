<template>
  <div id="game">
    <app-state-sidebar
	:currentState="stateHistory[this.stateHistory.length-1]"
	:chosenOption="optionHistory[this.optionHistory.length-1]"
    ></app-state-sidebar>
    <app-dilemma
      :currentState="stateHistory[this.stateHistory.length-1]"
      :currentChapterInfo="currentChapterInfo"
      :chosenOption="optionHistory[this.optionHistory.length-1]"
      @choose-option="chooseOption($event)"
      @next-prompt="nextPrompt()"
      @undo-state-change="undoStateChange()"
      @update-state="updateState($event)"
			v-if="!gameOver"
    ></app-dilemma>
		<app-game-over
      :currentState="stateHistory[this.stateHistory.length-1]"
      :currentChapterInfo="currentChapterInfo"
      :chosenOption="optionHistory[this.optionHistory.length-1]"
			v-if="gameOver"
      @undo-state-change="undoStateChange()"
    ></app-game-over>
		<app-chapter-control-panel
      :chapterHistory="chapterHistory"
			:currentStateString="JSON.stringify(stateHistory[this.stateHistory.length-1], null, 5)"
			@go-to-chapter="goToChapter($event)"
      @restart-game="restartGame()"
      @undo-state-change="undoStateChange()"
			@update-state="updateState($event)"
    ></app-chapter-control-panel>
    <!--<div>
      Current Gamestate: {{stateHistory[this.stateHistory.length-1]}}
    </div>-->
  </div>
</template>

<script>
  import StateSidebar from './StateSidebar.vue'
  import Dilemma from './Dilemma.vue'
  import DilemmaCompiler from './DilemmaCompiler.js'
  import ChapterControlPanel from './ChapterControlPanel.vue'
	import GameOver from './GameOver.vue'

  export default {
    name: 'game',
    components: {
      'app-state-sidebar': StateSidebar,
      'app-dilemma': Dilemma,
      'app-chapter-control-panel': ChapterControlPanel,
			'app-game-over': GameOver,
    },
    data () {
      return {
        initialState: [{
          capital: 40,
          users: 45,
          capabilities: 15,
          focus: 3,
          pastEvents: ["Second example event", "First example event"]
        }],
        stateHistory: [],
        chapterHistory: [],
        currentChapterInfo: {},
        optionHistory: [null],
      }
    },
		computed: {
			gameOver: function(){
				let showGameOverScreen = false;
				if (this.optionHistory[this.optionHistory.length-1] && this.stateHistory[this.stateHistory.length-1]){
					if (this.optionHistory[this.optionHistory.length-1].gameOver){ // test for game over from dilemma
						showGameOverScreen = true;
					} else { // test if game over from resources
						let capital = this.stateHistory[this.stateHistory.length-1].capital
						let users = this.stateHistory[this.stateHistory.length-1].users
						let capabilities  = this.stateHistory[this.stateHistory.length-1].capabilities
						if (this.stateHistory.length && !(capital && users && capabilities)){
							// showGameOverScreen = true // TODO uncomment this after balancing game
						}
					}
				}
				return showGameOverScreen; 
			}
		},
    mounted () {      
      this.stateHistory = localStorage.stateHistory ? JSON.parse(localStorage.stateHistory) : JSON.parse(JSON.stringify(this.initialState))
      this.chapterHistory = localStorage.chapterHistory ? JSON.parse(localStorage.currentChapterInfo) : [DilemmaCompiler[0]()]
      this.currentChapterInfo = localStorage.currentChapterInfo ? JSON.parse(localStorage.currentChapterInfo) : DilemmaCompiler[0]()
      this.optionHistory = localStorage.optionHistory ? JSON.parse(localStorage.optionHistory) : []
    },
    watch: {
      stateHistory(newHistory){ localStorage.stateHistory = JSON.stringify(newHistory)},
      chapterHistory(newData){ localStorage.currentChapterInfo = JSON.stringify(newData)},
      currentChapterInfo(newData){ localStorage.currentChapterInfo = JSON.stringify(newData)},
      optionHistory(newData){ localStorage.optionHistory = JSON.stringify(newData)},
    },
    methods: {
      chooseOption(option, skipping = false){
        this.optionHistory.push(option)
				if (this.currentChapterInfo.specialChapterType == 'singleScreen' && !skipping){
					this.nextPrompt();
				}
      },
			goToChapter(targetChapter){
				console.log('going to', targetChapter)
				let newDilemma = DilemmaCompiler[targetChapter](this.stateHistory[this.stateHistory.length-1])
        this.chapterHistory.push(newDilemma)
        this.optionHistory.push(null)
        this.stateHistory.push(JSON.parse(JSON.stringify(this.stateHistory[this.stateHistory.length-1])))
        this.currentChapterInfo = newDilemma
			},
      nextPrompt(){
        // console.log('ch length', this.chapterHistory.length)
        let newDilemma = DilemmaCompiler[this.chapterHistory.length](this.stateHistory[this.stateHistory.length-1])
        this.chapterHistory.push(newDilemma)
        this.optionHistory.push(null)
        this.stateHistory.push(JSON.parse(JSON.stringify(this.stateHistory[this.stateHistory.length-1])))
        this.currentChapterInfo = newDilemma

				// check for single screen with state change
				if (newDilemma.specialChapterType == 'singleScreen'){
					if (Object.keys(newDilemma.dilemmaOptions[0].stateChange).length > 3 || newDilemma.dilemmaOptions[0].stateChange.capital || newDilemma.dilemmaOptions[0].stateChange.users || newDilemma.dilemmaOptions[0].stateChange.capabilities){
						console.log('skipping')
						this.chooseOption(newDilemma.dilemmaOptions[0], 'skipping')
					}
				}
      },
      restartGame(){
        console.log('restarting')
        this.stateHistory = JSON.parse(JSON.stringify(this.initialState))
        this.chapterHistory = [DilemmaCompiler[0]()]
        this.currentChapterInfo = DilemmaCompiler[0]()
        this.optionHistory = [null]
      },
      undoStateChange(){
        if(this.optionHistory.length > 1){
          this.stateHistory.pop()
          this.optionHistory.pop()
          if (this.optionHistory[this.optionHistory.length-1] != null) {
            this.chapterHistory.pop()
            this.currentChapterInfo = DilemmaCompiler[this.chapterHistory.length-1](this.stateHistory[this.stateHistory.length-1])
            console.log('new dilemma', this.currentChapterInfo.dilemmaPrompt)
          } 
          console.log('undoing')
        }
      },
      updateState(newState){
        this.stateHistory.push(newState)
      },
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
	
	--bg-capital: rgb(89,178,94) linear-gradient(to bottom, rgba(0,0,0,0) 10%, rgba(0,0,0,.2) 90%);
	--bg-users: rgb(55,99,196) linear-gradient(to bottom, rgba(0,0,0,0) 10%, rgba(0,0,0,.2) 90%);
	--bg-capabilities: rgb(153,95,214) linear-gradient(to bottom, rgba(0,0,0,0) 10%, rgba(0,0,0,.2) 90%);

	/* Dark Theme */
	
	--c-base: rgb(30,20,25);   /* main background */
	--c-over: rgb(50,40,45);   /* sidebar background */
	--c-top: rgb(255,255,255); /* master text colour */
	
	--sh-sidebar: 5px 0 10px rgba(0,0,0,.8);
	--bg-sidebar-icon: var(--c-over) linear-gradient(135deg,rgba(255,255,255,1) 10%, rgba(255,255,255,.5) 100%);
	--bg-sidebar-accent: linear-gradient(to right,var(--en-1d) 0,var(--en-2d) 100%);
	
	--bg-button-light: var(--c-top);
	--bg-button-light-hover: var(--en-2m);
	--bg-button-light-accent: linear-gradient(45deg, var(--en-1m) 0,var(--en-2d) 100%);
	--c-button-light-text: rgba(0,0,0,.8);

	--bg-button-dark: var(--en-2d);
	--bg-button-dark-hover: var(--en-2m);
	--bg-button-dark-accent: linear-gradient(45deg, var(--en-2l) 0,var(--en-2m) 100%);
	--c-button-dark-text: rgba(255,255,255,.8);
	
	--bg-button-disabled: rgb(90,90,90);
	--bg-button-disabled-accent: rgba(0,0,0,.6);
	--c-button-disabled-text: rgba(0,0,0,.3);
	
	--bg-results-up: linear-gradient(to bottom,rgb(120,120,120) 20%,rgb(170,170,170) 40%,rgb(170,170,170) 60%,rgb(120,120,120) 80%);
	--bg-results-down: linear-gradient(to bottom,rgb(120,120,120) 20%,rgb(170,170,170) 40%,rgb(170,170,170) 60%,rgb(120,120,120) 80%);
	
	/* Tooltips */
	
	--c-tooltip: white;
	--c-tooltip-text: #444;
	--sh-tooltip: 0px 0px 4px rgba(0,0,0,70%);
	
	--bg-tooltip-lock: rgb(237,157,157);
	--bg-tooltip-unlock: rgb(132,206,120);
	--bg-tooltip-focus: rgb(154,178,232);
	
	/* Meters */
	
	--c-meter-bg: var(--c-over);
	--c-meter-border: rgb(200,200,200);
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

* { cursor: default; } /* Prevent text selection cursor for more gamelike feel */
html { font-size: calc(6px + 0.5vw);}
body { 
	font-family: aglet-slab, serif;
	font-size: 1.5em; 
	font-weight: 400;
	padding: 0;
	margin: 0;
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

div#game-state-sidebar {
	position: absolute; top: 0; left: 0;
	
	display: flex;
	flex-direction: column;
	
	width: calc(200px + 15%);
	min-height: 100%;
	
	box-sizing: border-box;
	padding: 2em;
	
	background-color: var(--c-over);
	filter: drop-shadow(var(--sh-sidebar));
	
	z-index: 1000;
}

div#game-dilemma {
	position: absolute; top: 0; right: 0;
	left: calc(200px + 19%);
	
	min-height: 100%;
	
	box-sizing: border-box;
	overflow: auto;
	padding-top: 2em;
	padding-right: 4%;
}

/* Sidebar Master Styles */

#game-state-sidebar h2 {
	font-size: 1.5em;
	
}

#game-state-sidebar h3 {
	font-size: 1em;
	font-weight: 800;
	text-transform: uppercase;
	padding: .25em 2em;
	margin: 1.25em -2.5em 1.25em -2em;
	border-top-right-radius: .5em;
	border-bottom-right-radius: .5em;
	background: var(--bg-sidebar-accent);
}

#game-state-sidebar ul {
	list-style: none;
	margin: 0; padding: 0;
}

#game-state-sidebar ul#company-info li {
	font-size: .9em;
	margin-bottom: .4em;
	line-height: 1;
}

#game-state-sidebar ul#company-info li strong {
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

div#game-state-focus > div.highlight {
	opacity: .6;
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
  0% {
    -webkit-transform: none;
    -ms-transform: none;
    transform: none
  }
  15% {
    -webkit-transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);
    -ms-transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);
    transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)
  }
  30% {
    -webkit-transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);
    -ms-transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);
    transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)
  }
  45% {
    -webkit-transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);
    -ms-transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);
    transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)
  }
  60% {
    -webkit-transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);
    -ms-transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);
    transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)
  }
  75% {
    -webkit-transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);
    -ms-transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);
    transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)
  }
  100% {
    -webkit-transform: none;
    -ms-transform: none;
    transform: none
  }
}

div#game-state-focus > div.used::before { animation: wobble .7s linear 1; opacity: 0; }
div#game-state-focus > div.used::after { opacity: .25; }

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

div#game-dilemma { font-size: 1.3em; }

div#game-dilemma h2 {
	font-size: 1.4em;
	font-weight: 800;
	padding-bottom: .5em;
	border-bottom: 3px solid var(--c-top);
}

div#game-dilemma h2 strong {
	color: var(--en-2l)
}

div#game-dilemma p {
	font-size: 1.1em;
	line-height: 1.5;
}

div#game-dilemma p.dilemma-note {
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
	
	background: var(--bg-button-light);
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
	
	transition: background-color .2s ease-out;
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
	background: var(--bg-button-light-hover);
}

button.dark { 
	background: var(--bg-button-dark);
	color: var(--c-button-dark-text);
}

button.dark::before { background: var(--bg-button-dark-accent); }
button.dark:hover { background: var(--bg-button-dark-hover); } 

button[disabled] { 
	cursor: not-allowed;
	background: var(--bg-button-disabled);
	color: var(--c-button-disabled-text);
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
	border-top: 2px solid var(--c-top);
	border-bottom: 2px solid var(--c-top);
}

ul#consequences-status li:not(.focus) {
	margin: 0;
	width: 17%;
	display: flex;
	align-items: stretch;
	flex-shrink: 1;
	line-height: 0;
	opacity: .25;
	filter: grayscale(1) brightness(10);
}

ul#consequences-status li:not(.focus)::before {
	content: url("/assets/icons/icon-sizer.svg");
	display: block;
	width: 55%;
	margin-right: 10%;
	line-height: 0;
	background: white;	
	mask-repeat: no-repeat;
}

ul#consequences-status li:not(.focus)::after {
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

ul#consequences-status li.focus {
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

ul#consequences-status li.increase,ul#consequences-status li.decrease { opacity: 1; filter:none; }

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

/* Result Navigation */

button#nav-continue:hover {  }
button#nav-continue { color: var(--en-2d);}
button#nav-back { width: 20%; filter:grayscale(1);}
button#nav-back::before { transform: rotate(180deg); }

/* Tooltips */

.tt-container {
	position: relative;
	overflow: visible;
}

.tt-container div.tt-positioner {
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
	bottom: 112%;
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

div.tt-frame {
	padding: .6em 1em .9em;
	background-color: var(--c-tooltip);
	color: var(--c-tooltip-text);
	border-radius: 1em;
	font-family: acumin-pro-condensed, sans-serif;
	font-size: 1.4rem;
	line-height: 1.25;
}

div.tt-option div.tt-frame {
	padding: 0;
	border: .5em solid;
	border-color: var(--c-tooltip);
	overflow: hidden;
}

div.tt-option div.tt-frame::after {
	content: " ";
	position: absolute;
	top: 100%;
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
div.tt-frame p:last-child { margin-bottom: 0; }

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

ul.option-details li:last-child {
	margin-bottom: 0;
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

.ii.capital::before { mask-image: url("/assets/icons/icon-capital.svg"); }
.ii.users::before { mask-image: url("/assets/icons/icon-users.svg"); }
.ii.capabilities::before { mask-image: url("/assets/icons/icon-capabilities.svg"); }
.ii.focus::before { mask-image: url("/assets/icons/icon-focus-small.svg"); }
.ii.lock::before { mask-image: url("/assets/icons/icon-lock.svg"); top: -0.1em; }
.ii.unlock::before { mask-image: url("/assets/icons/icon-lock-open.svg"); }

</style>
