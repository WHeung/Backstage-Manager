<template>
  <div :class="$style.main">
    <el-button type="primary" @click="editSpecial()">新增签证专题</el-button>
    <el-table
      :class="$style.table"
      :data="pageInfo.data"
      stripe
      border
      tooltip-effect="dark" 
      style="width: 100%">
      <el-table-column prop="nationName" label="签证国家" width="120"></el-table-column>
      <el-table-column prop="sellId" label="库存ID"></el-table-column>
      <el-table-column prop="title" label="商品标题" min-width="420"></el-table-column>
      <el-table-column label="排序" width="90">
        <template slot-scope="scope">
          <el-input size="small" :value="scope.row.sortNo" @input="function(val){change(val, scope.$index, 'sortNo')}"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="是否展示" width="110">
        <template slot-scope="scope">
          <el-select size="small" :value="scope.row.visible" @input="function(val){change(val, scope.$index, 'visible')}" placeholder="请选择">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="editSpecial(scope.row.id)" type="text" size="small">修改</el-button>
          <el-button @click="saveSpecial(scope.$index)" type="text" size="small">保存</el-button>
          <el-button @click="deleteSpecial(scope.row.sellId)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div :class="$style.pagination">
      <el-pagination
        layout="total, prev, pager, next"
        :page-size="search.page.size"
        @current-change="changePagin"
        :total="pageInfo.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import * as types from '~src/store/types'

export default {
  name: 'visa-special',
  props: ['activeTab'],
  data () {
    return {
      search: {
        page: {
          page: 1,
          size: 20
        },
        type: 'VISA',
        nationId: 12
      }
    }
  },
  created () {
    const page = this.$route.query.page
    if (page !== 1 && this.$route.params.type === 'VISA') {
      this.search.page.page = page
    }
    this.$store.dispatch(types.UPDATE_SPECIAL_LIST, this.search)
  },
  computed: {
    pageInfo () {
      return this.$store.state.salesSpecial.visaSpecial.list
    }
  },
  methods: {
    requireSpecial () {
      this.$store.dispatch(types.UPDATE_SPECIAL_LIST, this.search)
    },
    changePagin (val) {
      this.search.page.page = val
      this.$router.push({ name: 'specialList', params: { type: 'VISA' }, query: { page: val }})
      this.requireSpecial()
    },
    saveSpecial (index) {
      const data = Object.assign({}, this.pageInfo.data[index])
      this.$store.dispatch(types.SUBMIT_SPECIAL_VISA, data).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
      this.requireSpecial()
    },
    editSpecial (id) {
      if (!id) {
        this.$router.push({ name: 'specialEdit', params: { type: 'VISA', operation: 'add' }})
      } else {
        this.$router.push({ name: 'specialEdit', params: { type: 'VISA', operation: 'edit', id }})
      }
    },
    deleteSpecial (sellId) {
      this.$confirm(`此操作将删除库存Id为${sellId}的专题, 是否继续?`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch(types.DELETE_SPECIAL_VISA, sellId).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.requireSpecial()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    change (val, index, name) {
      this.$set(this.pageInfo.data[index], name, val)
    }
  },
  watch: {
    'activeTab': function (newVal, oldVal) {
      if (newVal === 'visaSpecial') {
        this.$router.push({ name: 'specialList', params: { type: 'VISA' }, query: { page: this.search.page.page }})
      }
    }
  }
}
</script>
<style lang="stylus" module>
.table
  margin 10px
</style>
