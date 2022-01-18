<template>
  <div id="game-state-sidebar" v-if="currentState">
    <h2>Company Name</h2>
	<ul id="company-info">
		<li><strong>Founder:</strong> Placeholder</li>
		<li><strong>Headquarters:</strong> Placeholder</li>
	</ul>
	<h3>Company Status</h3>
    <div id="game-state-meters">
		<div id="meter-capital" class="tt-container">
			<div class="icon-meter icon-capital"></div>
			<state-meter :stateValue="currentState.capital" :stateChange="chosenOption?chosenOption.stateChange.capital:0"></state-meter>
			<div class="tt-positioner tt-sidebar">
			<div class="tt-frame">
				<p>This meter tracks your overall&ensp;<strong class="ii capital">Financial Health</strong>. If this drops to zero, your company has run out of money and the game will end!</p>
			</div>
			</div>
		</div>
		<div id="meter-users" class="tt-container">
			<div class="icon-meter icon-users"></div>
			<state-meter :stateValue="currentState.users" :stateChange="chosenOption?chosenOption.stateChange.users:0"></state-meter>
			<div class="tt-positioner tt-sidebar">
			<div class="tt-frame">
				<p>This meter tracks your product's rate of&ensp;<strong class="ii users">User Growth</strong>. If this drops to zero, your product has stagnated and the game will end!</p>
			</div>
			</div>
		</div>
		<div id="meter-capabilities" class="tt-container">
			<div class="icon-meter icon-capabilities"></div>
			<state-meter :stateValue="currentState.capabilities" :stateChange="chosenOption?chosenOption.stateChange.capabilities:0"></state-meter>
			<div class="tt-positioner tt-sidebar">
			<div class="tt-frame">
				<p>This meter tracks your company's capacity to tackle challenges with&ensp;<strong class="ii capabilities">Tech &amp; Talent</strong>. If this drops to zero, your company has run out of innovative power and the game will end!</p>
			</div>
			</div>
		</div>
    </div>
	<h3>Time &amp; Focus</h3>
	<div class="tt-container">
	<div id="game-state-focus">
		<div v-bind:class="{used: currentState.focus < 1}" id="focus-1"></div>
		<div v-bind:class="{used: currentState.focus < 2}" id="focus-2"></div>
		<div v-bind:class="{used: currentState.focus < 3}" id="focus-3"></div>
	</div>
	<div class="tt-positioner tt-sidebar">
		<div class="tt-frame">
			<p>Some courses of action require&ensp;<strong class="ii focus">Time &amp; Focus</strong>, which is always in short supply! Once you run out of this valuable resource, you'll have to wait for it to be replenished at certain game milestones.</p>
			<p>Unused&ensp;<strong class="ii focus">Time &amp; Focus</strong> will become improvements to your core product, so it's sometimes wise to avoid using it all &mdash; if you can!</p>
		</div>
	</div>
	</div>	
	<h3>Current Activity</h3>
    <div id="game-state-flags" v-if="currentState.pastEvents">
		<div>
			<transition-group name="list-update">
			<div 
				v-for="(flag,index) in activityFlags"
				:key="'flag-' + index" :id="'flag-' + flag.state"
				:class="['tt-container','activity-flag',...flag.cssClass.split(' ')]"
			>
				<span class="text">{{flag.title}}</span>
				<span class="ani"></span>
				<div v-if="flag.text" class="tt-positioner tt-sidebar">
				<div class="tt-frame">
					{{flag.text}}
				</div>
				</div>
			</div>
			</transition-group>
		</div>
    </div>
  </div>
</template>

<script>
  import StateMeter from './StateMeter.vue'
  import FlagIndex from "./FlagIndex.js";
  
  export default {
    name: 'state-sidebar',
    props: {
		currentState: Object,
		chosenOption: Object
    },
    components: {
		'state-meter': StateMeter
    },
    data () {
      return {
      }
    },
	computed: {
		activityFlags: function () {
			let flags = [];
			for (const state in this.currentState) {
				if (FlagIndex[state]) {
					if (this.currentState[state] && FlagIndex[state].flagTitle) {
						flags.push({
							state: state,
							title: FlagIndex[state].flagTitle,
							cssClass: FlagIndex[state].flagClass?FlagIndex[state].flagClass:"default",
							text: FlagIndex[state].flagText?FlagIndex[state].flagText:false
						});
					}
				}
			}
			return flags;
		}
	},
    mounted () {
    },
    methods: {
    }
  }
</script>

<style>

.activity-flag {
	transition: transform .5s ease-out, opacity .5s ease-out;
}

.list-update-enter, .list-update-leave-to {
	opacity: 0;
	transform: translateX(10%);
}

</style>
