<template>
  <div id="title-screen" key="title-screen">
    <div>
      <h1>Silicon Trail</h1>
      <h2>The Game of Startup Survival</h2>
      <button
        v-if="saveExists"
        class="dark"
        @click="resumeGame"
      >
        <span>Resume Game</span>
      </button>
      <button
        :class="{ dark: !saveExists }"
        @click="newGame"
      >
        <span>New Game {{saveExists?'(progress will be lost)':''}}</span>
      </button>
      <p>
        <a href="https://engine.is" target="_blank">
          <img src="/assets/logo-engine.png">
        </a>
      </p>
    </div>
  </div>    
</template>

<script>
  export default {
    name: 'title-screen',
    components: {
    },
    props: {
      saveExists: Boolean
    },
    data () {
      return {
      }
    },
    computed: {
    },
    methods: {
      newGame(){
        this.$emit('new-game')
      },
      resumeGame(){
        this.$emit('resume-game')
      }
    }
  }
</script>

<style scoped>

  h1 {
    font-size: 2.5em;
    color: var(--en-3l);
    text-align: center;
    margin-bottom: .25em;
  }

  h2 {
    margin: 0 0 1.25em;
    text-align: center;
    font-style: italic;
  }

  p {
    text-align: center;
    margin: 2em 0 0;
  }

  p img {
    width: 40%;
    min-width: 150px;
  }

  div#title-screen {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  div#title-screen > div {
    width: 30%;
    min-width: 420px;
    max-width: 800px;
    
    padding: 2em;
    border: .2em solid var(--en-2l);
    border-radius: 1em;
  }

</style>