<template>
  <div :class="$style.item">
    <div :class="$style.title">
      <h2>{{ title }}</h2><span>{{subTitle}}</span>
    </div>
    <slot name="con"></slot>
  </div>
</template>

<script>
export default {
  name: 'intrItem',
  props: ['title', 'subTitle']
}
</script>

<style lang="stylus" module>
.item
  margin-bottom 20px
  &:after
    display table
    content ''
    clear both

.title
  margin 10px 0
  >h2
    color #000
    font-size 20px
    font-family simHei
    display inline
    margin-right 10px
</style>
