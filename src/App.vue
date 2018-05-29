<template>
  <div class="dwf-wrap">
    <topNav></topNav>
    <div class="content-wrap">
      <leftNav class="left-nav"></leftNav>
      <div class="right-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import leftNav from './components/leftNav/index.vue'
  import topNav from './components/topNav/index.vue'

console.log(leftNav)
  export default {
    name: 'app',
    components: {
      leftNav, topNav
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

.dwf-wrap
  height 100%

.content-wrap
  padding-top 45px
  display flex
  height 100%
  box-sizing border-box

.left-nav
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

.right-content
  padding 8px 20px 24px
  min-width 850px
  flex-grow 1
  overflow auto

.page-route
  margin 20px 0

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
