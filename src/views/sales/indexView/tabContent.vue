<template>
  <div :class="$style.main">
    <div :class="$style.stockHandle">
      <div :class="{[$style.hidden]: type==='OFF_SELL'}">
        <el-button @click="toRouter({ pType: 'TRAVEL' })">新增旅游产品库存</el-button>
        <el-button @click="toRouter({ pType: 'VISA' })">新增签证库存</el-button>
        <el-button @click="toRouter({ pType: 'INSURANCE' })">新增保险库存</el-button>
      </div>
      <div :class="$style.stockSearch">
        <div :class="$style.elInput">
          <el-input ref="search" max="10" placeholder="搜素库存ID或标题" v-model="search" >
            <i class="el-input__icon el-icon-search" slot="suffix" @click="searchData"></i>
          </el-input>
        </div>
      </div>
    </div>
    <div :class="$style.buttonGroup">
      <el-button size="small" @click="selectionStatusChange('OFF_SELL')" v-if="type === 'ON_SELL'">手动下架</el-button>
      <el-button size="small" @click="selectionStatusChange('ON_SELL')" v-if="type === 'OFF_SELL'">上架</el-button>
    </div>
    <sales-table :type="this.type" :info="info" v-loading="tableLoading"
      @sellStatusChange="sellStatusChange" @toEdit="toRouter" @selectChange="handleSelectChagne" @refresh="requestTable"></sales-table>
    <div :class="$style.pagination">
      <span v-if="this.pagination.total">共 {{this.pagination.total}} 条</span>&nbsp;
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-size="15" layout="prev, pager, next, jumper" :total="pagination.total"></el-pagination>
    </div>
  </div>
</template>

<script>
import salesTable from './salesTable.vue'
import * as types from '~src/store/types'

export default {
  name: 'sales-list-tabContent',
  data () {
    return {
      info: [],
      pagination: {
        page: 1,
        size: 15
      },
      multipleSelection: [], // 已选择的库存项
      tableLoading: false,
      stockState: '',
      search: '' // 写入搜索时的字符串
    }
  },
  props: {
    type: String
  },
  created () {
    const searchCache = this.$store.state.sales.searchCache
    if (searchCache.status === this.type) {
      Object.assign(this.pagination, searchCache.page)
      this.search = searchCache.idorTitle
    }
    this.requestTable()
  },
  mounted () {
    const search = this.$refs.search.$el
    search.onkeyup = (keyup) => {
      if (keyup.keyCode === 13) {
        search.blur()
        this.searchData()
      } else {
        return
      }
    }
  },
  methods: {
    toRouter ({ id, pType }) {
      const data = {
        page: Object.assign({}, this.pagination),
        idorTitle: this.search
      }
      this.$store.dispatch(types.UPDATE_SALES_LIST_TYPE, data)
      if (id) {
        this.$router.push({ name: 'salesStockEdit', params: { id }})
      } else {
        this.$router.push({ name: 'salesStockAdd', params: { pType }})
      }
    },
    searchData () {
      this.pagination.page = 1
      this.requestTable()
    },
    handleCurrentChange (page) {
      if (this.pagination.page !== page) {
        this.pagination.page = page
        this.requestTable()
      }
    },
    handleSelectChagne (arr) {
      this.multipleSelection = arr
    },
    selectionStatusChange (status) {
      if (this.multipleSelection.length > 0) {
        this.sellStatusChange(this.multipleSelection, status)
      }
    },
    sellStatusChange (idList, status) {
      const statusStr = status === 'ON_SELL' ? '上架' : '下架'
      if (this.tableLoading) {
        return
      }
      this.$confirm(`此操作将${statusStr}id为${idList.join(',')}的商品, 是否继续?`, '提示', {
        confirmButtonText: statusStr,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        const data = {
          status,
          sellIds: idList
        }
        this.$store.dispatch(types.UPDATE_SALES_STATUS, { data }).then(() => {
          this.tableLoading = false
          this.$message({
            type: 'success',
            message: statusStr + '成功!'
          })
          this.pagination.page = 1
          this.requestTable()
        }).catch(() => {
          this.tableLoading = false
          this.$alert(statusStr + '失败，请重试', {
            confirmButtonText: '我知道了'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消' + statusStr
        })
      })
    },
    requestTable () {
      if (this.tableLoading) {
        return
      }
      this.tableLoading = true
      const data = {
        page: this.pagination,
        status: this.type,
        idorTitle: this.search,
        type: ''
      }
      this.$store.dispatch(types.UPDATE_SALES_DATA, { info: data }).then(res => {
        this.info = [...res.info]
        this.pagination = Object.assign(this.pagination, res.pagination)
        this.tableLoading = false
      })
    }
  },
  components: { salesTable }
}
</script>

<style lang="stylus" module>
.stockHandle
  padding 5px 0
  display flex
  justify-content:space-between
  .hidden
    visibility hidden
  .stockSearch
    display flex
    align-items center
    >.stockStockSelect
      width 140px
      margin-right 20px
    >.elInput
      width 200px

.buttonGroup
  padding 10px 0
.pagination
  margin-top:15px
  float right
  display flex
  align-items center
  >span
    font-size 13px
    color #393939
</style>
