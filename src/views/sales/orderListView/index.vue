<template>
  <div :class="$style.main">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>特卖平台库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>特卖订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-route">
      <el-tabs v-model="productType" type="card">
        <el-tab-pane label="旅游产品" name="TRAVEL">
          <listContent pType="TRAVEL"></listContent>
        </el-tab-pane>
        <el-tab-pane label="签证产品" name="VISA">
          <listContent pType="VISA"></listContent>
        </el-tab-pane>
        <el-tab-pane label="保险产品" name="INSURANCE">
          <listContent pType="INSURANCE"></listContent>
        </el-tab-pane>
        <el-tab-pane label="入台证" name="TW_ENTRY_PERMIT">
          <twContent pType="TW_ENTRY_PERMIT"></twContent>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import * as types from '~src/store/types'
import listContent from './content.vue'
import twContent from './twContent.vue'

export default {
  name: 'sales-order-list-view',
  data () {
    return {
    }
  },
  computed: {
    productType: {
      get () {
        return this.$store.state.salesOrder.searchCache.productType
      },
      set (val) {
        this.$store.dispatch(types.UPDATE_SALES_ORDER_LIST_PTYPE, { productType: val })
      }
    }
  },
  components: { listContent, twContent }
}
</script>

<style lang="stylus" module>
.table
  width 100%
  margin-top 20px
</style>
