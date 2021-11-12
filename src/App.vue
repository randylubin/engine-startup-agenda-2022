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
  div {
    border: 1px solid black ;
    margin: 5px;
    padding: 5px;
  }

</style>
