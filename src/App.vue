<template>
  <div id="app">
    <app-game class=""></app-game>
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
