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
    this.roundTickWidths();
    window.addEventListener('resize', this.roundTickWidths);
  },
  methods: {
    roundTickWidths() {
      console.log("resizing")
      this.$refs.timelineElement.style.removeProperty('--tick-width')
      const computedWidth = parseInt(window.getComputedStyle(document.querySelector('#progress-timeline .chapter')).getPropertyValue('width'))
      this.$refs.timelineElement.style.setProperty('--tick-width',Math.round(computedWidth) + "px")
    }
  }
}
</script>

<style>

div#progress-timeline {
  display: inline-block;
  justify-content: space-between;
  align-items: center;

  position: absolute; right: 0; top: 0;

  box-sizing: border-box;
  padding: .2em .75em .4em;
  background: var(--bg-timeline);
  border-bottom-left-radius: .5em;
  box-shadow: var(--sh-timeline);

  --tick-width: .2em;
}

div#progress-timeline > label {
  display: inline-block;
  margin-right: 1.25em;

  font-size: .7em;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--c-timeline);
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