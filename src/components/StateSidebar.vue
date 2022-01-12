<template>
  <div id="game-state-sidebar" v-if="currentState">
    <h2>Company Name</h2>
	<ul id="company-info">
		<li><strong>Founder:</strong> Placeholder</li>
		<li><strong>Headquarters:</strong> Placeholder</li>
	</ul>
	<h3>Company Status</h3>
    <div id="game-state-meters">
		<div id="meter-capital">
			<state-meter :stateValue="currentState.capital" :stateChange="chosenOption?chosenOption.stateChange.capital:0"></state-meter>
		</div>
		<div id="meter-users">
			<state-meter :stateValue="currentState.users" :stateChange="chosenOption?chosenOption.stateChange.users:0"></state-meter>
		</div>
		<div id="meter-capabilities">
			<state-meter :stateValue="currentState.capabilities" :stateChange="chosenOption?chosenOption.stateChange.capabilities:0"></state-meter>
		</div>
    </div>
	<h3>Time &amp; Focus</h3>
	<div id="game-state-focus">
		<div v-bind:class="{used: currentState.focus < 1}"><img src="/assets/icons/icon-focus.svg"></div>
		<div v-bind:class="{used: currentState.focus < 2}"><img src="/assets/icons/icon-focus.svg"></div>
		<div v-bind:class="{used: currentState.focus < 3}"><img src="/assets/icons/icon-focus.svg"></div>
	</div>	
	<h3>Current Issues</h3>
    <div class="game-state-past-events" v-if="currentState.pastEvents">
      <div v-for="(pastEvent,index) in currentState.pastEvents" v-bind:key="index">
        <div v-if="index < 3">
          {{pastEvent}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import StateMeter from './StateMeter.vue'
  
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
    mounted () {
    },
    methods: {
    }
  }
</script>

<style lang="scss">

</style>
