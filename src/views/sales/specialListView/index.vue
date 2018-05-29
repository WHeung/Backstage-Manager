<template>      
  <div>
    <el-tabs v-model="pageConfig.activeTab" type="card">
      <el-tab-pane label="国家专题" name="countrySpecial">
        <country-special-list :active-tab="pageConfig.activeTab"></country-special-list>
      </el-tab-pane>
      <el-tab-pane label="普通专题" name="ordinarySpecial">
        <ordinary-special-list :active-tab="pageConfig.activeTab"></ordinary-special-list>
      </el-tab-pane>
      <el-tab-pane label="签证专题" name="visaSpecial">
        <visaSpecialList :active-tab="pageConfig.activeTab"></visaSpecialList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import countrySpecialList from './countrySpecial/countrySpecialList.vue'
import ordinarySpecialList from './ordinarySpecial/ordinarySpecialList.vue'
import visaSpecialList from './visaSpecial/visaSpecialList.vue'

export default {
  name: 'special-list-view',
  components: {
    countrySpecialList,
    ordinarySpecialList,
    visaSpecialList
  },
  data () {
    return {
      pageConfig: {
        activeTab: 'countrySpecial'
      }
    }
  },
  created () {
    const page = this.$route.query.page || 1
    switch (this.$route.params.type) {
    case undefined:
      // this.$route.go({name: '/sales/special', params: {type: 'country'}});
      // window.location.hash = '/sales/special/country'
      this.$router.push({ name: 'specialList', params: { type: 'country' }, query: { page }})
      this.pageConfig.activeTab = 'countrySpecial'
      break
    case 'country' :
      // window.location.hash = '/sales/special/country'
      this.$router.push({ name: 'specialList', params: { type: 'country' }, query: { page }})
      this.pageConfig.activeTab = 'countrySpecial'
      break
    case 'ordinary':
      // window.location.hash = '/sales/special/ordinary?page=1'
      this.$router.push({ name: 'specialList', params: { type: 'ordinary' }, query: { page }})
      this.pageConfig.activeTab = 'ordinarySpecial'
      break
    case 'VISA':
      // window.location.hash = '/sales/special/VISA'
      this.$router.push({ name: 'specialList', params: { type: 'VISA' }, query: { page }})
      this.pageConfig.activeTab = 'visaSpecial'
      break
    }
  }
}
</script>
