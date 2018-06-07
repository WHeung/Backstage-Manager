<template>
  <div :class="$style.main">
    <el-tabs v-model="tab" type="card">
      <el-tab-pane label="first-tab" name="ONE">
        <First></First>
      </el-tab-pane>
      <el-tab-pane label="second-tab" name="TWO">
        <Second></Second>
      </el-tab-pane>
      <el-tab-pane label="third-tab" name="THREE">
        <Three></Three>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as Types from '~src/store/types.js'
import First from './firstView.vue'
import Second from './secondView.vue'
import Three from './threeView.vue'

export default {
  name: 'tab-view',
  components: { First, Second, Three },
  data () {
    return {
      tab: 'ONE'
    }
  },
  created () {
    this.$store.commit(Types.SET_BREAD_NAV, ['功能模板', 'tab页'])
  }
}
</script>

<style lang="stylus" module>
.row
  margin-top 15px
</style>
