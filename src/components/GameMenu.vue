<template>
  <div id="menu-panel">
    <div id="button-container" class="container">
      <menu id="main">
        <div
          @click="toggleSubmenu"
          :class="{'menu-button' : true, 'pressed' : submenuOpen}"
          id="open-submenu"
        />
        <div
          @click="toggleFullscreen"
          :class="{'menu-button' : true, 'exit' : isFullscreen}"
          id="fullscreen"
        />
        <div
          @click="toggleAbout"
          :class="{'menu-button' : true, 'pressed' : aboutOpen}"
          id="open-about"
        />
      </menu>
    </div>
    <div id="timeline-container" class="container">
      <transition name="simple-fade">
        <progress-timeline
          v-if="currentChapterIndex > 0"
          :currentChapterIndex="currentChapterIndex"
        />
      </transition>
    </div>
    <div id="logo-container" class="container">
      <h1>
        <img src="/assets/game-logo.svg" alt="Founder's Quest" />
      </h1>
    </div>

    <transition name="simple-fade">
      <div 
        v-if="submenuOpen"
        @mouseleave="toggleSubmenu(true)"
        id="submenu-panel"
      >
        <button
          :class="{'restart': true, 'pressed': confirmingRestart}"
          @click="confirmingRestart = !confirmingRestart"
        >
          <span>Start Over</span>
        </button>
        <div
          :class="{'open': confirmingRestart}"
          id="restart-confirmation"
        >
          Are you sure? <button @click="restartGame" class="dark" style="display:inline-flex;width:auto;">Confirm</button>
        </div>
        <button 
          @click="toggleAbout"
          class="about"
        >
          <span>About the Game</span>
        </button>
        <div class="info-frame">
          Learn more in the<br>
          <a :href="ExternalLinks.StartupAgenda" class="external" target="_blank">2022 Startup Agenda</a><br>
          <a :href="ExternalLinks.Engine" target="_blank"><img src="/assets/logo-engine.png" alt="Engine" /></a>
        </div>
      </div>
    </transition>
    <transition name="simple-fade">
      <div
        v-if="aboutOpen"
        id="about-panel"
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
        <button @click="toggleAbout" class="close"><span>Close</span></button>
      </div>
    </transition>
    <transition name="fast-fade">
      <div
        v-if="aboutOpen || submenuOpen"
        id="content-overlay"
      />
    </transition>
  </div>    
</template>

<script>
  import ProgressTimeline from './ProgressTimeline.vue'

  export default {
    name: 'menu-panel',
    components: {
      'progress-timeline': ProgressTimeline
    },
    props: {
      currentChapterIndex: Number
    },
    inject: {
      ExternalLinks: 'external-links'
    },
    data () {
      return {
        isFullscreen: document.fullscreenElement === null?false:true,
        submenuOpen: false,
        aboutOpen: false,
        confirmingRestart: false
      }
    },
    mounted() {
      document.onfullscreenchange = this.checkFullscreen
    },
    methods: {
      toggleSubmenu(forceClose) {
        this.submenuOpen = forceClose === true?false:!this.submenuOpen
        if (!this.submenuOpen) {
          this.confirmingRestart = false
        } else {
          this.aboutOpen = false
        }
      },
      toggleAbout() {
        this.submenuOpen = false
        this.aboutOpen = !this.aboutOpen
      },
      toggleFullscreen() {
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          document.getElementById('app').requestFullscreen()
        }
      },
      checkFullscreen() {
        this.isFullscreen = document.fullscreenElement === null?false:true
      },
      restartGame() {
        this.toggleSubmenu(true)
        this.$emit('restart-game')
      }
    }
  }
</script>

<style>

div#menu-panel {
  display: flex;
  justify-content: flex-start;
  column-gap: 1rem;
  align-items: center;

  padding: 0 1.5rem 0 1.2rem;
}

div#menu-panel > div.container {
  height: 100%;
  white-space: nowrap;
}

div#menu-panel > div#timeline-container { 
  flex-grow: 1;
  display: flex;
  align-items: center;
}

div#menu-panel h1 {
  font-size: 1;
  box-sizing: border-box;
  margin: 0;
  padding: 1.25rem 0;
  height: 100%;
  line-height: 0;
  
}

div#menu-panel h1 img {
  height: 100%;
}

div#menu-panel div#progress-timeline {
  transform: translateY(-.2rem)
}

menu#main {
  display: block;
  margin: 0;
  padding: 1rem 0;
  height: 100%;
  box-sizing: border-box;
}

div.menu-button { 
  display: inline-block;
  position: relative;
  top: -.1rem;
  padding: .65rem;
  height: 3rem;
  width: 3rem;
  margin-right: .5rem;
  border-radius: .5rem;
  background: var(--bg-button-menu);
  box-shadow: 0 .2rem 0 var(--c-button-menu-shadow);
  box-sizing: border-box;
  cursor: pointer;
}

div.menu-button::before {
  content: url("/assets/icons/icon-sizer.svg");
  height: 100%;
  width: 100%;
  display: block;
  background: var(--bg-button-menu-accent);
	mask-image: url("/assets/icons/icon-menu.svg");
  mask-size: 100% 100%;
	mask-repeat: no-repeat;
}

