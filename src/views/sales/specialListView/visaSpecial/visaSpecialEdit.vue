<template>
  <div :class="$style.main">
    <el-form label-position="right" label-width="130px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="签证ID">
            {{pageInfo.id}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="4">
          <el-form-item label="专题类型">
            <el-input disabled value="签证专题"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="签证国家">
            <el-select v-model="pageInfo.nationName" filterable placeholder="请选择">
              <el-option v-for="item in nationList" :key="item" :value="item" :label="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="4">
          <el-form-item label="库存ID">
            <el-select v-model="pageInfo.sellId" filterable placeholder="请选择">
              <el-option v-for="visa in visaList" :key="visa.id" :value="visa.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="商品标题">
            <el-input :value="pruductTitle" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="排序">
            <el-input v-model="pageInfo.sortNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="4">
          <el-form-item label="是否显示">
            <el-select placeholder="是否显示" v-model="pageInfo.visible">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :class="$style.btnGroup">
        <el-button type="primary" @click="save">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
        <el-button @click="cancel">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import * as types from '~src/store/types'

export default {
  name: 'visa-special-edit',
  data () {
    return {
      visaList: [],
      init: {
        id: '',
        sellId: '',
        sortNo: '',
        nationName: '',
        visible: true
      }
    }
  },
  created () {
    this.$store.dispatch(types.UPDATE_SALESEDIT_NATIONLIST) // 请求所有国家数据以供选择
    const data = {
      page: {
        page: 1,
        size: 0
      },
      type: 'GENERAL',
      productType: 'VISA'
    }
    this.$store.dispatch(types.UPDATE_SALES_DATA, { info: data }).then(res => { // 请求所有的签证产品数据
      this.visaList = [...res.info]
    })
  },
  computed: {
    pageInfo () {
      return Object.assign(this.init, this.$store.state.salesSpecial.visaSpecial.detail)
    },
    nationList () {
      return this.$store.state.salesEdit.nationList
    },
    pruductTitle () {
      if (!this.pageInfo.sellId) {
        return ''
      } else {
        return this.findSell(this.pageInfo.sellId)
      }
    }
  },
  methods: {
    save () {
      this.$store.dispatch(types.SUBMIT_SPECIAL_VISA, this.pageInfo).then(() => {
        this.cancel()
      }).catch(() => {
        this.$message.error('保存失败，请重试')
      })
    },
    cancel () {
      this.$router.go(-1)
    },
    findSell (id) {
      const visa = this.visaList.find(item => {
        return item.id === id
      })
      return typeof visa === 'object' ? visa.title : ''
    }
  }
}
</script>
<style lang="stylus" module>
.main
  padding 20px 0

.btnGroup
  margin 20px 0 0 50px
</style>
