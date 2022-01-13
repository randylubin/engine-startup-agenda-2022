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
    ></app-dilemma>
	<app-chapter-control-panel
      :chapterHistory="chapterHistory"
      @restart-game="restartGame()"
      @undo-state-change="undoStateChange()"
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

  export default {
    name: 'game',
    components: {
      'app-state-sidebar': StateSidebar,
      'app-dilemma': Dilemma,
      'app-chapter-control-panel': ChapterControlPanel,
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
      chooseOption(option){
        this.optionHistory.push(option)
      },
      nextPrompt(){
        console.log('ch length', this.chapterHistory.length)
        let newDilemma = DilemmaCompiler[this.chapterHistory.length](this.stateHistory[this.stateHistory.length-1])
        this.chapterHistory.push(newDilemma)
        this.optionHistory.push(null)
        this.stateHistory.push(JSON.parse(JSON.stringify(this.stateHistory[this.stateHistory.length-1])))
        this.currentChapterInfo = newDilemma
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
	--base-border-radius: 8px;
	
	--sidebar-bg: #eee;
	--meter-border: 2px solid #888;
	--meter-fill: #666;
	--meter-increase: #444;
	--meter-decrease: #888;
	--button-bg: #ddd;
	--button-bg-hover: #aaa;
	--button-bg-dark: #444;
	--button-bg-dark-hover: #777;
}

/* General Settings */

html { font-size: 12px;}
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
	position: absolute; top: 0; bottom: 0; left: 0; right: 0;
	display: flex;
	align-items: stretch;
}

div#game {
	display: flex;
	align-items: stretch;
	column-gap: 3em;
	
	width: 100%;
	max-width: 1920px;
	min-width: 1024px;
	margin: 0 auto;
}

div#game-state-sidebar {

	flex: 22;
	min-width: 300px;
	padding: 2em;
	
	background-color: var(--sidebar-bg);
}

div#game-dilemma {
	flex: 78;
	padding-top: 2em;
	padding-right:3em;
}

/* Sidebar Master Styles */

#game-state-sidebar h2 {
	font-size: 1.5em;
}

#game-state-sidebar h3 {
	font-size: 1em;
	font-weight: 800;
	text-transform: uppercase;
	padding: .25em 0;
	margin-top: 1.5em;
	margin-bottom: 1em;
	border-bottom: 2px solid black;
	border-top: 2px solid black;
}

#game-state-sidebar ul {
	list-style: none;
	margin: 0 0 2em 0; padding: 0;
}

#game-state-sidebar ul li {
	font-size: .9em;
	margin-bottom: .4em;
}

#game-state-sidebar ul li strong {
	text-transform: uppercase;
}

/* State Meter Layout */

div#game-state-meters > div {
	box-sizing: border-box;
	width: 100%;
	padding-left: 4em;
	margin-bottom: 1em;
	height: 3em;
	
	background-position: 0 0;
	background-repeat: no-repeat;
}

div#meter-capital { background-image: url("/assets/icons/icon-capital.svg"); }
div#meter-users { background-image: url("/assets/icons/icon-users.svg"); }
div#meter-capabilities { background-image: url("/assets/icons/icon-capabilities.svg"); }

/* Focus Clocks */

div#game-state-focus {
	display: flex;
	column-gap: 5%;
	align-items: stretch;
}

div#game-state-focus > div {
	flex: 1;
	transition: opacity .5s ease-out;
}

div#game-state-focus > div.used {
	opacity: .5;
}

/* Main Panel */

div#game-dilemma h2 {
	font-size: 2.25em;
	font-weight: 800;
	padding-bottom: .5em;
	border-bottom: 3px solid black;
}

div#game-dilemma h2 strong {
	color: #666;
}

div#game-dilemma p {
	font-size: 1.6em;
	line-height: 1.5;
}

div#game-dilemma p.dilemma-note {
	font-weight: 500;
}

/* Choices */

button {
	background-color: var(--button-bg);
	background-image: url("/assets/icons/icon-triangle.svg");
	background-repeat: no-repeat;
	background-size: 1em;
	background-position: .6em 50%;
	border: 0;
	border-radius: var(--base-border-radius);
	width: 100%;
	overflow: hidden;
	
	position: relative;
	padding: .5em 4.5em .5em 2.5em;
	margin-bottom: .5em;
	cursor: pointer;
	
	line-height: 1.4;
	text-align: left;
	font-family: aglet-slab, serif;
	font-size: 1.5em;
	font-weight: 500;
	
	transition: background-color .2s ease-out;
}

button[disabled] {
	background-image: url("/assets/icons/icon-lock.svg");	
	cursor: not-allowed;
}

button:hover {
	background-color: var(--button-bg-hover);
}

div.dilemma-option button ul {

	position: absolute;
	right: .6em; top: 0; bottom: 0;
	margin: 0;
	padding: 0;
	
	display: flex;
	align-items: stretch;
	column-gap: .2em;
	
	list-style: none;
}

