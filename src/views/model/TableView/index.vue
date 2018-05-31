<template>
  <div :class="$style.main">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-input v-model="search.id" placeholder="id"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input v-model="search.item1" placeholder="Item1"></el-input>
      </el-col>
      <el-col :span="4">
        <el-select v-model="search.status" placeholder="状态">
          <el-option
            v-for="item in statusOptions" :key="item"
            :value="item" :label="item">
          </el-option>
        </el-select>
      </el-col>
      <el-button type="primary" @click="resetPageRequest">搜索</el-button>
    </el-row>
    <TableItem :class="$style.table" :info="list"></TableItem>
    <el-pagination
      layout="total, prev, pager, next"
      :page-size="5"
      :current-page="curPage"
      @current-change="changePagin"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import TableItem from './tableItem.vue'

import data from '~src/data'
import * as Types from '~src/store/types.js'
export default {
  name: 'table-view',
  data () {
    return {
      list: data.modelTable.data,
      curPage: data.modelTable.page,
      total: data.modelTable.total,
      statusOptions: ['all', 'one', 'two', 'three', 'four', 'five'],
      search: {
        id: '',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        status: ''
      }
    }
  },
  components: { TableItem },
  created () {
    this.$store.commit(Types.SET_BREAD_NAV, ['功能模板', '表格'])
    console.log(this.$route)
  },
  methods: {
    resetPageRequest () {
      this.$message(`点击了搜索，条件为:\n${JSON.stringify(this.search).replace(/\{|\}/g, '')}`)
    },
    changePagin (val) {
      this.$message(`点击切换到第${val}页`)
    },
  }
}
</script>

<style lang="stylus" module>
.table
  margin-top 20px
</style>
