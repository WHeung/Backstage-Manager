<template>
  <div>
    <preLine title="酒店信息"></preLine>
    <el-form :class="$style.form" label-position="right">
      <el-form-item>
        <el-select :class="$style.elSelect" :value="selectedHotel" multiple filterable placeholder="请输入关键词" 
         @input="select">
          <el-option v-for="item in hotelList" :label="item.label" :key="item.value" :value="item.value"></el-option>
        </el-select>
        <el-table v-show="selectedHotel.length > 0" :data="hotels" border>
          <el-table-column prop="name" label="酒店" header-align='center'></el-table-column>
          <el-table-column label="房型" header-align='center'>
            <template slot-scope="scope">
              <el-input size="small"
              :value="scope.row.roomType" @input="function(val){inputVal(val, 'roomType', scope)}"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="是否含早" header-align='center' width="94">
            <template slot-scope="scope">
              <el-switch active-text="" inactive-text
              :value="scope.row.includeBreakfast" @input="function(val){inputVal(val, 'includeBreakfast', scope)}"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="入住日期"  header-align='center' width="150">
            <template slot-scope="scope">
              <el-col :span="4">第</el-col>
              <el-col :span="10">
                <el-input size="small"
                :value="scope.row.checkInDays" @input="function(val){inputVal(val, 'checkInDays', scope)}"></el-input>
              </el-col>
              <el-col :span="4" :offset="1">天</el-col>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="70">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index)" type="text" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import * as types from '~src/store/types'
import preLine from './line.vue'

export default{
  name: 'travel-specif-hotel',
  components: { preLine },
  data () {
    return {
      form: [],
      hotelItem: {
        includeBreakfast: false,
        roomType: '',
        checkInDays: ''
      }
    }
  },
  props: {
    value: Array
  },
  computed: {
    hotels () {
      const value = JSON.parse(JSON.stringify(this.value)) // 数组内对象还是原来的value，所以先要进行深拷贝
      const hotels = this.initHotels(value)
      // this.selectedHotel = []
      hotels.forEach(item => {
        item.includeBreakfast = item.includeBreakfast === 'YES'
      })
      return hotels
    },
    selectedHotel () {
      const selectedHotel = this.hotels.map(item => {
        return item.hotelId + ''
      })
      return selectedHotel
    },
    hotelList () {
      const hotelList = this.$store.state.salesEdit.hotelList.map(item => {
        return { hotelId: item.hotelId + '', value: item.hotelId + '', label: item.name + '  |  ' + item.city, name: item.name }
      })
      return hotelList
    }
  },
  methods: {
    initHotels (value) {
      const hotels = value.map((item, index) => {
        !this.form[index] && this.form.push({})
        return Object.assign(this.form[index], item)
      })
      return hotels
    },
    inputVal (val, name, scope) {
      scope.row[name] = val
      this.emit()
    },
    emit () {
      const hotels = this.hotels.map(item => {
        item = Object.assign({}, item) // 成为新对象避免影响远来数组中的对象
        item.includeBreakfast = item.includeBreakfast ? 'YES' : 'NO'
        item.enable = true
        return item
      })
      this.$emit('input', hotels)
    },
    select (val) {
      if (val.length > this.hotels.length) {
        const addItem = this.hotelList.find(item => {
          return item.value === val[val.length - 1]
        })
        this.hotels.push(Object.assign({}, this.hotelItem, addItem))
        this.selectedHotel.push(addItem.value)
        this.emit() // 添加需要emit修改表单，删除需要判断是否有id才修改表单，如果有id则是调用接口删除后更新整个酒店信息
      }
      if (val.length < this.hotels.length) {
        const delIndex = this.hotels.findIndex((item, index) => {
          return item.value !== val[index]
        })
        this.deleteRow(delIndex)
      }
    },
    deleteRow (index) {
      if (this.hotels[index].id) { // 如果已存在Id
        this.$confirm(`该酒店已经保存过进数据库,确定要删除该酒店信息吗?`, '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(types.DELETE_SALESEDIT_FORM_HOTEL, { ids: [this.hotels[index].id] }).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.$emit('updateHotel')
          }).catch(() => { // 如果不存在Id则直接删除
            this.$message.error('删除失败,请重试')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.hotels.splice(index, 1)
        this.emit()
      }
    }
  }
}
</script>
<style lang="stylus" module>
.form
  padding 20px 0

.elSelect
  margin-bottom 10px
  > div:first-child > span
    display none
  

</style>
