<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>特卖平台库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>普通库存</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-route">
      <el-tabs v-model="type" type="card">
        <el-tab-pane label="已上架产品" name="ON_SELL">
          <tabContent type="ON_SELL"></tabContent>
        </el-tab-pane>
        <el-tab-pane label="已下架产品" name="OFF_SELL">
          <tabContent type="OFF_SELL"></tabContent>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import * as types from '~src/store/types'
import tabContent from './tabContent.vue'

export default {
  created () {
    if (this.$route.params.type) {
      this.$store.dispatch(types.UPDATE_SALES_LIST_TYPE, { type: this.$route.params.type })
    }
  },
  computed: {
    type: {
      get () {
        return this.$store.state.sales.searchCache.status
      },
      set (val) {
        this.$store.dispatch(types.UPDATE_SALES_LIST_TYPE, { status: val })
      }
    }
  },
  components: { tabContent }
}
</script>
