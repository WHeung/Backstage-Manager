<template>
  <div :class="$style.item">
    <div :class="[$style.tit, titClass]">
      <label>{{ title }}</label>
      <i :class="$style.noBlank" v-if="noblank">*</i>
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
    color #9b9b9b
    vertical-align top

.noBlank
  display inline-block
  vertical-align top
  height 36px
  line-height 36px
  width 6px
  background no-repeat center center
  background-image url('~public/xinghao@3x.png')
  background-size 6px
  margin-left 5px
  font-style normal
  overflow hidden
  text-indent -100px

.con
  flex 1 1 auto
  padding-right 20px
  font-size 15px
  color #675f6d
  padding-left 10px

</style>
