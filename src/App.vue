<template>
  <div id="app">
    <app-game class=""></app-game>
    <div id="unsupported-device">
      <div>
        <h1>
          <img src="/assets/game-logo-stacked.svg" />
        </h1>
        <h2>The Game of Startup Survival</h2>
        <p id="device-message">
          Sorry, mobile devices with small screens are not supported. Play <i>Startup&nbsp;Trail</i> on a laptop or desktop.
        </p>
        <p id="screen-message">
          <i>Startup&nbsp;Trail</i> requires a larger display area. Please expand your browser window or try another device.
        </p>
        <a href="https://engine.is" target="_blank">
          <img src="/assets/logo-engine.png">
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import Game from './components/Game.vue'

  export default {
    name: 'app',
    components: {
      'app-game': Game,      
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

<style>

div#unsupported-device {
	display: none;
}

div#unsupported-device > div {
  width: 90%;
  max-width: 500px;
}

div#unsupported-device h1 img {
  width: 70%;
  max-width: 300px;
}

div#unsupported-device img {
  width: 50%;
  max-width: 200px;
}

div#unsupported-device h2 {
  margin: 0 0 1.1em;
  text-align: center;
  font-style: italic;
  font-size: 1.7em;
}

div#unsupported-device p {
  width: 90%;
  font-size: 1.4em;
  line-height: 1.6;
  margin: 1em auto 2.5em;
}

p#screen-message {
  display: none;
}

@media (max-width: 1023px) {
	div#unsupported-device {
		position: fixed; top: 0; right: 0; bottom: 0; left: 0;
		
		display: flex !important;
		justify-content: center;
		align-items: center;
    text-align: center;
		color: white;
		background: var(--c-base);
	}

	div#game {
		display: none !important;
	}
}

@media (min-device-width: 1024px) {
  p#device-message {
    display: none !important;
  }
  p#screen-message {
    display: block !important;
  }
}


</style>
