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
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	overflow: hidden;
	white-space: nowrap;
	border: var(--meter-border);
	border-radius: var(--base-border-radius);
}

div.state-meter div {
	display: inline-block;
	height: 100%;
	overflow: hidden;
	transition: width 1s ease-out;
}

div.state-meter div.meter-value { background: var(--meter-fill); }
div.state-meter div.meter-increase { background: var(--meter-increase); }
div.state-meter div.meter-decrease { background: var(--meter-decrease); }

</style>