div.menu-button:hover, div#submenu-panel > button:hover, div#about-panel > button:hover {
  background: var(--bg-button-menu-hover);
  box-shadow: 0 .2rem 0 var(--c-button-menu-hover-shadow);
}

div.menu-button:active, div.menu-button.pressed, div#submenu-panel > button:active, div#submenu-panel > button.pressed,
div#about-panel > button:active {
  background: var(--bg-button-menu-hover);
  box-shadow: 0 0 0 var(--c-button-menu-hover-shadow);
  top: .1rem;
  transform: none;
}

div.menu-button#open-about::before { mask-image: url("/assets/icons/icon-info.svg"); }
div.menu-button#fullscreen::before { mask-image: url("/assets/icons/icon-fullscreen.svg"); }
div.menu-button.exit#fullscreen::before { mask-image: url("/assets/icons/icon-fullscreen-exit.svg"); }

/* Mini Tooltips */

div.menu-button::after {
  display: none;
  position: absolute;
  z-index: 300;
  top: 120%; left: 0;
	padding: .4rem .7rem .6rem;
	background-color: var(--c-tooltip);
	color: var(--c-tooltip-text);
	border-radius: .5rem;
	font-family: acumin-pro-condensed, sans-serif;
  font-weight: 600;
	font-size: 1.3rem;
	line-height: 1.25;
  white-space: nowrap;
}

div.menu-button:hover:not(.pressed)::after { display: block; }

div.menu-button#open-submenu::after { content: 'Menu'; }
div.menu-button#open-about::after { content: 'About'; }
div.menu-button#fullscreen::after { content: 'Full Screen'; }
div.menu-button.exit#fullscreen::after { content: 'Exit Full Screen'; }

/* Submenu and About */

div#content-overlay {
  z-index: 200;

  position: fixed; top: 5rem; right: 0; bottom: 0;
	left: calc(200px + 18%);
  background-color: var(--c-base);
  opacity: .9;
}

div#submenu-panel, div#about-panel {
  position: absolute; top: 110%; left: 0;
  z-index: 250;
  overflow: hidden;
  padding: 1rem;
  background-color: var(--c-over);
  border-radius: .7em;
  box-shadow: 0 0 .5rem rgba(0,0,0,.75);
}

div#submenu-panel {
  width: 25rem;
  height: auto; 
}

div#submenu-panel > button:last-child, div#about-panel > button:last-child {
  margin-bottom: .2rem;
}

div#submenu-panel > div:last-child, div#about-panel > div:last-child {
  margin-bottom: 0;
}

div#submenu-panel > button, div#about-panel > button {
  position: relative;
  color: var(--c-accent-5);
  background: var(--bg-button-menu);
  box-shadow: 0 .2rem 0 var(--c-button-menu-shadow); 
  transition: none;
}

div#submenu-panel > button::before, div#about-panel > button::before { background: var(--bg-button-menu-accent); }
div#submenu-panel > button.restart::before { mask-image: url("/assets/icons/icon-restart.svg"); }
div#submenu-panel > button.about::before { mask-image: url("/assets/icons/icon-info.svg"); }

div#restart-confirmation {
  margin-top: 0;
  margin-bottom: 0;
  text-align: right;
  font-size: .85em;
  box-sizing: border-box;
  overflow: hidden;
  max-height: 0;
  transition: max-height .2s ease-out, margin-top .2s ease-out, margin-bottom .2s ease-out;
}

div#restart-confirmation.open {
  margin-bottom: .5rem;
  max-height: 4rem;
}

div#restart-confirmation > button { margin-left: 1rem; }

div#menu-panel .info-frame {
  box-sizing: border-box;
  padding: 1.5rem 1rem;
  margin-top: 1.3rem;
  margin-bottom: 1rem;
  line-height: 1.4;
  text-align: center;
  border: .3rem solid var(--c-accent-1);
  border-radius: .3em;
}

div#menu-panel .info-frame img {
  width: 60%;
  margin-top: 1em;
}

div#menu-panel .info-frame p {
  margin-top: 0;
  margin-bottom: .75em;
}

div#menu-panel .info-frame :last-child { margin-bottom: 0; }

div#menu-panel .info-frame.credits {
  font-size: .75em;
}

div#about-panel {
  width: 35rem;
  text-align: center;
}

div#about-panel button.close::before {
  mask-image: url("/assets/icons/icon-x.svg");
}

div.logo-pair {
  display: flex;
  align-items: center;
  width: 90%;
  margin: 1rem auto 2rem;
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

div.logo-pair > div img, div#menu-panel div.info-frame div.logo-pair > div img {
  display: block;
  width: 100%;
}

div.logo-pair img.game-logo {
  transform: translateY(5%)
}

/* Vue Transitions */

.simple-fade-enter-active { transition: opacity .5s ease-out; }
.simple-fade-leave-active { transition: opacity .5s ease-out; }
.simple-fade-enter, .simple-fade-leave-to {
  opacity: 0;
}

.fast-fade-enter-active { transition: opacity .25s ease-out; }
.fast-fade-leave-active { transition: opacity .25s ease-out; }
.fast-fade-enter, .fast-fade-leave-to, #content-overlay.fast-fade-enter, #content-overlay.fast-fade-leave-to {
  opacity: 0;
}

</style>
