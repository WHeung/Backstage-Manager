<template>
  <div :class="$style.line">{{title}}</div>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style lang="stylus" module>
.line
  font-family 'Arial-BoldMT', 'Arial Bold', 'Arial'
  font-weight 700
  font-style normal
  font-size 16px
  color #0000CC
  margin 20px 0
  padding 0 20px 0
  line-height 2px
  border-left 300px solid #0000CC
  border-right 300px solid #0000CC
  text-align center
</style>
