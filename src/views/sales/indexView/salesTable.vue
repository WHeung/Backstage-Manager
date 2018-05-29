<template>
  <el-table :data="data" border stripe tooltip-effect="dark" style="width: 100%;text-align: center" v-loading="tableLoading"
  @selection-change="handleSelectionChange" @row-dblclick="rowDBclick">
    <el-table-column fixed="left" type="selection" width="48"></el-table-column>
    <el-table-column prop="id" label="库存ID"></el-table-column>
    <el-table-column prop="productTypeStr" label="产品类型"></el-table-column>
    <el-table-column prop="title" label="标题" min-width="180" header-align="center" align="center"></el-table-column>
    <el-table-column prop="standardStr" label="多规格" header-align="center"></el-table-column>
    <el-table-column prop="companyCode" label="航司" header-align="center" align="center"></el-table-column>
    <el-table-column prop="openTime" label="上架时间" width="108" header-align="center" align="center"></el-table-column>
    <el-table-column prop="closeTime" label="自动下架" width="108" header-align="center" align="center"></el-table-column>
    <el-table-column prop="stock" label="总库存"></el-table-column>
    <el-table-column prop="soldCount" label="已售"></el-table-column>
    <el-table-column prop="remainStock" label="剩余"></el-table-column>
    <el-table-column prop="lowestPrice" min-width="93" label="最低售价(成人价)"></el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="108" align='center' header-align='center'></el-table-column>
    <el-table-column prop="providerName" label="供应商"></el-table-column>
    <el-table-column fixed="right" label="操作" width="120" header-align='center'>
      <template slot-scope="scope">
        <el-button type="text" size="small">
          <a :class="$style.linkStyle" href="#" @click.prevent="toRouter(scope.row.id)">修改</a>
        </el-button>
        <el-button v-if="type==='ON_SELL'" @click.native.prevent="changeStatus(scope.$index, 'OFF_SELL')" type="text" size="small">
          下架
        </el-button>
        <el-button v-if="type==='OFF_SELL'" @click.native.prevent="changeStatus(scope.$index, 'ON_SELL')" type="text" size="small">
          上架
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  data () {
    return {
      tableLoading: false
    }
  },
  props: {
    info: Array,
    type: String
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
    toRouter (id) {
      this.$emit('toEdit', { id })
    },
    handleSelectionChange: function (val) {
      const arr = val.map(item => { return item.id })
      this.$emit('selectChange', arr)
    },
    changeStatus (index, status) {
      const idList = [this.data[index].id]
      this.$emit('sellStatusChange', idList, status)
    },
    rowDBclick (row) {
      if (this.type === 'ON_SELL') {
        window.open('https://m.dwfei.com/h5/#/sales/detail/' + row.id, 'target', '')
      }
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

