<template>
  <el-form :class="$style.form" label-position="right" label-width="130px" :rules="rules" ref="form" :model="main">
    <el-row>
      <inlineItem out="12" in="13" title="商品ID:">
        <el-input v-model="main.id" disabled></el-input>
      </inlineItem>
      <inlineItem out="12" in="13" title="供应商:" prop="providerId" :rules="rules.required">
        <el-select v-model="main.providerId" placeholder="请选择供应商"><!--  :disabled="main.nodeType === 'CHILD'" -->
          <el-option :value="0" label="无"></el-option>
          <el-option v-for="item in suppliers" :key="item.id" :value="item.id" :label="item.name">
          </el-option>
        </el-select>
      </inlineItem>
    </el-row>
    <el-row>
      <inlineItem in="19" title="特卖标题:" prop="title" :rules="rules.required">
        <el-input v-model="main.title"></el-input>
      </inlineItem>
    </el-row>
    <el-row>
      <inlineItem out="12" in="13" title="所属国家:">
        <el-select v-model="main.nationName" filterable placeholder="请选择">
          <el-option value="" label="无"></el-option>
          <el-option v-for="item in nationList" :key="item" :value="item" :label="item"></el-option>
        </el-select>
      </inlineItem>
      <inlineItem out="12" in="13" title="是否显示:">
        <el-select v-model="nationId" placeholder="请选择">
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
      </inlineItem>
      
    </el-row>
    <el-row>
      <inlineItem out="12" in="13" title="开售时间(可不填):">
        <el-date-picker type="datetime" v-model="seckillOpenTime"></el-date-picker>
      </inlineItem>
      <inlineItem out="12" in="13" title="下架时间(可不填):">
        <el-date-picker type="datetime" v-model="closeTime"></el-date-picker>
      </inlineItem>
    </el-row>
    <el-row>
      <inlineItem out="12" title="营销售罄时长:">
        <div :class="$style.duration">
          <el-input :class="$style.durationDay" v-model.number="soldOutTime[0]" @input="soldOutTimeChange"></el-input>
          <span>&nbsp;天&nbsp;</span>
          <el-time-picker :class="$style.durationTime" v-model="soldOutTime[1]" @input="soldOutTimeChange"></el-time-picker>
        </div>
      </inlineItem>
      <inlineItem out="12" in="13" title="需提前购买天数:">
        <el-input v-model.number="main.earlyDay"></el-input>
      </inlineItem>
    </el-row>
    <el-row>
      <inlineItem out="12" in="13" title="每日推荐:">
        <el-select v-model="main.type" placeholder="请选择">
          <el-option label="是" value="SECKILL"></el-option>
          <el-option label="否" value="GENERAL"></el-option>
        </el-select>
      </inlineItem>
      <inlineItem out="12" in="13" title="推荐排序:">
        <el-input v-model="main.sortNo"></el-input>
      </inlineItem>
    </el-row>
    <template v-if="pType==='VISA' || pType === 'INSURANCE'">
    <intrItem title="封面展示小图" subTitle="限1张，尺寸：162 x 162px">
      <Cover slot="con" v-model="main.cover"></Cover>
    </intrItem>
    </template>
    <template v-if="pType==='TRAVEL'">
    <intrItem title="封面展示小图" subTitle="限1张，尺寸：326 x 216px">
      <Cover slot="con" v-model="main.cover" sizeStyle="{;width:326px;height:216px;line-height:216px;}" cutPic="width"></Cover>
    </intrItem>
    </template>
    <intrItem title="套餐展示大图" subTitle="数量不限（第一张图片为封面,虚线框为正常尺寸比例）,尺寸：750 x 500px">
      <Pictures slot="con" v-model="main.pictures"></Pictures>
    </intrItem>
    <intrItem title="套餐亮点" subTitle="（简短几个字描述亮点标签）">
      <Tags slot="con" v-model="main.tags"></Tags>
    </intrItem>
  </el-form>
</template>
<script>
import intrItem from './intrItem.vue'
import inlineItem from './inlineItem.vue'
import Tags from './tagsComponent.vue'
import Cover from './coverComponent.vue'
import Pictures from './picturesComponent.vue'
import compareObj from '~src/tool/compareObj'
import { DayDateToString, StringToDayDate, dateToString } from '~src/filters'

export default{
  name: 'visa-main',
  components: { intrItem, inlineItem, Tags, Cover, Pictures },
  data () {
    return {
      initForm: {
        id: '',
        title: '',
        providerId: '',
        closeTime: '',
        nationName: '',
        earlyDay: '',
        cover: '',
        pictures: '',
        tags: '',
        seckillOpenTime: '',
        soldOutTime: '',
        productType: '',
        nodeType: 'PARENT',
        type: 'GENERAL',
        nationId: 1,
        sortNo: ''
      }
    }
  },
  props: {
    value: Object,
    rules: Object,
    pType: String,
    suppliers: {
      type: Array,
      default: () => { return [] }
    },
    nationList: {
      type: Array,
      default: () => { return [] }
    }
  },
  created () {
    this.initForm.productType = this.pType
    this.initForm.providerId = 0
  },
  computed: {
    main () {
      const main = this.initMain(this.value)
      return main
    },
    seckillOpenTime: {
      get () {
        return this.main.seckillOpenTime ? new Date(this.main.seckillOpenTime) : ''
      },
      set (val) {
        this.main.seckillOpenTime = val ? dateToString(val) : ''
      }
    },
    closeTime: {
      get () {
        return this.main.closeTime ? new Date(this.main.closeTime) : ''
      },
      set (val) {
        this.main.closeTime = val ? dateToString(val) : ''
      }
    },
    soldOutTime () {
      return this.main.soldOutTime ? StringToDayDate(this.main.soldOutTime) : ['', '']
    },
    nationId: {
      get () {
        return this.main.nationId !== -1
      },
      set (val) {
        this.main.nationId = val ? 1 : -1
      }
    }
  },
  methods: {
    initMain (value) {
      return Object.assign(this.initForm, this.value)
    },
    emitItem (value) {
      const main = Object.assign({}, value)
      if (main.seckillOpenTime && main.closeTime) {
        main.seckillCloseTime = main.closeTime
      } else {
        main.seckillCloseTime = ''
      }
      return main
    },
    soldOutTimeChange () {
      this.main.soldOutTime = DayDateToString(this.soldOutTime)
    }
  },
  watch: {
    main: {
      handler (val) {
        const main = this.emitItem(val)
        if (!compareObj(main, this.value)) { // 通过与表单对比， 不一样才进行更新，防止死循环
          this.$emit('input', main)
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="stylus" module>
.form
  padding 20px 0

.duration
  display flex

.durationDay
  max-width 68px
.durationTime
  max-width 102px
</style>

