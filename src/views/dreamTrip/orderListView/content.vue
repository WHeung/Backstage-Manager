<template>
  <div :class="$style.main">
    <!-- <el-row :gutter="20">
      <el-col :span="4">
        <el-button @click="exportPassagers">导出</el-button>
      </el-col>
    </el-row> -->
    <el-row :gutter="20" :style="{marginTop: '20px'}">
      <el-col :span="4">
        <el-input v-model="search.orderId" placeholder="订单号"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input v-model="search.actOrderId" placeholder="原订单号"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input v-model="search.tradeNo" placeholder="交易号"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input v-model="search.nameOrMobile" placeholder="出行人或联系手机"></el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20" :style="{marginTop: '10px'}">
      <el-col :span="4">
        <el-input v-model="search.title" placeholder="标题"></el-input>
      </el-col>
      <el-col :span="4">
        <el-select v-model="search.status" :clearable="true" placeholder="预约状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="search.tuniuOrderStatus" :clearable="true" placeholder="途牛下单情况">
          <el-option
            v-for="item in tuniuOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="resetPageRequest">搜索</el-button>
      </el-col>
    </el-row>
    <el-table :data="list" :class="$style.table" border stripe @selection-change="selectionChange" @sort-change="sortChange" v-loading="tableLoading">
      <!-- <el-table-column type="selection" width="40" fixed="left"></el-table-column> -->
      <el-table-column prop="orderId" label="订单号"></el-table-column>
      <el-table-column prop="actOrderId" label="原订单号"></el-table-column>
      <el-table-column prop="tradeNo" label="原交易号"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="createTime" label="预定时间"></el-table-column>
      <el-table-column prop="statusName" label="预约状态"></el-table-column>
      <el-table-column prop="contactName" label="出行人"></el-table-column>
      <el-table-column prop="psgCredentialType" label="出行人证件"></el-table-column>
      <el-table-column prop="psgCredentialNo" label="出行人证件号"></el-table-column>
      <el-table-column prop="psgNation" label="国籍"></el-table-column>
      <el-table-column prop="fromLoc" label="出发地"></el-table-column>
      <el-table-column prop="toLoc" label="目的地"></el-table-column>
      <el-table-column prop="goDate" label="出发日期"></el-table-column>
      <el-table-column prop="backDate" label="返程日期"></el-table-column>
      <el-table-column prop="goFlightNo" label="去程航班号"></el-table-column>
      <el-table-column prop="backFlightNo" label="返程航班号"></el-table-column>
      <el-table-column prop="contactMobile" label="联系电话"></el-table-column>
      <el-table-column prop="contactEmail" label="联系邮箱"></el-table-column>
      <el-table-column prop="tuniu" label="途牛下单情况"></el-table-column>
      <el-table-column label="操作" width="130" fixed="right">
        <template slot-scope="scope">
          <el-select
          value="" @input="(val) => {changeStatus(val, scope.row)}"
          placeholder="修改状态" size="mini">
            <el-option
              v-for="item in changeStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              :disabled="item.value === scope.row.status || scope.row.status === 'FAIL'">
            </el-option>
          </el-select>
          <br>
          <!-- <el-button @click="goDetail(scope.row.orderId)" type="text" size="small">途牛自动出票</el-button> -->
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
import CallApi from '~src/store/api'

export default {
  name: 'sales-order-list-content',
  data () {
    return {
      tableLoading: false,
      list: [],
      search: {
        orderId: '',
        actOrderId: '',
        tradeNo: '',
        nameOrMobile: '',
        title: '',
        status: '',
        sortBy: '',
        sortKey: '',
        page: {
          page: 1,
          size: 20
        }
      },
      total: 0,
      statusName: {
        NEW: '新建',
        WAITPAY: '等待支付',
        SUCCESS: '确认成功',
        FAIL: '确认失败',
        CANCELED: '取消',
        EXPIRED: '超时',
        PAID: '确认中',
        TICKETING: '出票中'
      },
      tuniuName: {
        YES: '下单成功',
        NO: '下单失败'
      },
      tuniuOptions: [
        { name: '下单成功', value: 'YES' },
        { name: '无或失败', value: 'NO' }
      ],
      statusOptions: [
        { name: '确认中', value: 'PAID' },
        { name: '确认成功', value: 'SUCCESS' },
        { name: '确认失败', value: 'FAIL' }
      ],
      changeStatusOptions: [
        { name: '确认成功', value: 'SUCCESS' },
        { name: '确认失败', value: 'FAIL' }
      ],
      selectStatus: '',
      selection: []
    }
  },
  props: ['pType'],
  created () {
    this.request()
  },
  methods: {
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
    },
    changeStatus (val, row) {
      const option = this.changeStatusOptions.find(item => {
        return item.value === val
      })
      const msgVNode = this.$createElement('span', null, ['此操作将 ', this.$createElement('span', { style: 'color: #20a0ff;' }, option.name), ` 订单${row.orderId}, 是否继续?`])
      this.$confirm(msgVNode, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        CallApi(types.FETCH_DREAM_TRIP_ORDER_STATUS_UPDATE, { status: val, orderId: row.orderId }).then(() => {
          this.$message.success('修改成功')
          this.request()
        }).catch(codeResult => {
          this.$message.error('修改失败，请重试')
        })
      }).catch(() => {})
    },
    selectionChange (val) {
      const arr = val.map(item => { return item.orderId })
      this.selection = arr
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
    resetPageRequest () {
      this.search.page.page = 1
      this.request()
    },
    request () {
      if (this.tableLoading) {
        return
      }
      this.tableLoading = true
      CallApi(types.FETCH_DREAM_TRIP_ORDER_LIST, this.search).then(res => {
        const pageInfo = res.data.data.pageInfo
        pageInfo.data.forEach(item => {
          item.statusName = this.statusName[item.status]
          item.tuniu = item.tuniuOrderStatus ? this.tuniuName[item.tuniuOrderStatus] : '无'
        })
        this.list = pageInfo.data
        this.total = pageInfo.total
        this.tableLoading = false
      })
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
