<template>
<div v-if="isVisible" class="dilemma-option tt-container">
	<button
		:disabled="isLocked"
		@click = "$emit('click-option',option)"
	>
		<ul>
			<li class="capital" v-if="lockIndex.primary.capital.lockedBy"></li>
			<li class="users" v-if="lockIndex.primary.users.lockedBy"></li>
			<li class="capabilities" v-if="lockIndex.primary.capabilities.lockedBy"></li>
			<li class="focus" v-if="lockIndex.primary.focus.required"></li>
		</ul>
		<span>{{option.optionText}}</span>	
	</button>
</div>
</template>

<script>
  
export default {
    name: 'dilemma-option',
    props: {
		currentState: Object,
		option: Object,
    },
    data () {
		return {
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
					if (this.currentState[requirement] == this.option.optionVisibility[requirement] || this.currentState[requirement] >= this.option.optionRequirements[requirement]){
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
			};
			let customStates = {};
			for (const requirement in this.option.optionRequirements) {
				if (requirement == "capital" ||
					requirement == "users" ||
					requirement == "capabilities" ||
					requirement == "focus") {
						primaryStates[requirement] = {
							required: true,
							lockedBy: this.currentState[requirement] < this.option.optionRequirements[requirement],
							unlockedBy: this.currentState[requirement] >= this.option.optionRequirements[requirement]
						}
				} else {
					customStates[requirement] = {
						required: true,
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
				if (customStates[requirement] == undefined) { // apply visibility locks, but normal locks take precedent
					customStates[requirement] = {
						required: true,
						lockedBy: !(this.currentState[requirement] == this.option.optionVisibility[requirement]),
						unlockedBy: this.currentState[requirement] == this.option.optionVisibility[requirement]
					}
				}
			}
			return {
				primary: primaryStates,
				custom: customStates,
				all: {...primaryStates, ...customStates}
			}
		}
		
	},
    mounted () {
    },
    methods: {
    }
}
</script>

<style>

</style>