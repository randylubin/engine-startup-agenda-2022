<template>
  <div id="game-state-sidebar" v-if="currentState">
    <h2>The Sidebar</h2>
    <div class="game-state-sliders">
      <div>
        💰 : {{currentState.capital}}
      </div>
      <div>
        👥 : {{currentState.users}}
      </div>
      <div>
        🛠 : {{currentState.capabilities}}
      </div>
    </div>
    
    <div class="game-state-focus">
      ⏱ : {{currentState.focus}}
    </div>

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
