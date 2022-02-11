<template>
  <div class="issue-note" v-if="Note">
    <a :href="ExternalLinks.Engine" class="engine-link"></a>
    <div class="note-content">
      <p v-html="Note.text"></p>
      <p class="cta">
        {{Note.cta}}
        <a :href="Note.url" v-html="Note.link" class="external" target="_blank"></a>
      </p>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'issue-note',
    components: {
    },
    props: {
      noteKey: String
    },
    inject: {
      ExternalLinks: 'external-links',
      NoteIndex: 'note-index'
    },
    data () {
      return {
        Note: {
          text: this.NoteIndex[this.noteKey].text,
          cta: this.NoteIndex[this.noteKey].cta,
          link: this.NoteIndex[this.noteKey].link,
          url: this.ExternalLinks[this.NoteIndex[this.noteKey].url]
        }
      }
    }
  }

</script>

<style>

div.issue-note {
	display: flex;
	font-family: acumin-pro-condensed, sans-serif;
	font-size: .75em;
	box-sizing: border-box;
	padding: 1.2em 1.5em 1.5em;
	margin-bottom: 1.5em;
	border: .2rem solid var(--c-issue-border);
	border-radius: 1rem;
}

div.issue-note > a.engine-link {
	display: block;
	background-image: url("/assets/logo-engine.png");
	background-size: 100% auto;
	background-repeat: no-repeat;
	background-origin: content-box;
	background-position: center;

	box-sizing: border-box;
	width: 35%;
	min-width: 130px;
	padding-right: 1.5em;
	margin-right: 1.5em;
	border-right: .2rem solid var(--c-over);
}

div.founder-profile div.issue-note {
	font-size: .7em;
	padding: .9em 1.2em;
}

div.founder-profile div.issue-note div.note-content {
	order: 1;
}

div.founder-profile div.issue-note > a.engine-link {
	order: 2;
	width: 25%;
	padding-right: 0;
	padding-left: 1.5em;
	margin-right: 0;
	margin-left: 1.5em;
	border-right: none;
	border-left: .2rem solid var(--c-over);
}

div.issue-note p { margin-top: 0; }
div.issue-note p:last-child { margin-bottom: 0; }
div.issue-note p.cta { font-weight: bolder; }

</style>