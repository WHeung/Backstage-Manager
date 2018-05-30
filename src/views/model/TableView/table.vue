<template>
  <el-table :data="data" border stripe tooltip-effect="dark" style="width: 100%;text-align: center" v-loading="tableLoading"
  @selection-change="handleSelectionChange" @sort-change="sortChange" @row-dblclick="rowDBclick">
    <el-table-column fixed="left" type="selection" header-align="center" width="48"></el-table-column>
    <el-table-column prop="id" label="ID" header-align="center" sortable="custom"></el-table-column>
    <el-table-column prop="item1" label="item1" header-align="center" min-width="180"></el-table-column>
    <el-table-column prop="item2" label="item2" header-align="center"></el-table-column>
    <el-table-column prop="item3" label="item3" header-align="center" align="center"></el-table-column>
    <el-table-column prop="item4" label="item4" header-align="center" width="108"></el-table-column>
    <el-table-column prop="item5" label="item5" header-align="center"></el-table-column>
    <el-table-column fixed="right" label="操作" width="120" header-align='center'>
      <template slot-scope="scope">
        <el-button @click.native.prevent="clickSelf(scope.$index)" type="text" size="small">
          自定义点击
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: 'table',
  data () {
    return {
      tableLoading: false
    }
  },
  props: {
    info: Array
  },
  computed: {
    data () {
      const data = this.info.map(item => {
        item = Object.assign({}, item)
        if (item.standardStr) {
          item.title += '(多规格)'
        }
        return item
      })
      return data
    }
  },
  methods: {
    handleSelectionChange: function (val) {
      const arr = val.map(item => { return item.id })
      this.$emit('selectChange', arr)
    },
    clickSelf (index) {
      this.$message(`点击了第${index + 1}条`)
    },
    rowDBclick (row) {
      this.$message(`双击了ID为${row.id}的数据`)
    },
    sortChange (data) {
      // ascending, descending
      const text = data.order === 'ascending' ? '升序' : '降序'
      this.$message(`点击了${data.prop}的${text}排列`)
    }
  }
}
</script>
<style lang="stylus" module>
.linkStyle
  color #20a0ff
  cursor pointer
  text-decoration none
  &:hover
    color #4db3ff
</style>

