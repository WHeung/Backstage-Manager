<template>
  <div :class="$style.main">
    <div :class="$style.btnWrap">
      <el-button type="primary" @click="editSpecial()">新增专题</el-button>
    </div>
    <el-table
        :data="pageInfo.data"
        :stripe="true"
        border
        style="width: 100%">
        <el-table-column prop="id" label="国家ID" width="80"></el-table-column>
        <el-table-column prop="nationName" label="所属国家" width="120"></el-table-column>
        <el-table-column prop="title" label="专题导航栏标题" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="introduction" label="专题页描述" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="sellCount" label="产品数量" width="100"></el-table-column>
        <el-table-column label="是否展示" width="100">
          <template slot-scope="scope">
            <el-select size="small" v-model="scope.row.visible" placeholder="请选择">
              <el-option
                v-for="item in pageConfig.visibleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="专题排序" width="90">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.sortNo"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="editSpecial(scope.row.id)" type="text" size="small">修改</el-button>
            <el-button @click="updateSpecial(scope.row)" type="text" size="small">保存</el-button>            
            <el-button @click="deleteSpecial(scope.row)" type="text" size="small">删除</el-button>
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
  name: 'country-special',
  props: ['activeTab'],
  data () {
    return {
      search: {
        page: {
          page: 1,
          size: 20
        },
        type: 'COUNTRY',
        nationName: ''
      },
      pageConfig: {
        visibleOptions: [{
          value: false,
          label: '否'
        }, {
          value: true,
          label: '是'
        }]
      }
    }
  },
  created () {
    const page = this.$route.query.page
    if (page !== 1 && this.$route.params.type === 'country') {
      this.search.page.page = page
    }
    this.$store.dispatch(types.UPDATE_SPECIAL_LIST, this.search)
  },
  methods: {
    changePagin (val) {
      this.search.page.page = val
      this.oldSearch = Object.assign({}, this.search)
      this.$router.push({ name: 'specialList', params: { type: 'country' }, query: { page: val }})
      this.$store.dispatch(types.UPDATE_SPECIAL_LIST, this.oldSearch)
      // this.fetchSpecialList()
    },
    updateSpecial (item) {
      this.$store.dispatch(types.UPDATE_SPECIAL_ITEM, item).then(() => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        // this.search.page.page = 1
        // this.$store.dispatch(types.UPDATE_SPECIAL_LIST, this.search)
      })
    },
    editSpecial (id) {
      if (!id) {
        this.$router.push({ name: 'specialEdit', params: { type: 'country', operation: 'add' }})
      } else {
        this.$router.push({ name: 'specialEdit', params: { type: 'country', operation: 'edit', id: id }})
      }
    },
    deleteSpecial (item) {
      this.$confirm('此操作将删除 ' + item.name + ' 专题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store
          .dispatch(types.DELETE_SPECIAL_ITEM, item.id)
          .then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.$store.dispatch(types.UPDATE_SPECIAL_LIST, this.search)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  computed: {
    pageInfo () {
      return this.$store.state.salesSpecial.countrySpecial.list
    }
  },
  watch: {
    'activeTab': function (newVal, oldVal) {
      if (newVal === 'countrySpecial') {
        this.$router.push({ name: 'specialList', params: { type: 'country' }, query: { page: this.search.page.page }})        
      }
    }
  }
}
</script>
<style lang="stylus" module>
.btn-wrap
  padding 10px 0
.sort-input
  width 20px
.pagination
  margin-top 15px
  float right
  display flex
  align-items center
  >span
    font-size 13px
    color #393939
</style>
