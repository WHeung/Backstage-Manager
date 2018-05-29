<template>
  <div :class="$style.main">
    <el-row :gutter="20">
      <el-col :span="4">
        <!-- <el-button @click="exportPassagers">导出申请人信息</el-button> -->
      </el-col>
      <el-col :span="3" :offset="1">
        <el-select v-model="search.personType">
          <el-option value="0" label="联系人"></el-option>
          <el-option value="1" label="申请人"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input v-model="search.name" placeholder="姓名"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input v-model="search.contactMobile" placeholder="下单手机"></el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20" :style="{marginTop: '20px'}">
      <el-col :span="4">
        <el-input v-model="search.orderId" placeholder="订单号"></el-input>
      </el-col>
      <el-col :span="4">
        <el-select v-model="search.status" placeholder="全部状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-button type="primary" @click="resetPageRequest">搜索</el-button>
    </el-row>
    <el-table :data="list" :class="$style.table" border stripe @selection-change="selectionChange" @sort-change="sortChange" v-loading="tableLoading">
      <!-- <el-table-column type="selection" width="40" fixed="left"></el-table-column> -->
      <el-table-column label="标记" align="center">
        <template slot-scope="scope">
          <div :class="$style.markIcon" @click="toggleMark(scope.row)">
            <i class="el-icon-star-on" v-if="scope.row.orderMark === 'YES'"></i>
            <i class="el-icon-star-off" v-else></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="lockTime" label="支付时间" width="113"></el-table-column>
      <el-table-column prop="emPhone" label="下单手机" width="113"></el-table-column>
      <el-table-column prop="entryDate" label="入台日期" width="113"></el-table-column>
      <el-table-column prop="contactName" label="联系人" width="113"></el-table-column>
      <el-table-column prop="contactMobile" label="联系手机" width="113"></el-table-column>
      <el-table-column prop="contactEmail" label="联系邮箱" width="113"></el-table-column>
      <el-table-column prop="adultsCount" label="订单人数" width="90"></el-table-column>
      <el-table-column prop="passType" label="套餐类型" width="90"></el-table-column>
      <el-table-column prop="payAmount" :formatter="payAndCouponFormatter" label="实付金额（代金券）" width="95"></el-table-column>
      <el-table-column prop="statusStr" label="订单状态" width="113"></el-table-column>
      <el-table-column prop="orderId" label="订单号" width="113"></el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button @click="goDetail(scope.row.orderId)" type="text" size="small">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, prev, pager, next"
      :page-size="20"
      :current-page="curPage"
      @current-change="changePagin"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import * as types from '~src/store/types'
import CallApi from '~src/store/api'

export default {
  name: 'sales-order-list-content',
  data () {
    return {
      tableLoading: false,
      list: [],
      search: {
        orderId: '',
        childOrderId: '',
        personType: '0',
        phone: '',
        name: '',
        status: '',
        productType: '',
        page: {
          page: 1,
          size: 20
        },
        sortBy: '',
        sortKey: ''
      },
      curPage: 1,
      total: 0,
      statusOptions: [
        { name: '全部状态', value: '' },
        { name: '确认中', value: 'TICKETING' },
        { name: '已送供应商', value: 'SENTAWAY' },
        { name: '审核失败，待重新提交', value: 'BACKAUDIT' },
        { name: '确认成功', value: 'SUCCESS' },
        { name: '确认失败', value: 'FAIL' }
      ],
      selection: []
    }
  },
  props: ['pType'],
  created () {
    this.search.productType = this.pType
    const searchCache = this.$store.state.salesOrder.searchCache
    if (this.pType === searchCache.productType) {
      Object.assign(this.search, searchCache)
    }
    this.request()
    // this.oldSearch = Object.assign({}, this.search)
    // this.$store.dispatch(types.UPDATE_SALES_ORDER_LIST, Object.assign({}, this.search))
  },
  methods: {
    selectionChange (val) {
      const arr = val.map(item => { return item.orderId })
      this.selection = arr
    },
    toExportInsurance () {
      window.location.href = '/event/sell/insurance/orders'
    },
    exportPassagers () {
      if (typeof this.selection === 'object' && this.selection.length > 0) {
        this.$store.dispatch(types.EXPORT_SALES_ORDER_LIST, this.selection)
      }
    },
    changePagin (val) {
      this.search.page.page = val
      this.request()
    },
    payAndCouponFormatter (row) {
      return `${row.payAmount}(${row.couponPrice || 0})`
    },
    toggleMark (row) {
      const data = {
        orderId: row.orderId,
        orderMark: row.orderMark === 'YES' ? 'NO' : 'YES'
      }
      this.$confirm(`此操作将${data.orderMark === 'NO' ? '取消' : ''}标记订单${data.orderId}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch(types.UPDATE_SALES_ORDER_MARK, data).then(() => {
          this.$message.success('修改成功')
          this.request()
        }).catch(() => {
          this.$message.error('修改失败，请重试')
        })
      }).catch(() => {})
    },
    goDetail (id) {
      this.$router.push({ path: '/visatw/detail', query: { id }})
    },
    resetPageRequest () {
      this.search.page.page = 1
      this.request()
    },
    request () {
      if (this.tableLoading) {
        return
      }
      this.tableLoading = true
      CallApi(types.FETCH_SALES_TW_ORDER_LIST, { conditions: this.search, curPage: this.curPage }).then(res => {
        const data = res.data.data.pageInfo
        this.curPage = data.curPage
        this.list = data.meixiaTwpassOrders
        this.total = data.totalCount
        this.tableLoading = false
      })
    },
    sortChange (data) {
      if (data.prop && data.order) {
        let sortByName
        switch (data.prop) {
        case 'createTime':
          sortByName = 'buyTime'
          break
        case 'sellId':
          sortByName = 'id'
          break
        default:
          sortByName = data.prop
        }
        this.search.sortBy = sortByName
        this.search.sortKey = data.order === 'ascending' ? 'asc' : 'desc'
        this.resetPageRequest()
      }
    }
  }
}
</script>

<style lang="stylus" module>
.table
  width 100%
  margin-top 20px

.markIcon i
  cursor pointer
</style>
