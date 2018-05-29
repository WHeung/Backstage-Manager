<template>
  <div>
    <preLine title="套餐价格"></preLine>
    <el-form :class="$style.form">
      <el-table :data="stores" border stripe>
        <el-table-column label="出发日期" header-align='center' align='center' width="230">
          <template slot-scope="scope">
            <el-date-picker type="date" :value="scope.row.departureDate"
            @input="function(val){inputVal(val, 'departureDate', scope)}"
            :disabled="typeof scope.row.id === 'number'"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="结算价/元" header-align='center' min-width="93">
          <template slot-scope="scope">
            <el-input size="small" :value="scope.row.settlementPrice"
            @input="function(val){inputVal(val, 'settlementPrice', scope, true)}"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="建议售卖价/元" header-align='center' min-width="93">
          <template slot-scope="scope">
            <el-input size="small" :value="calcPrice(scope.row.settlementPrice)" disabled :class="$style.cursorText"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="成人价/元" header-align='center' min-width="93">
          <template slot-scope="scope">
            <el-input size="small" :value="scope.row.adultPrice"
            @input="function(val){inputVal(val, 'adultPrice', scope, true)}"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="房间差价（成人单人）/元" header-align='center' min-width="93">
          <template slot-scope="scope">
            <el-input size="small" :value="scope.row.roomDiffPrice"
            @input="function(val){inputVal(val, 'roomDiffPrice', scope, true)}"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="已售" header-align='center' min-width="93">
          <template slot-scope="scope">
            <el-input size="small" :value="scope.row.soldCount" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column label="实际剩余" header-align='center' min-width="93">
          <template slot-scope="scope">
            <el-input size="small" :value="scope.row.realRemainStock"
            @input="function(val){inputVal(val, 'realRemainStock', scope, true)}"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="秒杀库存-实抢" header-align='center' min-width="93">
          <template slot-scope="scope">
            <el-input size="small" :value="realTotalStock(scope.row)" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column label="营销剩余" header-align='center' min-width="93">
          <template slot-scope="scope">
            <el-input size="small" :value="scope.row.displayRemainStock"
            @input="function(val){inputVal(val, 'displayRemainStock', scope, true)}"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="营销总库存"  header-align='center' min-width="93">
          <template slot-scope="scope">
            <el-input size="small" :value="scope.row.displayTotalStock"
            @input="function(val){inputVal(val, 'displayTotalStock', scope, true)}"></el-input>
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
      <div :class="$style.btnGroup">
        <el-upload
          :class="$style.uploadBtn" name="importFiles"
          :action="uploadUrl" :show-file-list="false" :multiple="false"
          :on-success="uploadFn" :on-error="errUpload" v-if="typeof childId === 'number'">
          <el-button :class='$style.addBtn'  size="small" :plain="true" type="info">导入XML</el-button>
        </el-upload>
        <el-button :class='$style.addBtn' @click="addRow()" size="small">
          新增库存
        </el-button>
        <el-button @click="submit()" size="small" type="primary" v-if="typeof childId === 'number'">
          仅保存库存信息
        </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import * as types from '~src/store/types'
import preLine from './line.vue'
import { dateFormatYMD } from '~src/filters'

export default{
  name: 'travel-specif-store',
  components: { preLine },
  data () {
    return {
      form: [],
      storeItem: {
        departureDate: '',
        settlementPrice: '',
        adultPrice: '',
        childPrice: 0,
        roomDiffPrice: 0,
        soldCount: 0,
        realRemainStock: 0,
        realTotalStock: 0,
        displayRemainStock: 0,
        displayTotalStock: 0
      }
    }
  },
  props: ['value', 'childId'],
  computed: {
    stores () {
      const value = JSON.parse(JSON.stringify(this.value)) // 数组内对象还是原来的value，所以先要进行深拷贝
      const stores = this.initStores(value)
      stores.forEach(item => {
        item.departureDate && (item.departureDate = new Date(item.departureDate))
      })
      return stores
    },
    uploadUrl () {
      return `/admin-sell/upload/sell-store?sellId=${this.childId}`
    }
  },
  methods: {
    initStores (value) {
      const stores = value.map((item, index) => {
        !this.form[index] && this.form.push({})
        return Object.assign(this.form[index], item)
      })
      return stores
    },
    inputVal (val, name, scope, isNum) {
      var resVal
      if (isNum) {
        resVal = parseFloat(val)
      } else {
        resVal = val
      }
      this.stores[scope.$index][name] = resVal
      this.emitStores()
    },
    emitStores () {
      const stores = this.stores.map(item => {
        item = Object.assign({}, item) // 成为新对象避免影响远来数组中的对象
        item.departureDate = item.departureDate ? dateFormatYMD(item.departureDate) : ''
        if (typeof item.soldCount === 'number' && typeof item.realRemainStock === 'number') {
          item.realTotalStock = item.soldCount + item.realRemainStock
        }
        item.childPrice = item.adultPrice
        return item
      })
      this.$emit('input', stores)
    },
    addRow () {
      this.stores.push(Object.assign({}, this.storeItem))
    },
    deleteRow (index) {
      if (this.stores[index].id) { // 如果已存在Id
        this.$confirm(`该库存已经保存过进数据库,确定要删除该库存吗?`, '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(types.DELETE_SALESEDIT_FORM_PRICE, { id: this.stores[index].id }).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.$emit('updateStore')
          }).catch(() => {
            this.$message.error('删除失败,请重试')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else { // 如果不存在Id则直接删除
        this.stores.splice(index, 1)
      }
    },
    realTotalStock (row) {
      return row.soldCount + row.realRemainStock
    },
    submit () {
      this.$emit('submitStore')
    },
    calcPrice (price) {
      if (Number(price) > 0) {
        const noCalc = [366, 375, 401, 270, 162, 153, 383, 219, 220, 221]
        const count = price * 11 / 10
        const parentId = parseInt(this.$route.params.id)
        if (noCalc.indexOf(parentId) !== -1) {
          return price
        }
        if (count - price <= 200) {
          return Math.ceil(price + 200)
        } else {
          return Math.ceil(count)
        }
      } else {
        return ''
      }
    },
    uploadFn (data) {
      if (data.state && data.state.code === 0) {
        this.$message({
          message: '导入成功',
          type: 'success'
        })
        this.$emit('updateStore')
      } else {
        this.errUpload()
      }
    },
    errUpload () {
      this.$message({
        message: '导入失败',
        type: 'error'
      })
    }
  }
}
</script>
<style lang="stylus" module>
.form
  padding 20px 0

.elSelect
  > div:first-child > span
    display none

.btnGroup
  margin-top 10px

.addBtn
  color #20a0ff !important

.uploadBtn
  display inline-block
  margin-right 10px

.cursorText input
  cursor text !important
</style>
