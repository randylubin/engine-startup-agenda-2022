<template>
  <div id="game-state-sidebar" v-if="currentState">
    <h2>The Sidebar</h2>
    <div>
      💰 : {{currentState.capital}}
    </div>
    <div>
      👥 : {{currentState.users}}
    </div>
    <div>
      🛠 : {{currentState.capabilities}}
    </div>
    <div>
      ⏱ : {{currentState.focus}}
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
