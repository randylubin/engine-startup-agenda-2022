<template>
	<div class="state-meter">
		<div class="meter-value" v-bind:style="{ width: meterValue + '%' }"></div>
		<div class="meter-decrease" v-bind:style="{ width: decreaseValue + '%' }"><span></span></div>
		<div class="meter-increase" v-bind:style="{ width: increaseValue + '%' }"><span></span></div>
	</div>
</template>

<script>
 
	const wait = ms => new Promise(resolve => setTimeout(resolve, ms)) // wrap setTimeout as a Promise
 
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
				UpdateChain: Promise.resolve(), // start Promise chain for async meter changes
				meterValue: 0,
				decreaseValue: 0,
				increaseValue: 0
      }
    },
    mounted () {
			this.UpdateChain = this.UpdateChain.then(() => this.setValues(this.stateValue,0,0))
    },
		watch: {
			stateChange: function(val) {
				const trueValue = this.stateValue
				if (!val) {
					this.UpdateChain = this.UpdateChain.then(() => this.setValues(trueValue,0,0))
				} else {
					const
						meter = val<0?Math.max(trueValue,0):Math.max(trueValue - val,0),
						increase = Math.max(val,0),
						decrease = val<0?trueValue<0?val*-1+trueValue:val*-1:0
					
					this.UpdateChain = this.UpdateChain
						.then(() => this.setValues(meter,increase,decrease))
						.then(() => wait(2000))
						.then(() => this.setValues(trueValue,0,0))
						.then(() => wait(1001))
				}
			},
			stateValue: function(val) {
				if (this.meterValue != val) {
					wait(30).then(() => this.UpdateChain = this.UpdateChain.then(() => this.setValues(val,0,0)))
				}
			}
		},
    methods: {
			setValues(meter,increase,decrease) {
				this.meterValue = meter
				this.increaseValue = increase
				this.decreaseValue = decrease
				return true // required for Promise chain
			}
    }
  }
</script>

<style>

div.state-meter {
	position: relative;
	display: block;
	flex-grow: 1;
	overflow: hidden;
	background-color: var(--c-meter-bg);
	white-space: nowrap;
	border: .2rem solid var(--c-meter-border);
	border-radius: .9em;
}

div.state-meter::before {
	content: '';
	position: absolute;
	z-index: 100;
	top: 0; left: 0; right: 0; bottom: 0;
	box-sizing: border-box;
	border: .15rem solid var(--c-over);
	border-radius: calc(.9em - .2rem);
	filter: drop-shadow(var(--sh-meter-shine));
}

div.state-meter div {
	position: relative;
	display: inline-block;
	height: 100%;
	overflow: hidden;
	transition: width 1s ease-out;
}

div.state-meter div span {
	position: absolute; top: 0; right: 0; bottom: 0; left: 0;
}

div#meter-capital > div.state-meter div { background: var(--bg-capital); }
div#meter-users > div.state-meter div { background: var(--bg-users); }
div#meter-capabilities > div.state-meter div { background: var(--bg-capabilities); }

div.meter-increase { filter: brightness(110%); }
div.meter-decrease { filter: brightness(40%); }

@keyframes ani-meter-change {
	0% { background-position: 0 0; }
	100% { background-position: 2em 0; }
}

div.meter-increase span {
	background-image: 
		linear-gradient(
		-45deg, 
		rgba(255, 255, 255, .1) 25%, 
		transparent 25%, 
		transparent 50%, 
		rgba(255, 255, 255, .1) 50%, 
		rgba(255, 255, 255, .1) 75%, 
		transparent 75%, 
		transparent
	);
	z-index: 1;
	background-size: 2em 2em;
	background-repeat: repeat;
	animation: ani-meter-change .6s linear infinite;	
}

div.meter-decrease span {
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
	animation: ani-meter-change .5s linear infinite reverse;	
}

</style>
