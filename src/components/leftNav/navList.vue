<template>
  <el-submenu :class="$style.elSubmenu" :index="String(index)">
    <template slot="title"><span class="elSubmenuTitle"><i class="fa fa-cogs"></i>{{itemList.name}}</span></template>
    <el-menu-item :class="$style.elMenuItem" :index="String(item.id)" v-for="(item,index) in itemList.children" :key="index">{{item.name}}</el-menu-item>
  </el-submenu>
</template>
<script>
export default{
  data () {
    return {}
  },
  props: ['itemList', 'index']
}
</script>
<style lang="stylus" scoped>
.el-menu-item.is-active:after
  content ""
  display block
  position absolute
  z-index 7
  width 0
  left 17px
  top 16px
  border 4px solid transparent
  border-left 4px solid #c86139 !important

.el-submenu.is-active
  position relative
  &:not(.is-opened):before
    display block
    content ""
    position absolute
    right 0
    top 4px
    border 8px solid transparent
    border-width 14px 8px
    border-right-color #2b7dbc
    z-index 1
  &:after
    display block
    content ""
    position absolute
    right -2px
    top -1px
    bottom 0
    z-index 1
    border-right 2px solid #2b7dbc
  .elSubmenuTitle
    color #2b7dbc

.elSubmenuTitle i
  display inline-block
  margin-right 5px
  vertical-align sub
  text-align center
  font-size 18px
  font-weight normal

</style>
<style lang="stylus" module>
body
  .elSubmenu
    border-bottom 1px solid #e5e5e5
    >div
      height 40px
      line-height 40px
      font-size 13px
      border-left 3px solid transparent
      padding-left 13px !important
      &:hover
        color #2b7dbc
        background-color #fff
        border-left 3px solid #428bca
    .elMenuItem
      border-top 1px solid #f1f5f9
      font-size 13px
      background-color #fff
      height 38px
      line-height 38px
      &:hover
        background-color #f1f5f9
        color #4b88b7
        &:after
          content ""
          display block
          position absolute
          z-index 7
          width 0
          left 17px
          top 16px
          border 4px solid transparent
          border-left 4px solid #4b88b7
      &:before
        content ""
        display block
        position absolute
        z-index 1
        left 18px
        top 0
        bottom 0
        border-left 1px dotted #9dbdd6

      &:after
        content ""
        display block
        width 7px
        position absolute
        z-index 1
        left 20px
        top 17px
        border-top 1px dotted #9dbdd6
</style>
