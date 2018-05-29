<template>
  <div :class="$style.main">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-button @click="toExportInsurance" v-if="pType === 'INSURANCE'">去导出导入保单信息信息</el-button>
        <el-button @click="exportPassagers" v-if="pType === 'TRAVEL' || pType === 'VISA' || pType === 'PRESELL'">导出乘客信息</el-button>
        <el-button @click="exportPassagers" v-if="pType === 'TW_ENTRY_PERMIT'">导出申请人信息</el-button>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-select v-model="search.nameType">
          <el-option value="CONTACT" label="联系人"></el-option>
          <el-option value="PASSENGER" label="乘机人" v-if="pType !== 'TW_ENTRY_PERMIT'"></el-option>
          <el-option value="APPLICANT" label="申请人" v-if="pType === 'TW_ENTRY_PERMIT'"></el-option>
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
        <el-input v-model="search.sellId" placeholder="库存ID" v-if="pType !== 'TW_ENTRY_PERMIT'"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input v-model="search.title" placeholder="套餐标题" v-if="pType !== 'TW_ENTRY_PERMIT'"></el-input>
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
      <el-table-column type="selection" width="40" fixed="left"></el-table-column>
      <el-table-column label="标记" align="center">
        <template slot-scope="scope">
          <div :class="$style.markIcon" @click="toggleMark(scope.row)">
            <i class="el-icon-star-on" v-if="scope.row.orderMark === 'YES'"></i>
            <i class="el-icon-star-off" v-else></i>
          </div>
        </template>
      </el-table-column>
      <template v-if="pType !== 'TW_ENTRY_PERMIT'">
        <el-table-column prop="createTime" label="购买时间" width="113" sortable="custom"></el-table-column>
        <el-table-column prop="title" label="标题" width="200"></el-table-column>
        <el-table-column prop="tabTip" label="规格名称" width="120"></el-table-column>
        <el-table-column prop="departureTime" label="出发时间" width="113" v-if="pType==='TRAVEL'" sortable="custom"></el-table-column>
        <el-table-column prop="contactName" label="联系人" width="88"></el-table-column>
        <el-table-column prop="contactMobile" label="下单手机" width="120"></el-table-column>
        <el-table-column prop="pidCount" label="出行人数" width="65"></el-table-column>
        <!-- <el-table-column prop="totalPrice" label="订单金额" width="100"></el-table-column> -->
        <el-table-column prop="payAmount" :formatter="payAndCouponFormatter" label="实付（代金券）" width="95"></el-table-column>
        <el-table-column prop="statusStr" label="订单状态" width="80"></el-table-column>
        <el-table-column prop="orderId" label="订单号" width="200" sortable="custom"></el-table-column>
        <el-table-column prop="sellId" label="库存ID" width="108" sortable="custom"></el-table-column>
        <el-table-column prop="providerName" label="供应商"></el-table-column>
        <el-table-column prop="channelSource" label="订单渠道"></el-table-column>
      </template>
      <template v-if="pType === 'TW_ENTRY_PERMIT'">
        <el-table-column prop="createTime" label="支付时间" width="113" sortable="custom"></el-table-column>
        <el-table-column prop="contactMobile" label="下单手机" width="200"></el-table-column>
        <el-table-column prop="title" label="入台日期" width="113"></el-table-column>
        <el-table-column prop="contactName" label="联系人" width="113"></el-table-column>
        <el-table-column prop="contactMobile" label="联系手机" width="113"></el-table-column>
        <el-table-column prop="contactEmail" label="联系邮箱" width="113"></el-table-column>
        <el-table-column prop="pidCount" label="订单人数" width="113"></el-table-column>
        <el-table-column prop="payAmount" :formatter="payAndCouponFormatter" label="实付金额（代金券）" width="95"></el-table-column>
        <el-table-column prop="statusStr" label="订单状态" width="113"></el-table-column>
        <el-table-column prop="orderId" label="订单号" width="113"></el-table-column>
      </template>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button @click="goDetail(scope.row.orderId)" type="text" size="small">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, prev, pager, next"
      :page-size="search.page.size"
      :current-page="search.page.page"
      @current-change="changePagin"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import * as types from '~src/store/types'

export default {
  name: 'sales-order-list-content',
  data () {
    return {
      tableLoading: false,
      list: [],
      search: {
        orderId: '',
        sellId: '',
        title: '',
        contactMobile: '',
        status: '',
        productType: '',
        page: {
          page: 1,
          size: 20
        },
        name: '',
        nameType: 'CONTACT',
        sortBy: '',
        sortKey: ''
      },
      total: 0,
      statusOptions: [
        { name: '全部状态', value: '' },
        { name: '待支付', value: 'WAITPAY' },
        { name: '确认中', value: 'TICKETING' },
        { name: '确认成功', value: 'SUCCESS' },
        { name: '确认失败', value: 'FAIL' },
        { name: '取消', value: 'CANCELED' }
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
      return `${row.payAmount}(${row.couponPrice})`
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
      if (this.pType === 'TW_ENTRY_PERMIT') {
        this.$router.push({ path: '/visatw/detail', query: { id }})
      } else {
        this.$store.dispatch(types.UPDATE_SALES_ORDER_LIST_PTYPE, Object.assign({}, this.search)) // 跳转去详情页前缓存数据
        this.$router.push(`/sales/order/${id}`)
      }
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
      this.$store.dispatch(types.UPDATE_SALES_ORDER_LIST, this.search).then(res => {
        this.list = res.list
        this.total = res.total
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
