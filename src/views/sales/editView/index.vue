<template>
  <div v-loading="loading" :class="$style.main">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>特卖平台库存管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{name: 'salesStock'}">库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        <template v-if="pType==='TRAVEL'">编辑旅行库存</template>
        <template v-if="pType==='VISA'">编辑签证库存</template>
        <template v-if="pType==='INSURANCE'">编辑保险库存</template>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <travelView v-if="pType==='TRAVEL'" :rules="rules" @submit="submit"></travelView>
    <visaView v-if="pType==='VISA'" :rules="rules" @submit="submit"></visaView>
    <InsuranceView v-if="pType==='INSURANCE'" :rules="rules" @submit="submit"></InsuranceView>
  </div>
</template>

<script>
  import * as types from '~src/store/types'
  import travelView from './travelView.vue'
  import visaView from './visaView.vue'
  import InsuranceView from './insuranceView.vue'

  export default {
    name: 'edit-View',
    components: { travelView, visaView, InsuranceView },
    data () {
      return {
        suppliers: [],
        pType: null,
        rules: {
          number: [
              { type: 'number', required: true, message: '必须为数字' }
          ],
          required: [
              { required: true, message: '不能为空' }
          ]
        },
        loading: false
      }
    },
    created () {
      this.$store.dispatch(types.INIT_SALES_FORM)
      if (this.$route.name === 'salesStockAdd') {
        this.pType = this.$route.params.pType
        this.requestSelectData(this.pType)
      } else {
        this.loading = true
        this.$store.dispatch(types.UPDATE_SALESEDIT_FORM, { sellId: this.$route.params.id }).then(() => {
          this.loading = false
          this.pType = this.main.productType
          this.requestSelectData(this.pType)
        }).catch(errMsg => {
          if (errMsg.name === 'SINGLE') {
            this.loading = false
            this.$alert('该产品原为单独产品，以为您转换成规格产品，请重新进入该页面', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.$router.go(-1)
              }
            })
          }
        })
      }
    },
    computed: {
      main () {
        return this.$store.state.salesEdit.form.main
      }
    },
    methods: {
      requestSelectData (pType) {
        this.$store.dispatch(types.UPDATE_SALESEDIT_SELECTDATA, pType)
      },
      submit ({ type, index, itemList }) {
        this.loading = true
        const pType = this.pType
        const succCallback = () => {
          this.loading = false
          this.$message.success('保存成功')
        }
        const failCallback = () => {
          this.loading = false
          this.$message.error('保存失败')
        }
        if (type === 'all') {
          this.submitAll({ pType, succ: succCallback, fail: failCallback })
        }
        if (type === 'child') {
          this.submitChild({ pType, index, succ: succCallback, fail: failCallback })
        }
        if (type === 'sotre') {
          this.submitStore({ pType, index, succ: succCallback, fail: failCallback })
        }
        if (type === 'item') {
          this.submitItem({ pType, index, succ: succCallback, fail: failCallback, itemList })
        }
      },
      submitAll ({ pType, succ, fail }) {
        this.$store.dispatch(types.SUBMIT_SALESEDIT_FORM, { pType }).then(() => {
          succ()
          this.$store.dispatch(types.UPDATE_SALESEDIT_FORM, { sellId: this.main.id })
        }).catch(() => {
          fail()
        })
      },
      submitChild ({ pType, index, succ, fail }) {
        this.$store.dispatch(types.COPY_SALESEDIT_PARENT, { sellId: this.main.id }).then(parent => {
          this.$store.dispatch(types.SUBMIT_SALESEDIT_FORM_CHILD, { pType, index, parentId: this.main.id, parent }).then((id) => {
            succ()
            this.$store.dispatch(types.UPDATE_SALESEDIT_FORM_CHILD, { sellId: id, index })
          }).catch(() => {
            fail()
          })
        })
      },
      submitStore ({ pType, index, succ, fail }) {
        this.$store.dispatch(types.SUBMIT_SALESEDIT_ONLY_STORE, { pType, index }).then(() => {
          succ()
          this.$store.dispatch(types.UPDATE_SALESEDIT_ONLY_STORE, { index })
        }).catch(() => {
          fail()
        })
      },
      submitItem ({ pType, index, succ, fail, itemList }) {
        this.$store.dispatch(types.SUBMIT_SALESEDIT_ONLY_ITEM, { index, itemList }).then(() => {
          succ()
          this.$store.dispatch(types.UPDATE_SALESEDIT_ONLY_ITEM, { index, itemList })
        }).catch(() => {
          fail()
        })
      }
    }
  }
</script>
<style lang='stylus' module>
.main
  min-height 100%

.noClass input
  border 0 !important
  background transparent !important
  color #000 !important
  cursor auto !important

.stockEdit
  padding 20px
  .line
      font-family 'Arial-BoldMT', 'Arial Bold', 'Arial'
      font-weight 700
      font-style normal
      font-size 16px
      color #0000CC
      padding 0 20px 0
      line-height 2px
      border-left 300px solid #0000CC
      border-right 300px solid #0000CC
      text-align center
  .noteText
    display inline
    margin-left 5%
  .stockWp
    padding 20px 0

.tips
  color #ddd
  font-size 24px
</style>
