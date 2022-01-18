<template>
<div
	v-if="isVisible"
	@mouseover="highlightStates(true)"
	@mouseleave="highlightStates(false)"
	class="dilemma-option tt-container"
>
	<button
		:class="{'unlock': lockIndex.customUnlocked && !isLocked}"
		:disabled="isLocked"
		@click="clickOption"
	>
		<ul v-if="isLocked || lockIndex.primary.focus.required">
			<li 
				v-if="lockIndex.primary.capital.required"
				:class="{capital: true, satisfied: lockIndex.primary.capital.unlockedBy}"
			></li>
			<li
				v-if="lockIndex.primary.users.required"
				:class="{users: true, satisfied: lockIndex.primary.users.unlockedBy}"
			></li>
			<li 
				v-if="lockIndex.primary.capabilities.required"
				:class="{capabilities: true, satisfied: lockIndex.primary.capabilities.unlockedBy}"
			></li>
			<li class="focus" v-if="lockIndex.primary.focus.required"></li>
		</ul>
		<span>{{option.optionText}}</span>	
	</button>
	<div class="tt-positioner tt-option" v-if="tooltipItems.items.length > 0">
		<div class="tt-frame">
			<ul class="option-details">
				<li
					v-for="(item,index) in tooltipItems.items"
					:key="index"
					:class="item.classes"
					v-html="item.content"
				></li>
			</ul>
		</div>
	</div>
</div>
</template>

<script>

import FlagIndex from "./FlagIndex.js";

