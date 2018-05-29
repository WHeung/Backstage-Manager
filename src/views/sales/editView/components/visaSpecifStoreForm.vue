<template>
  <div>
    <preLine title="套餐价格"></preLine>
    <el-form :class="$style.form">
      <el-table :data="stores" border stripe>
        <el-table-column label="结算价/元" header-align='center'>
          <template slot-scope="scope">
            <el-input size="small" :value="scope.row.settlementPrice"
            @input="function(val){inputVal(val, 'settlementPrice', true)}"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="建议售卖价/元" header-align='center'>
          <template slot-scope="scope">
            <el-input size="small" :value="scope.row.settlementPrice" disabled :class="$style.cursorText"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="价格" header-align='center'>
          <template slot-scope="scope">
            <el-input size="small" :value="scope.row.adultPrice"
            @input="function(val){inputVal(val, 'adultPrice', true)}"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="已售" header-align='center'>
          <template slot-scope="scope">
            <el-input size="small" :value="scope.row.soldCount" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column label="实际剩余" header-align='center'>
          <template slot-scope="scope">
            <el-input size="small" :value="scope.row.realRemainStock"
            @input="function(val){inputVal(val, 'realRemainStock', true)}"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="秒杀库存-实抢" header-align='center'>
          <template slot-scope="scope">
            <el-input size="small" :value="realTotalStock(scope.row)" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column label="营销剩余" header-align='center'>
          <template slot-scope="scope">
            <el-input size="small" :value="scope.row.displayRemainStock"
            @input="function(val){inputVal(val, 'displayRemainStock', true)}"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="营销总库存"  header-align='center'>
          <template slot-scope="scope">
            <el-input size="small" :value="scope.row.displayTotalStock"
            @input="function(val){inputVal(val, 'displayTotalStock', true)}"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div :class="$style.btnGroup" v-if="typeof childId === 'number'">
        <el-button @click="submit()" size="small" type="primary">
          仅保存库存信息
        </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import preLine from './line.vue'

export default{
  name: 'visa-specif-store',
  components: { preLine },
  data () {
    return {
      form: [{}],
      storeItem: {
        soldCount: 0,
        realRemainStock: 0,
        roomDiffPrice: 0,
        settlementPrice: '',
        adultPrice: '',
        childPrice: 0,
        realTotalStock: 0,
        displayRemainStock: '',
        displayTotalStock: ''
      }
    }
  },
  props: ['value', 'childId'],
  computed: {
    stores () {
      return this.initStores(this.value)
    }
  },
  methods: {
    initStores (value) {
      const stores = Object.assign(this.form[0], this.storeItem, value[0])
      return [stores]
    },
    inputVal (val, name, isNum) {
      if (isNum && val) {
        val = isNaN(val) ? '' : parseFloat(val)
      }
      const store = this.stores[0]
      store[name] = val
      this.emit()
    },
    emit () {
      const stores = [Object.assign({}, this.stores[0])]
      if (typeof stores[0].soldCount === 'number' && typeof stores[0].realRemainStock === 'number') {
        stores[0].realTotalStock = stores[0].soldCount + stores[0].realRemainStock
      }
      stores[0].childPrice = stores[0].adultPrice
      this.$emit('input', stores)
    },
    realTotalStock (row) {
      return row.soldCount + row.realRemainStock
    },
    submit () {
      this.$emit('submitStore')
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

.cursorText input
  cursor text !important
</style>
