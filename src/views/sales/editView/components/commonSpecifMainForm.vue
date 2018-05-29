<template>
  <el-form :class="$style.form" label-position="right" label-width="100px" :rules="rules" ref="form" :model="main">
    <el-row>
      <inlineItem out="6" in="21" title="规格ID:">
        <el-input :value="main.id" disabled></el-input>
      </inlineItem>
      <template v-if="childs.length !== 1">
        <inlineItem out="9" in="21" title="规格名称:">
          <el-input :value="main.tabTip" @input="function(val){inputVal(val, 'tabTip')}"></el-input>
        </inlineItem>
        <el-button :class="$style.floatLeft" type="primary" v-show="main.id" @click="updateTabTip">更新</el-button>
      </template>
      <el-button :class="$style.floatRight" type="primary" v-show="hadParent" @click="submitChild">仅保存当前规格信息</el-button>
    </el-row>
    <el-row>
      <inlineItem out="9" in="20" title="原价:" prop="originalPrice" :rules="rules.number">
        <el-input :value="main.originalPrice" @input="function(val){inputVal(val, 'originalPrice', true)}"></el-input>
      </inlineItem>
      <inlineItem out="5" in="21" title="推荐排序:">
        <el-input :value="main.sortNo" @input="function(val){inputVal(val, 'sortNo')}"></el-input>
      </inlineItem>
    </el-row>
    <el-row>
      <inlineItem out="5" title="是否显示:">
        <el-switch active-color="#20a0ff" inactive-color="#bfcdb9" v-model="nationIdSwitch"></el-switch>
      </inlineItem>
      <inlineItem out="5" title="是否上架:">
        <el-switch active-color="#20a0ff" inactive-color="#bfcdb9" v-model="statusSwitch"></el-switch>
      </inlineItem>
      <template v-if="pType==='TRAVEL'">
        <inlineItem out="5" title="是否有航班:">
          <el-switch active-color="#20a0ff" inactive-color="#bfcdb9" v-model="flight"></el-switch>
        </inlineItem>
        <inlineItem out="5" title="是否有酒店:">
          <el-switch active-color="#20a0ff" inactive-color="#bfcdb9" v-model="hotel"></el-switch>
        </inlineItem>
      </template>
    </el-row>
  </el-form>
</template>
<script>
import inlineItem from './inlineItem.vue'

export default{
  name: 'common-specif-main',
  components: { inlineItem },
  data () {
    return {
      form: {},
      initForm: {
        id: '',
        tabTip: '',
        status: 'ON_SELL',
        originalPrice: '',
        nationId: 1, // 是否显示
        productType: 'TRAVEL',
        nodeType: 'CHILD',
        sortNo: ''
      }
    }
  },
  props: {
    value: Object,
    rules: Object,
    pType: String,
    hadParent: Boolean,
    childs: Array,
    isFlight: Boolean,
    isHotel: Boolean
  },
  computed: {
    main () {
      return Object.assign(this.form, this.initForm, this.value)
    },
    nationIdSwitch: {
      get () {
        return this.main.nationId !== -1
      },
      set (val) {
        this.inputVal(val ? 1 : -1, 'nationId')
      }
    },
    statusSwitch: {
      get () {
        return this.main.status === 'ON_SELL'
      },
      set (val) {
        this.inputVal(val ? 'ON_SELL' : 'OFF_SELL', 'status')
      }
    },
    flight: {
      get () {
        return this.isFlight
      },
      set (val) {
        this.$emit('toggleFlight', val)
      }
    },
    hotel: {
      get () {
        return this.isHotel
      },
      set (val) {
        this.$emit('toggleHotel', val)
      }
    }
  },
  methods: {
    initMain (value) {
      return Object.assign(this.form, this.initForm, value)
    },
    inputVal (val, name, isNum) {
      isNum && (val = parseFloat(val))
      this.main[name] = val
      this.emit()
    },
    emit () {
      const main = Object.assign({}, this.main)
      this.$emit('input', main)
    },
    submitChild () {
      this.$emit('submitChild')
    },
    updateTabTip () {
      this.$emit('updateTabTip')
    }
  }
}
</script>
<style lang="stylus" module>
.floatLeft
  float left

.floatRight
  float right

.form
  padding 20px 0
</style>
