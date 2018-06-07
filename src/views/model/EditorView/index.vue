<template>
  <div :class="$style.main">
    <Editor :class="$style.editor" v-model="editData1"></Editor>
    <Editor :class="$style.editor" v-model="editData2"></Editor>
  </div>
</template>

<script>
import * as Types from '~src/store/types.js'
import Editor from '~src/components/mediumEditor/index.vue'

export default {
  name: 'editor-view',
  components: { Editor },
  data () {
    return {
      editData1: '',
      editData2: ''
    }
  },
  created () {
    this.$store.commit(Types.SET_BREAD_NAV, ['功能模板', '富文本'])
  }
}
</script>

<style lang="stylus" module>
.main
  display flex
  justify-content space-around
.editor
  flex 0 0 40%
</style>
