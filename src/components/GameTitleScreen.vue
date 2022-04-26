<template>
  <div id="title-screen" key="title-screen">
    <transition name="simple-fade" mode="out-in">
      <div
        v-if="!aboutOpen"
        id="main-screen"
        key="main-screen"
      > 
        <h1>
          <img src="/assets/game-logo-stacked.svg" />
        </h1>
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
        <button
          class="title-about"
          @click="toggleAbout"
        >
          <span>About <em>Startup Trail</em></span>
        </button>
        <p>
          <a href="https://engine.is" target="_blank">
            <img src="/assets/logo-engine.png">
          </a>
        </p>
      </div>
      <div
        v-if="aboutOpen"
        id="about-screen"
        key="about-screen"
      >
        <div class="logo-pair">
          <div class="game"> 
            <img class="game-logo" src="/assets/game-logo-stacked.svg" />
          </div>
          <div class="engine">
            <a href="ExternalLinks.Engine" title="Engine" target="_blank"><img src="/assets/logo-engine.png" alt="Engine" /></a>
          </div>
        </div>
        <div class="info-frame">
          <p>A game exploring the policy issues<br>
          that impact today&rsquo;s tech startups.</p>
          <p>Learn more in the <a :href="ExternalLinks.StartupAgenda" class="external" target="_blank">2022 Startup Agenda</a></p>
        </div>
        <div class="info-frame credits">
          <p>Created by <a href="https://copia.is/gaming/" title="Copia Gaming" target="_blank"><strong>Copia Gaming</strong></a> and <a href="https://leveragedplay.com/" title="Leveraged Play" target="_blank"><strong>Leveraged Play</strong></a><br></p>
          <p>Written &amp; developed by <strong>Mike Masnick</strong>,<br><strong>Randy Lubin</strong>, and <strong>Leigh Beadon</strong></p>
          <div class="logo-pair">
            <div class="copia"> 
              <a href="https://copia.is/gaming/" title="Copia Gaming" target="_blank"><img src="/assets/logo-copia.svg" alt="Copia Gaming" /></a>
            </div>
            <div class="leveraged-play">
              <a href="https://leveragedplay.com/" title="Leveraged Play" target="_blank"><img src="/assets/logo-lp.svg" alt="Leveraged Play" /></a>
            </div>
          </div>
        </div>
        <button @click="toggleAbout" class="about-back"><span>Back</span></button>
      </div>
    </transition>
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
    inject: {
      ExternalLinks: 'external-links'
    },
    data () {
      return {
        aboutOpen: false
      }
    },
    computed: {
    },
    methods: {
      newGame(){
        this.$gtag.event('New Game', { 
					'event_category' : 'Games Played'
				})
        this.$emit('new-game')
      },
      resumeGame(){
        this.$gtag.event('Resume Game', { 
					'event_category' : 'Games Played'
				})
        this.$emit('resume-game')
      },
      toggleAbout() {
        this.aboutOpen = !this.aboutOpen
      }
    },
    mounted(){
      this.$gtag.event('View Launch Screen', { 
					'event_category' : 'Games Played'
				})
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

  h1 img {
    width: 65%;
  }

  h2 {
    margin: 0 0 1.1em;
    text-align: center;
    font-style: italic;
    font-size: 1.4em;
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

  button.title-about::before {
    mask-image: url('/assets/icons/icon-info.svg');
  }

  button.about-back::before {
    transform: rotate(180deg);
  }

  button.about-back {
    margin-bottom: 0;
  }

  .info-frame {
    box-sizing: border-box;
    padding: 1.5rem 1rem;
    margin-top: 1.3rem;
    margin-bottom: 1rem;
    line-height: 1.4;
    text-align: center;
    border: .3rem solid var(--c-accent-1);
    border-radius: .3em;
  }

  .info-frame img {
    width: 60%;
    margin-top: 1em;
  }

  .info-frame p {
    margin-top: 0;
    margin-bottom: .75em;
  }

  .info-frame :last-child { margin-bottom: 0; }

  .info-frame.credits {
    font-size: .75em;
  }

  div#about-screen {
    text-align: center;
  }

  div.logo-pair {
    display: flex;
    align-items: center;
    width: 90%;
    margin: 0 auto 2rem;
  }

  div.logo-pair > div.game {
    box-sizing: border-box;
    width: 51%;
    padding-right: 3.5rem;
    margin-right: 3rem;
    border-right: .2rem solid var(--c-accent-1);
  }

  div.logo-pair > div.engine {
    width: 49%;
  }

  div.logo-pair > div.copia {
    width: 35%;
    margin-right: 15%;
  }

  div.logo-pair > div.leveraged-play {
    width: 50%;
  }

  div.logo-pair > div img, div#about-screen div.info-frame div.logo-pair > div img {
    display: block;
    width: 100%;
  }

  div.logo-pair img.game-logo {
    transform: translateY(5%)
  }

  .simple-fade-enter-active { transition: opacity .5s ease-out; }
  .simple-fade-leave-active { transition: opacity .5s ease-out; }
  .simple-fade-enter, .simple-fade-leave-to {
    opacity: 0;
  }


  </style>