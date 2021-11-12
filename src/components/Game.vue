<template>
  <div id="game">
    The game holder
    <app-state-sidebar class=""></app-state-sidebar>
    <app-dilemma class=""></app-dilemma>
  </div>
</template>

<script>
  import StateSidebar from './StateSidebar.vue'
  import Dilemma from './Dilemma.vue'

  export default {
    name: 'game',
    components: {
      'app-state-sidebar': StateSidebar,
      'app-dilemma': Dilemma,
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
