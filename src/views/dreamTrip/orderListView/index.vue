<template>
  <div :class="$style.main">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>888订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>888订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-route">
      <el-tabs v-model="type" type="card">
        <!-- <el-tab-pane label="888原订单" name="TRAVEL">
          <listContent pType="TRAVEL"></listContent>
        </el-tab-pane> -->
        <el-tab-pane label="预约订单管理" name="appoint">
          <listContent></listContent>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import * as types from '~src/store/types'
import listContent from './content.vue'

export default {
  name: 'sales-order-list-view',
  data () {
    return {
      type: 'appoint'
    }
  },
  computed: {
  },
  components: { listContent }
}
</script>

<style lang="stylus" module>
.table
  width 100%
  margin-top 20px
</style>
