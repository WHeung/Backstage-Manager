<template>
  <div :class="$style.item">
    <div :class="[$style.tit, titClass]">
      <i :class="$style.noBlank" v-if="noblank">*</i>
      <label>{{ title }}</label>
    </div>
    <div :class="$style.con">
      <slot name="con"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'item',
  props: ['noblank', 'title', 'titClass']
}
</script>

<style lang="stylus" module>
.item
  background-color #ffffff
  min-height 36px
  line-height 36px
  padding-left 20px
  display flex

.tit
  width 100px
  flex 0 0 auto
  text-align right
  label
    display inline-block
    height 36px
    line-height 36px
    font-size 15px
    color #606266
    vertical-align top

.noBlank
  vertical-align top
  width 6px
  color red
  font-size 12px

.con
  flex 1 1 auto
  padding-right 20px
  font-size 15px
  color #421515
  padding-left 10px

</style>
