<template>
  <div :class="$style.topNav">
    <div :class="$style.title">
      <i class="fa fa-leaf"></i>
      后台管理{{showTest}}
    </div>
    <div :class="$style.user">
      <el-dropdown :class="$style.elDropdown" trigger="click" @command="handleCommand">
        <span>
          欢迎光临<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu :class="$style.elDropdownMenu" slot="dropdown">
          <el-dropdown-item command="/user/modifyPwd"><i class="el-icon-setting"></i>修改密码</el-dropdown-item>
          <el-dropdown-item command="/user/userInfo"><i class="el-icon-edit"></i>个人资料</el-dropdown-item>
          <el-dropdown-item command="/logout" divided><i class="el-icon-minus"></i>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showTest: ''
    }
  },
  created () {
    this.showTest = window.location.host === 'testadmin.dwfei.com' ? '（测试）' : ''
  },
  methods: {
    handleCommand (command) {
      window.location.href = command
    }
  }
}
</script>

<style lang="stylus" module>
.topNav
  position fixed
  top 0
  left 0
  right 0
  z-index 100
  min-height 45px
  background #438eb9
  padding 0 20px
  display flex
  justify-content space-between

.title
  color #fff
  font-size 22px
  line-height 45px
  font-family simHei

.svg
  vertical-align text-bottom

.user
  width 142px
  height 45px
  line-height 45px
  box-sizing border-box
  cursor pointer
  text-align right
  background #62a8d1
  &:hover
    background #579ec8
  .elDropdown
    color #fff
    font-size 13px
    display block
    >span
      padding 0 20px
      display block

body .elDropdownMenu
  font-size 13px
  width 142px
  i
    margin-right 5px
</style>
