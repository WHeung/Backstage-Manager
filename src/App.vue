<template>
  <div :class="$style.main">
    <topNav></topNav>
    <div :class="$style.wrap">
      <leftNav :class="$style.leftNav"></leftNav>
      <div :class="$style.rightContent">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item v-for="(item, index) in breadNavList" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <router-view :class="$style.routeView"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import leftNav from './components/leftNav/index.vue'
import topNav from './components/topNav/index.vue'
import * as Types from '~src/store/types.js'

export default {
  name: 'app',
  components: { leftNav, topNav },
  computed: {
    breadNavList () {
      return this.$store.state.breadNavList
    }
  }
}
</script>
<style lang="stylus">
body,
html
  font-family tahoma,arial,'Hiragino Sans GB','\5b8b\4f53',sans-serif
  background-color #fff
  margin 0
  padding 0
  height 100%
  overflow hidden

body, div, ul, ol, li, h1, h2, h3, h4, h5, h6, form, fieldset, input, textarea, p, blockquote, th, td
  margin 0
  padding 0

h1, h2, h3, h4
  color #5e6d82
h2
  font-size 18px
h3
  font-size 16px
h4
  font-size 14px

body .el-table
  font-size 13px
  color #393939

input,select,button
  vertical-align middle
  border none
  background none


</style>
<style lang="stylus" module>
.main
  height 100%

.wrap
  padding-top 45px
  display flex
  height 100%
  box-sizing border-box

.leftNav
  background-color #f2f2f2
  width 190px
  min-width 184px
  border-right 1px solid #ccc
  height 100%
  overflow-x hidden
  overflow-y auto
  &::-webkit-scrollbar
    width 8px
  &::-webkit-scrollbar-track
    -webkit-box-shadow: inset 0 0 3px rgba(0,0,0,0.1);
    background-color #e7e7e7
  &::-webkit-scrollbar-thumb
  	background-color: #bbd4e5
  	background-image: -webkit-gradient(linear, 0 0, 0 100%, color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.5, transparent), to(transparent))

.rightContent
  padding 8px 20px 24px
  min-width 850px
  flex-grow 1
  overflow auto

.routeView
  margin 20px 0
</style>

