<template>
  <div id="app">
    <app-game class=""></app-game>
    <div id="unsupported-device">
      Screen too small. Minimum width 1024px.
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

<style lang="scss">

</style>
