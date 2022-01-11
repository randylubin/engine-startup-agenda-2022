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
			<div class="state-meter">
				<div v-bind:style="{ width: currentState.capital + '%' }"></div>		
			</div>
		</div>
		<div id="meter-users">
			<div class="state-meter">
				<div v-bind:style="{ width: currentState.users + '%'}"></div>
			</div>
		</div>
		<div id="meter-capabilities">
			<div class="state-meter">
				<div v-bind:style="{ width: currentState.capabilities + '%' }"></div>
			</div>
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

  export default {
    name: 'state-sidebar',
    props: {
      currentState: Object,
    },
    components: {
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
