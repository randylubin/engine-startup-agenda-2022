<template>
<div id="progress-timeline" ref="timelineElement">
  <label>Progress</label>
  <template v-for="(item,i) in DilemmaCompiler">
    <div 
      :key="'chapter-'+i"
      :class="{
        'chapter': true, 
        'past': i < currentChapterIndex, 
        'current': i == currentChapterIndex, 
        ...item.flags.reduce((obj, flag) => ({ ...obj, [flag]: true}), {})
      }"
    ></div>
    <div :key="'spacer-'+i" class="spacer" v-if="i < DilemmaCompiler.length-1"></div>
  </template>
</div>
</template>

<script>
export default {
  name: 'progress-timeline',
  props: {
    currentChapterIndex: Number,
  },
  inject: {
		DilemmaCompiler: 'dilemma-compiler'
	},
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
    this.roundTickWidths()
    window.addEventListener('resize', this.roundTickWidths)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.roundTickWidths)
  },
  methods: {
    roundTickWidths() {
      this.$refs.timelineElement.style.removeProperty('--tick-width')
      const computedWidth = parseInt(window.getComputedStyle(document.querySelector('#progress-timeline .chapter')).getPropertyValue('width'))
      this.$refs.timelineElement.style.setProperty('--tick-width',Math.round(computedWidth) + 'px')
    }
  }
}
</script>

<style>

div#progress-timeline {
  display: inline-block;
  box-sizing: border-box;
  padding: 0.2em .7em .45em;
  font-size: 1.1em;
  line-height: 1;
  background: var(--bg-timeline);
  border-radius: .75rem;
  box-shadow: var(--sh-timeline);

  --tick-width: .15em;
}

div#progress-timeline > label {
  display: inline-block;
  margin-right: 1.25em;

  font-size: .7em;
  font-weight: 800;
  line-height: 1;
  text-transform: uppercase;
  color: var(--c-timeline);
  text-shadow: var(--sh-timeline-text);
}

@media (max-width: 1169px) {
  div#progress-timeline > label {
    display: none;
  }
}

div#progress-timeline > div {
  display: inline-block;
  vertical-align: middle;
  height: .5em;
  width: var(--tick-width);

  transition: background-color .5s;
}

div#progress-timeline > div.milestone {
  height: .75em;
}

div#progress-timeline > div.hidden, div#progress-timeline > div.hidden+div.spacer {
  display: none;
}

div.chapter {
  background: var(--bg-tl-chapter);
  border-radius: .05em;
}

div.spacer {
  background: var(--bg-tl-spacer);
}

div.chapter.current { background: var(--bg-tl-chapter-current); }
div.chapter.past { background: var(--bg-tl-chapter-past); }

</style>