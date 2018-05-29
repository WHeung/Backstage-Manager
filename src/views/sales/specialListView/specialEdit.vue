<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>特卖平台库存管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{name: 'specialList'}">专题管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑{{typeName}}专题</el-breadcrumb-item>
    </el-breadcrumb>
    <country-special-edit v-if="pageConfig.type == 'country'"></country-special-edit>
    <ordinary-special-edit v-else-if="pageConfig.type== 'ordinary'"></ordinary-special-edit>
    <visa-special-edit v-else-if="pageConfig.type== 'VISA'"></visa-special-edit>
  </div>
</template>
<script>
import * as types from '~src/store/types'
import countrySpecialEdit from './countrySpecial/countrySpecialEdit.vue'
import ordinarySpecialEdit from './ordinarySpecial/ordinarySpecialEdit.vue'
import visaSpecialEdit from './visaSpecial/visaSpecialEdit.vue'

export default {
  name: 'special-edit-view',
  data () {
    return {
      typeName: '',
      pageConfig: {
        special: null,
        type: null
      }
    }
  },
  components: {
    countrySpecialEdit: countrySpecialEdit,
    ordinarySpecialEdit: ordinarySpecialEdit,
    visaSpecialEdit
  },
  created () {
    this.pageConfig.type = this.$route.params.type
    this.pageConfig.operation = this.$route.params.operation
    if (this.pageConfig.operation === 'edit' && this.$route.params.id) {
      this.pageConfig.id = parseInt(this.$route.params.id)
      this.$store.dispatch(types.UPDATE_SPECIAL_DETAIL, this.pageConfig)
    } else {
      this.$store.dispatch(types.INIT_SPECIAL_DETAIL, this.pageConfig)
    }
    switch (this.pageConfig.type) {
    case 'ordinary':
      this.typeName = '普通'
      break
    case 'country':
      this.typeName = '国家'
      break
    case 'VISA':
      this.typeName = '签证'
      break
    }
  }
}
</script>
<style>

</style>
