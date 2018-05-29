<template>
  <section :class="$style.main">
    <MainForm v-model="mainForm" @input="inputVal" :rules="rules" :nationList="nationList" pType="VISA" ref="main"></MainForm>
    <div :class="$style.splitPre">规格设置</div>
    <tabsComponents :actTab="actTab" :childs="childs" :rules="rules"></tabsComponents>
    <div v-show="child === actChild" v-for="(child,index) in childs" :key="index">
      <SpecifMainForm v-model="child.mainBean" :rules="rules" ref="SpecifMain"
      pType="VISA" :hadParent="typeof mainForm.id === 'number'" :childs="childs"
      @submitChild="validateChild(index)" @updateTabTip="updateTabTip(index)"></SpecifMainForm>
      <SpecifStoreForm v-model="child.storeBeans"
      :childId="child.mainBean.id"
      @submitStore="submitStore(index)"></SpecifStoreForm>
      <SpecifIntrForm v-model="child.mainBean" pType="VISA"></SpecifIntrForm>
    </div>
    <div :class="$style.submit">
      <el-button type="primary" @click="validate">&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;</el-button>&nbsp;&nbsp;
      <el-checkbox v-model="status">是否上架</el-checkbox>
    </div>
  </section>
</template>

<script>
import tabsComponents from './components/tabsComponent.vue'
import MainForm from './components/commonMainForm.vue'
import SpecifMainForm from './components/commonSpecifMainForm.vue'
import SpecifStoreForm from './components/visaSpecifStoreForm.vue'
import SpecifIntrForm from './components/commonSpecifIntrForm.vue'

export default {
  name: 'edit-visa-View',
  components: { MainForm, SpecifMainForm, SpecifStoreForm, SpecifIntrForm, tabsComponents },
  data () {
    return {
    }
  },
  props: ['rules'],
  computed: {
    actTab () {
      return this.$store.state.salesEdit.actTab
    },
    mainForm () {
      return this.$store.state.salesEdit.form.main
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
    submitStore (index) {
      this.$emit('submit', { type: 'sotre', index })
    },
    updateTabTip (index) {
      this.$emit('submit', { type: 'item', index, itemList: ['tabTip'] })
    },
    validateChild (index) {
      this.myValidate(this.$refs.SpecifMain[index].$refs.form, index).then(() => {
        this.$emit('submit', { type: 'child', index })
      })
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
