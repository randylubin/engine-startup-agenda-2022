<template>
  <div id="menu-panel">
    <div id="button-container">
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
    <div id="timeline-container">
      <transition name="timeline">
        <progress-timeline
          v-if="currentChapterIndex > 0"
          :currentChapterIndex="currentChapterIndex"
        />
      </transition>
    </div>
    <div id="logo-container">
      <h1>
        <img src="/assets/game-logo.svg" alt="Founder's Quest" />
      </h1>
    </div>

    <div 
      v-if="submenuOpen"
      id="submenu-panel"
    ></div>
    <div
      v-if="aboutOpen"
      id="about-panel"
    ></div>
    <div
      v-if="aboutOpen || submenuOpen"
      id="content-overlay"
    />
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
    data () {
      return {
        isFullscreen: document.fullscreenElement === null?false:true,
        submenuOpen: false,
        aboutOpen: false
      }
    },
    mounted() {
      document.onfullscreenchange = this.checkFullscreen
    },
    methods: {
      toggleSubmenu() {
        this.aboutOpen = false
        this.submenuOpen = !this.submenuOpen
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
      }
    }
  }
</script>

<style>

div#menu-panel {
  display: flex;
  justify-content: flex-start;
  column-gap: 2rem;
  align-items: center;

  padding: 0 1.5rem 0 1.2rem;
}

div#menu-panel > div {
  height: 100%;
}

div#menu-panel > div#timeline-container { 
  flex-grow: 1;
  display: flex;
  align-items: center;
}

div#menu-panel h1 {
  font-size: 1;
  box-sizing: border-box;
  margin: 0 0 0 2.5rem;
  padding: 1.25rem 0;
  height: 100%;
  line-height: 0;
  
}

div#menu-panel h1 img {
  height: 100%;
  transform: translateY(4%);
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
  content: url("/assets/icons/icon-spacer.svg");
  height: 100%;
  width: 100%;
  display: block;
  background: var(--bg-button-menu-accent);
	mask-image: url("/assets/icons/icon-menu.svg");
  mask-size: 100% 100%;
	mask-repeat: no-repeat;
}

div.menu-button:hover {
  background: var(--bg-button-menu-hover);
  box-shadow: 0 .2rem 0 var(--c-button-menu-hover-shadow);
}

div.menu-button:active, div.menu-button.pressed {
  background: var(--bg-button-menu-hover);
  box-shadow: 0 0 0 var(--c-button-menu-hover-shadow);
  top: .1rem;
}

div.menu-button#open-about::before { mask-image: url("/assets/icons/icon-info.svg"); }
div.menu-button#fullscreen::before { mask-image: url("/assets/icons/icon-fullscreen.svg"); }
div.menu-button.exit#fullscreen::before { mask-image: url("/assets/icons/icon-fullscreen-exit.svg"); }

/* Mini Tooltips */

div.menu-button::after {
  display: none;
  position: absolute;
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


/* Vue Transitions */



.timeline-enter-active { transition: opacity .5s ease-out; }
.timeline-leave-active { transition: opacity .5s ease-out; }
.timeline-enter, .timeline-leave-to {
  opacity: 0;
}

</style>
