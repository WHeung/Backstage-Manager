<template>
  <section :class="$style.main">
    <MainForm v-model="mainForm" @input="inputVal" :rules="rules" :nationList="nationList" pType="TRAVEL" ref="main"></MainForm>
    <div :class="$style.splitPre">规格设置</div>
    <tabsComponents :actTab="actTab" :childs="childs" :rules="rules"></tabsComponents>
    <div v-show="child === actChild" v-for="(child,index) in childs" :key="index">
      <SpecifMainForm v-model="child.mainBean" :rules="rules" ref="SpecifMain"
      pType="TRAVEL" :hadParent="typeof mainForm.id === 'number'" :childs="childs"
      @submitChild="validateChild(index)" @updateTabTip="submitTabTip(index)"
      :isFlight="child.isFlight" @toggleFlight="toggleFlight"
      :isHotel="child.isHotel" @toggleHotel="toggleHotel"></SpecifMainForm>
      <SpecifFlightForm v-model="child.flightInfoBeans" :rules="rules" :isFlight="child.isFlight" v-show="child.isFlight" ref="SpecifFlight"></SpecifFlightForm>
      <SpecifHotelForm v-model="child.adminSellHotelBeans" v-show="child.isHotel" @updateHotel="update(index, 'hotel')"></SpecifHotelForm>
      <SpecifStoreForm v-model="child.storeBeans"
      :childId="child.mainBean.id"
      @submitStore="submitStore(index)" @updateStore="update(index, 'store')"></SpecifStoreForm>
      <SpecifIntrForm v-model="child.mainBean" pType="TRAVEL"></SpecifIntrForm>
    </div>
    <div :class="$style.submit">
      <el-button type="primary" @click="validate">&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;</el-button>&nbsp;&nbsp;
      <el-checkbox v-model="status">是否上架</el-checkbox>
    </div>
  </section>
</template>

<script>
import * as types from '~src/store/types'
import tabsComponents from './components/tabsComponent.vue'
import MainForm from './components/commonMainForm.vue'
import SpecifMainForm from './components/commonSpecifMainForm.vue'
import SpecifFlightForm from './components/travelSpecifFlightForm.vue'
import SpecifHotelForm from './components/travelSpecifHotelForm.vue'
import SpecifStoreForm from './components/travelSpecifStoreForm.vue'
import SpecifIntrForm from './components/commonSpecifIntrForm.vue'

export default {
  name: 'edit-travel-View',
  components: { tabsComponents, MainForm, SpecifMainForm, SpecifFlightForm, SpecifHotelForm, SpecifStoreForm, SpecifIntrForm },
  data () {
    return {
      initMain: {
        status: 'ON_SELL'
      },
      initChild: {
        mainBean: {},
        flightInfoBeans: [],
        adminSellHotelBeans: [],
        storeBeans: []
      }
    }
  },
  props: ['rules'],
  computed: {
    actTab () {
      return this.$store.state.salesEdit.actTab
    },
    mainForm: {
      get () {
        return this.$store.state.salesEdit.form.main
      },
      set (val) {
        this.$store.commit(types.SET_SALES_FORM_MAIN, val)
      }
    },
    status: {
      get () {
        return this.mainForm.status === 'ON_SELL'
      },
      set (val) {
        this.mainForm.status = val ? 'ON_SELL' : 'OFF_SELL'
      }
    },
    childs () {
      return this.$store.state.salesEdit.form.childs
    },
    actIndex () {
      if (this.childs.length === 1) {
        return 0
      } else if (this.actTab !== 'addTab') {
        return parseInt(this.actTab)
      } else {
        return null
      }
    },
    actChild () {
      if (this.actIndex !== null) {
        return this.childs[this.actIndex]
      } else {
        return this.initChild
      }
    },
    nationList () {
      return this.$store.state.salesEdit.nationList
    }
  },
  methods: {
    inputVal (val) {
      Object.assign(this.mainForm, val)
    },
    update (index, name) {
      if (name === 'store') {
        this.$store.dispatch(types.UPDATE_SALESEDIT_ONLY_STORE, { index })
      }
      if (name === 'hotel') {
        this.$store.dispatch(types.UPDATE_SALESEDIT_ONLY_HOTEL, { index })
      }
    },
    submitStore (index) {
      this.$emit('submit', { type: 'sotre', index })
    },
    submitTabTip (index) {
      this.$emit('submit', { type: 'item', index, itemList: ['tabTip'] })
    },
    validateChild (index) {
      const validateList = []
      const SpecifMain = this.myValidate(this.$refs.SpecifMain[index].$refs.form, index)
      validateList.push(SpecifMain)
      if (this.childs[index].isFlight) {
        const SpecifFlight1 = this.myValidate(this.$refs.SpecifFlight[index].$refs.form1.$refs.form, index)
        const SpecifFlight2 = this.myValidate(this.$refs.SpecifFlight[index].$refs.form2.$refs.form, index)
        validateList.push(SpecifFlight1, SpecifFlight2)
      }
      Promise.all(validateList).then(() => {
        this.$emit('submit', { type: 'child', index })
      })
    },
    toggleFlight (val) {
      this.actChild.isFlight = val
    },
    toggleHotel (val) {
      this.actChild.isHotel = val
    },
    myValidate (target, index) {
      return new Promise((resolve, reject) => {
        target.validate((valid) => {
          if (valid) {
            resolve()
          } else {
            if (index) {
              this.$message.error(`规格设置第${parseInt(index) + 1}个还有必填项没有填喔`)
            } else {
              this.$message.error('主要信息必填项没有填喔')
            }
            reject()
          }
        })
      })
    },
    validate () {
      if (this.mainForm.seckillOpenTime && !this.mainForm.closeTime) {
        this.$message.error('设置了开售时间后必须设置下架时间')
        return
      }
      this.myValidate(this.$refs.main.$refs.form).then(() => {
        const validateList = []
        this.childs.forEach((item, index) => {
          const SpecifMain = this.myValidate(this.$refs.SpecifMain[index].$refs.form, index)
          validateList.push(SpecifMain)
          if (item.isFlight) {
            const SpecifFlight1 = this.myValidate(this.$refs.SpecifFlight[index].$refs.form1.$refs.form, index)
            const SpecifFlight2 = this.myValidate(this.$refs.SpecifFlight[index].$refs.form2.$refs.form, index)
            validateList.push(SpecifFlight1, SpecifFlight2)
          }
        })
        Promise.all(validateList).then(() => {
          this.$emit('submit', { type: 'all' })
        })
      })
    }
  }
}
</script>

<style lang="stylus" module>
.main
  padding 20px

.splitPre
  height 40px
  line-height 40px
  background-color rgba(0, 153, 255, 1)
  color #fff
  margin-left -40px
  padding-left 40px
  font-size 20px
  font-weight bold

.tabs
  margin-top 20px

.submit
  padding 20px 0
</style>
