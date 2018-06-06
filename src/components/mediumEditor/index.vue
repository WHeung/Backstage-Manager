<template>
  <div :class="$style.main">
    <div :class="$style.toolBar" ref="toolBar"></div>
    <textarea ref="editor" :style="{maxHeight: winH * .6 + 'px' }" :class="$style.content"></textarea>
  </div>
</template>

<script>
import MediumEditor from 'medium-editor'
import FontSizeForm from '~src/tool/meditm-editor-extensions/fontsize'
import ImgForm from '~src/tool/meditm-editor-extensions/insertImg'
import ColorPicker from '~src/tool/meditm-editor-extensions/colorPicker'

export default {
  props: ['value'],
  data () {
    return {
      options: null,
      api: null
    }
  },
  computed: {
    winH () {
      return window.innerHeight
    }
  },
  mounted () {
    this.$refs.editor.innerHTML = this.value || ''
    this.options = {
      buttonLabels: 'fontawesome',
      activeButtonClass: this.$style.buttonActive,
      toolbar: {
        relativeContainer: this.$refs.toolBar,
        static: true,
        sticky: true,
        updateOnEmptySelection: true,
        align: 'left',
        firstButtonClass: 'medium-first-button',
        buttons: ['bold', 'italic', 'underline', 'strikethrough', 'justifyLeft', 'justifyCenter', 'justifyRight', 'insertImg', 'anchor', 'colorPicker']
      },
      placeholder: false,
      imageDragging: true,
      paste: {
        forcePlainText: false,
        cleanPastedHTML: true,
        cleanPaste: function (text) {
          var i, elList, tmp, workEl
          var multiline = /<p|<br|<div/.test(text)
          var replacements = [].concat(
            this.preCleanReplacements || [],
            createReplacements(),
            this.cleanReplacements || [])

          for (i = 0; i < replacements.length; i += 1) {
            text = text.replace(replacements[i][0], replacements[i][1])
          }

          if (!multiline) {
            return this.pasteHTML(text)
          }

          // create a temporary div to cleanup block elements
          tmp = this.document.createElement('div')

          // double br's aren't converted to p tags, but we want paragraphs.
          tmp.innerHTML = '<p>' + text.split('<br><br>').join('</p><p>') + '</p>'

          // block element cleanup
          elList = tmp.querySelectorAll('a,p,div,br')
          for (i = 0; i < elList.length; i += 1) {
            workEl = elList[i];
            console.log(workEl)
            // Microsoft Word replaces some spaces with newlines.
            // While newlines between block elements are meaningless, newlines within
            // elements are sometimes actually spaces.
            workEl.innerHTML = workEl.innerHTML.replace(/\n/gi, ' ')

            switch (workEl.nodeName.toLowerCase()) {
            case 'p':
            case 'div':
              filterCommonBlocks(workEl)
              break
            case 'br':
              this.filterLineBreak(workEl)
              break
            }
          }

          this.pasteHTML(tmp.innerHTML)
        },
        cleanAttrs: ['class', 'style', 'align'],
        cleanTags: ['meta']
      },
      extensions: {
        insertImg: new ImgForm(),
        fontSize: new FontSizeForm(),
        colorPicker: new ColorPicker()
      }
    }
    this.api = new MediumEditor(this.$refs.editor, this.options)
    this.api.subscribe('editableInput', (event) => {
      let content = this.api.getContent(0)
       // 在使用了colorPicker 之后，'underline', 'strikethrough' 按钮会使用text-decoration-line属性而不是默认的text-decoration属性，导致移动端该属性有可能不生效
      content = content.replace(/text-decoration-line/g, 'text-decoration')
      console.log(content)
      this.$emit('input', content)
    })
  }
}
function filterCommonBlocks (el) {
  console.log(el)
  if (/^\s*$/.test(el.textContent) && el.innerHTML.indexOf('<img') < 0 && el.parentNode) {
    el.parentNode.removeChild(el)
  }
}

function createReplacements () {
  return [
    // Remove anything but the contents within the BODY element
    [new RegExp(/^[\s\S]*<body[^>]*>\s*|\s*<\/body[^>]*>[\s\S]*$/g), ''],

    // cleanup comments added by Chrome when pasting html
    [new RegExp(/<!--StartFragment-->|<!--EndFragment-->/g), ''],

    // Trailing BR elements
    [new RegExp(/<br>$/i), ''],

    // replace two bogus tags that begin pastes from google docs
    [new RegExp(/<[^>]*docs-internal-guid[^>]*>/gi), ''],
    [new RegExp(/<\/b>(<br[^>]*>)?$/gi), ''],

      // un-html spaces and newlines inserted by OS X
    [new RegExp(/<span class="Apple-converted-space">\s+<\/span>/g), ' '],
    [new RegExp(/<br class="Apple-interchange-newline">/g), '<br>'],

    // replace google docs italics+bold with a span to be replaced once the html is inserted
    [new RegExp(/<span[^>]*(font-style:italic;font-weight:(bold|700)|font-weight:(bold|700);font-style:italic)[^>]*>/gi), '<span class="replace-with italic bold">'],

    // replace google docs italics with a span to be replaced once the html is inserted
    [new RegExp(/<span[^>]*font-style:italic[^>]*>/gi), '<span class="replace-with italic">'],

    //[replace google docs bolds with a span to be replaced once the html is inserted
    [new RegExp(/<span[^>]*font-weight:(bold|700)[^>]*>/gi), '<span class="replace-with bold">'],

      // replace manually entered b/i/a tags with real ones
    [new RegExp(/&lt;(\/?)(i|b|a)&gt;/gi), '<$1$2>'],

      // replace manually a tags with real ones, converting smart-quotes from google docs
    [new RegExp(/&lt;a(?:(?!href).)+href=(?:&quot;|&rdquo;|&ldquo;|"|“|”)(((?!&quot;|&rdquo;|&ldquo;|"|“|”).)*)(?:&quot;|&rdquo;|&ldquo;|"|“|”)(?:(?!&gt;).)*&gt;/gi), '<a href="$1">'],

    // Newlines between paragraphs in html have no syntactic value,
    // but then have a tendency to accidentally become additional paragraphs down the line
    [new RegExp(/<\/p>\n+/gi), '</p>'],
    [new RegExp(/\n+<p/gi), '<p'],

    // Microsoft Word makes these odd tags, like <o:p></o:p>
    [new RegExp(/<\/?o:[a-z]*>/gi), ''],

    // Microsoft Word adds some special elements around list items
    [new RegExp(/<!\[if !supportLists\]>(((?!<!).)*)<!\[endif]\>/gi), '$1']
  ]
}
</script>

<style lang="stylus">
.medium-editor-toolbar-select
  width 30%
  padding-left 5px
  margin 3px
  background: #fff
  border 1px solid #ddd

.medium-editor-toolbar li .medium-editor-action
  width 35px

.vanilla-color-picker
  display inline-block
  position absolute
  z-index 100
  padding 5px
  background-color #fff
  box-shadow 1px 1px 2px 1px rgba(0,0,0,0.3)

.vanilla-color-picker-single-color
  display inline-block
  width 20px
  height 20px
  margin 1px
  border-radius 2px


</style>

<style lang="stylus" module>

.toolBar
  position relative

.buttonActive
  outline hidden
  outline-color #C3B28E
  background #FFEA96
  border-radius 4px

.content
  overflow-y auto
  &::-webkit-scrollbar-track
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5;
  &::-webkit-scrollbar
    width: 6px;
    background-color: #F5F5F5;
  &::-webkit-scrollbar-thumb
	  background-color: #7f8d9d;
</style>
