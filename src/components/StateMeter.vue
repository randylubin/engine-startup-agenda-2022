<template>
	<div class="state-meter">
		<div class="meter-value" v-bind:style="{ width: meterValue + '%' }"></div>
		<div class="meter-decrease" v-bind:style="{ width: decreaseValue + '%' }"></div>
		<div class="meter-increase" v-bind:style="{ width: increaseValue + '%' }"></div>
	</div>
</template>

<script>

  export default {
    name: 'state-meter',
    props: {
		stateValue: Number,
		stateChange: Number
    },
    components: {
    },
    data () {
      return {
      }
    },
	computed: {
		meterValue: function() {
			if (!this.stateChange || this.stateChange < 0) {
				return this.stateValue;
			} else {
				return this.stateValue - this.stateChange;
			}
		},
		decreaseValue: function () {
			return this.stateChange<0?this.stateChange*-1:0;
		},
		increaseValue: function () {
			return this.stateChange>0?this.stateChange:0;
		}
	},
    mounted () {
    },
    methods: {
    }
  }
</script>

<style>

div.state-meter {
	position: relative;
	display: block;
	flex-grow: 1;
	overflow: hidden;
	white-space: nowrap;
	background-color: var(--c-meter-bg);
	border: 2px solid var(--c-meter-border);
	border-radius: .9em;
}

div.state-meter::before {
	content: '';
	position: absolute;
	z-index: 100;
	top: 0; left: 0; right: 0; bottom: 0;
	box-sizing: border-box;
	border: 2px solid var(--c-meter-bg);
	border-radius: calc(.9em - 2px);
}

div.state-meter div {
	display: inline-block;
	height: 100%;
	overflow: hidden;
	transition: width 1s ease-out;
}

div#meter-capital > div.state-meter > div { background: var(--bg-capital); }
div#meter-users > div.state-meter >  div { background: var(--bg-users); }
div#meter-capabilities > div.state-meter >  div { background: var(--bg-capabilities); }

div.state-meter div.meter-increase { filter: brightness(125%); }
div.state-meter div.meter-decrease { filter: brightness(40%); }

</style>