export default {
	name: 'dilemma-option',
	props: {
		currentState: Object,
		option: Object,
	},
	data () {
		return {
			hover: false
		}
	},
	computed: {
		isLocked: function() {
			let locked = false
			for (const requirement in this.option.optionRequirements){
				if (!(this.currentState[requirement] == this.option.optionRequirements[requirement] || this.currentState[requirement] >= this.option.optionRequirements[requirement])){
					locked = true;
				}
			}
			return locked
		},
		isVisible: function() {
			if (!this.option.optionVisibility) {
				return true;
			} else {
				let visible = false
				for (const requirement in this.option.optionVisibility){
					if (this.currentState[requirement] && (this.currentState[requirement] == this.option.optionVisibility[requirement] || this.currentState[requirement] >= this.option.optionRequirements[requirement])){
						visible = true;
					}
				}
				return visible
			}
		},
		lockIndex: function () { // Lock data specially mapped for generating tooltips and icons
			let defaultMap = {
					required: false,
					lockedBy: false,
					unlockedBy: false
			}
			let primaryStates = {
				capital: {...defaultMap},
				users: {...defaultMap},
				capabilities: {...defaultMap},
				focus: {...defaultMap}
			}
			let flaggedStates = {}, primarylock = false, customunlock = false;
			for (const requirement in this.option.optionRequirements) {
				if (requirement == "capital" ||
					requirement == "users" ||
					requirement == "capabilities" ||
					requirement == "focus") {
						if (this.currentState[requirement] < this.option.optionRequirements[requirement]) {
							primarylock = true;
						}
						primaryStates[requirement] = {
							required: true,
							lockedBy: this.currentState[requirement] < this.option.optionRequirements[requirement],
							unlockedBy: this.currentState[requirement] >= this.option.optionRequirements[requirement]
						}
				} else if (FlagIndex[requirement]) { // only track custom states that have flags in the index
					if (this.currentState[requirement] == this.option.optionRequirements[requirement]) {
						customunlock = true;
					}
					flaggedStates[requirement] = {
						required: true,
						stateValue: this.currentState[requirement],
						lockedBy: !(this.currentState[requirement] == this.option.optionRequirements[requirement]),
						unlockedBy: this.currentState[requirement] == this.option.optionRequirements[requirement]
					}
				}
			}
			for (const requirement in this.option.optionVisibility) {
				if (requirement == "capital" ||
					requirement == "users" ||
					requirement == "capabilities" ||
					requirement == "focus") {
						continue; // Primary state visibility locks are irrelevant to this map for current functionality
				}
				if (flaggedStates[requirement] == undefined && FlagIndex[requirement]) { // apply visibility locks, but normal locks take precedent
					if (this.currentState[requirement] == this.option.optionVisibility[requirement]) {
						customunlock = true;
					}
					flaggedStates[requirement] = {
						required: true,
						stateValue: this.currentState[requirement],
						lockedBy: !(this.currentState[requirement] == this.option.optionVisibility[requirement]),
						unlockedBy: this.currentState[requirement] == this.option.optionVisibility[requirement]
					}
				}
			}
			console.log(primarylock);
			return {
				primaryLocked: primarylock,
				customUnlocked: customunlock,
				primary: primaryStates,
				flagged: flaggedStates
			}
		},
		tooltipItems: function () {
			let ttItems = [], ttLinks = [], customUnlocks = [], customLocks = [];
			if (!this.isVisible) return ttItems; // don't bother with invisible options
			
			if (this.lockIndex.primary.focus.required && !(this.lockIndex.primary.focus.lockedBy)) {
				ttItems.push({
					content: "This choice uses&ensp;<strong class='ii focus'>Time & Focus</strong>",
					classes: ["note","focus"]
				});
				ttLinks.push("focus-" + Math.max(this.currentState.focus,3));
			}
			
			for (const state in this.lockIndex.flagged) {
				let text = this.lockIndex.flagged[state].stateValue?"trueText":"falseText";
				let link = this.lockIndex.flagged[state].stateValue && FlagIndex[state].flagTitle?"flag-" + state:false;
				if (this.lockIndex.flagged[state].lockedBy && FlagIndex[state][text]) {
					customLocks.push(FlagIndex[state][text]);
					if (link) ttLinks.push(link);
				} else if (this.lockIndex.flagged[state].unlockedBy && FlagIndex[state][text]) {
					customUnlocks.push(FlagIndex[state][text]);
					if (link) ttLinks.push(link);
				}
			}
			
			if (customUnlocks.length > 1) {
					ttItems.push({
						content: "This choice is available because:",
						classes: ["note","unlock"]
					});
					for (const i in customUnlocks) {
						ttItems.push({
							content: customUnlocks[i],
							classes: ["unlock-list"]
						});
					}
			} else if (customUnlocks.length == 1) {
				ttItems.push({
					content: "This choice is available because " + customUnlocks[0],
					classes: ["note","unlock"]
				});
			}
			
			if (customLocks.length > 1 || this.lockIndex.primaryLocked) {
				if (customUnlocks.length > 0) {
					ttItems.push({
						content: "But it is&ensp;<strong class='ii lock'>Locked</strong>&ensp;because:",
						classes: ["note","lock"]
					});
				} else {
					ttItems.push({
						content: "This choice is&ensp;<strong class='ii lock'>Locked</strong>&ensp;because:",
						classes: ["note","lock"]
					});
				}
				for (const i in customLocks) {
					ttItems.push({
						content: customLocks[i],
						classes: ["lock-list"]
					});
				}
				if (this.lockIndex.primary.capital.lockedBy) {
					ttItems.push({
						content: "You have insufficient&ensp;<strong class='ii capital'>Financial Health</strong>",
						classes: ["lock-list"]
					});
					ttLinks.push("meter-capital");
				}
				if (this.lockIndex.primary.users.lockedBy) {
					ttItems.push({
						content: "You have insufficient&ensp;<strong class='ii users'>User Growth</strong>",
						classes: ["lock-list"]
					});
					ttLinks.push("meter-users");
				}
				if (this.lockIndex.primary.capabilities.lockedBy) { 
					ttItems.push({
						content: "You have insufficient&ensp;<strong class='ii capabilities'>Tech &amp; Talent</strong>",
						classes: ["lock-list"]
					});
					ttLinks.push("meter-capabilities");
				}
				if (this.lockIndex.primary.focus.lockedBy) {
					ttItems.push({
						content: "You have no&ensp;<strong class='ii focus'>Time &amp; Focus</strong>&ensp;to spare",
						classes: ["lock-list"]
					});
				}
			} else if (customLocks.length > 0) {
				if (customUnlocks.length > 0) {
					ttItems.push({
						content: "But it is&ensp;<strong class='ii lock'>Locked</strong>&ensp;because " + customLocks[0],
						classes: ["note","lock"]
					});
				} else {
					ttItems.push({
						content: "This choice is&ensp;<strong class='ii lock'>Locked</strong>&ensp;because " + customLocks[0],
						classes: ["note","lock"]
					});
				}
			}						
			return {
				items: ttItems,
				links: ttLinks
			};
		}
		
	},
    mounted () {
    },
    methods: {
		highlightStates(on) {
			if (on) {
				for (const i in this.tooltipItems.links) {
					let element = document.getElementById(this.tooltipItems.links[i]);
					if (element) element.classList.add("highlight");
				}
			} else {
				for (const i in this.tooltipItems.links) {
					let element = document.getElementById(this.tooltipItems.links[i]);
					if (element) element.classList.remove("highlight");
				}
			}
		},
		clickOption() {
			this.highlightStates(false);
			this.$emit('click-option',this.option);
		}
    }
}
</script>

<style>

</style>