div.dilemma-option button ul li {

	background-repeat: no-repeat;
	background-size: contain;
	background-position: 0 50%;
	width: 1em;
	margin-left: .1em;
}

div.dilemma-option button ul li.capital { background-image: url("/assets/icons/icon-capital.svg"); }
div.dilemma-option button ul li.users { background-image: url("/assets/icons/icon-users.svg"); }
div.dilemma-option button ul li.capabilities { background-image: url("/assets/icons/icon-capabilities.svg"); }
div.dilemma-option button ul li.focus { background-image: url("/assets/icons/icon-focus-small.svg"); }

/* Results */

ul#consequences-status {
	list-style: none;
	margin: 0 0 1.5em 0;
	padding: .75em 1.5em .5em 1.5em;
	border-top: 2px solid black;
	border-bottom: 2px solid black;
	
	font-size: 1.6em;
}

ul#consequences-status li {
	padding: .75em 0 .75em 5.25em;
	margin-bottom: .25em;
	position: relative;
	
	background-repeat: no-repeat;
	background-size: 2em;
	background-position: 0 50%;
	
	font-weight: 500;
}

ul#consequences-status li.capital { background-image: url("/assets/icons/icon-capital.svg"); }
ul#consequences-status li.users { background-image: url("/assets/icons/icon-users.svg"); }
ul#consequences-status li.capabilities { background-image: url("/assets/icons/icon-capabilities.svg"); }
ul#consequences-status li.focus { background-image: url("/assets/icons/icon-focus-small.svg"); }

ul#consequences-status li.increase::before,ul#consequences-status li.decrease::before {
	content: "";
	position: absolute;
	top: 0; left: 2.4em; bottom:0;
	width: 1.75em;
	opacity: .6;
	
	background-image: url("/assets/icons/icon-arrow.svg");
	background-repeat: no-repeat;
	background-size: contain;
	background-position: 0 50%;
}

ul#consequences-status li.decrease::before {
	transform: rotate(180deg);
}

/* Result Navigation */

div#consequences-nav-buttons {
	/* display: flex;
	column-gap: 1em; */
}

div#consequences-nav-buttons button {
	flex: 1;
	padding-right: .5em;
}

button#nav-continue {
	background-image: url("/assets/icons/icon-triangle-light.svg");
	background-color: var(--button-bg-dark);
	color: var(--button-bg);
}

button#nav-continue:hover { background-color: var(--button-bg-dark-hover); }
button#nav-back { background-image: url("/assets/icons/icon-triangle-l.svg"); width: 15rem;}

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
	bottom: calc(100% + 9px);
	left: calc(50% - 175px);
	width: 350px;
	flex-direction: row;
	justify-content: center;
	
	filter: drop-shadow(4px 4px 4px rgba(0,0,0,50%));
}

div.tt-positioner.tt-sidebar {
	left: calc(100% + 48px);
	top: 0;
	height: 100%;
	width: 400px;
	flex-direction: column;
	justify-content: center;
	
	filter: drop-shadow(4px 4px 4px rgba(0,0,0,50%));
}

div.tt-frame {
	padding: .6em 1em .9em;
	background: #444;
	color: white;
	
	font-family: acumin-pro-condensed, sans-serif;
	font-size: 1.1em;
	line-height: 1.25;
}

div.tt-option div.tt-frame::after {
	content: " ";
	position: absolute;
	top: 100%;
	left: 50%;
	margin-left: -16px;
	border-width: 16px;
	border-style: solid;
	border-color: #444 transparent transparent transparent;
}

div.tt-sidebar div.tt-frame::after {
	content: " ";
	position: absolute;
	top: 50%;
	right: 100%;
	margin-top: -16px;
	border-width: 16px;
	border-style: solid;
	border-color: transparent #444 transparent transparent;
}

div.tt-frame p { margin: 0 0 1em 0; }
div.tt-frame p:last-child { margin-bottom: 0; }

/* Option Detail Lists */

ul.option-details {
	margin: 0;
	padding: 0 0 0 1em;
	list-style: square;
}

ul.option-details li {
	margin-bottom: .25em;
}
ul.option-details li:last-child {
	margin-bottom: 0;
}

ul.option-details li span {
	font-weight: 600;
}
ul.option-details li.lock {
	list-style: none;
	margin-left: -1em;
	font-weight: 600;
}

ul.option-details li.lock span {
	font-weight: 700;
}

ul.option-details li.focus {
	list-style: none;
	margin-left: -1em;
	padding-top: .5em;
	margin-top: .75em;
	border-top: 1px solid white;
	font-style: italic;
}

ul.option-details li.focus:first-child {
	margin-top: 0; padding-top: 0; border-top: none;
}

ul.option-details li.note {
	list-style: none;
	margin-left: -1em;
}

</style>
