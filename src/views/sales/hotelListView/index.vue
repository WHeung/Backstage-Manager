<template>
  <div :class="$style.main">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-input v-model="search.hotelName" placeholder="酒店名称"></el-input>
      </el-col>
      <el-button type="primary" @click="searchList">搜索酒店</el-button>
      <el-button type="primary" @click="addHotel">添加酒店</el-button>
    </el-row>
    <el-table :data="list" :class="$style.table" border stripe>
      <el-table-column type="selection" width="40" fixed="left"></el-table-column>
      <el-table-column prop="id" label="酒店ID" width="100"></el-table-column>
      <el-table-column prop="name" label="酒店名称" width="200"></el-table-column>
      <el-table-column prop="engName" label="酒店英文名称" width="300"></el-table-column>
      <el-table-column prop="city" label="所在城市" width="200"></el-table-column>
      <el-table-column prop="address" label="详细地址"></el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button @click="updateHotel(scope.row.id)" type="text" size="small">修改</el-button>
          <el-button @click="deleteHotel(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, prev, pager, next"
      :page-size="search.page.size"
      @current-change="changePagin"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import * as types from '~src/store/types'

export default {
  name: 'hotel-list-view',
  data () {
    return {
      search: {
        hotelName: '',
        page: {
          page: 1,
          size: 20
        }
      },
      oldSearch: {}
    }
  },
  created () {
    this.oldSearch = Object.assign({}, this.search)
    this.$store.dispatch(types.UPDATE_SALES_HOTEL_LIST, Object.assign({}, this.search))
  },
  computed: {
    list () {
      return this.$store.state.salesHotel.list
    },
    total () {
      return this.$store.state.salesHotel.total
    }
  },
  methods: {
    changePagin (val) {
      this.search.page.page = val
      this.oldSearch = Object.assign({}, this.search)
      this.$store.dispatch(types.UPDATE_SALES_HOTEL_LIST, this.oldSearch)
    },
    updateHotel (id) {
      this.$store.dispatch(types.UPDATE_SALES_HOTEL_DETAIL, { hotelId: id })
      this.$router.push(`/sales/hotel/update/${id}`)
    },
    addHotel () {
      this.$store.dispatch(types.UPDATE_SALES_HOTEL_DETAIL, {})
      this.$router.push('/sales/hotel/add')
    },
    deleteHotel (id) {
      this.$store.dispatch(types.UPDATE_REMOVE_SALES_HOTEL, { hotelId: id }).then(() => {
        this.$store.dispatch(types.UPDATE_SALES_HOTEL_LIST, this.oldSearch)
      })
    },
    searchList () {
      this.oldSearch = Object.assign({}, this.search)
      this.$store.dispatch(types.UPDATE_SALES_HOTEL_LIST, this.oldSearch)
    }
  }
}
</script>

<style lang="stylus" module>
.table
  width 100%
  margin-top 20px
</style>
