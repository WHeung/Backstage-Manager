<template>
  <div :class="$style.leftNav">
    <el-menu :class="$style.elMenu" :default-active="defaultActive" :unique-opened="true"
    @select="handleSelect">
      <nav-list :itemList="item" :index="index" v-for="(item, index) in menuList" :key="index"></nav-list>
    </el-menu>
  </div>
</template>

<script>
import * as types from '~src/store/types'
import navList from './navList.vue'
import data from '~src/data'

export default {
  name: 'left-nav',
  data () {
    return {
      defaultActive: '',
      menuList: data.menu.data
    }
  },
  created () {
    this.$store.dispatch(types.UPDATE_MENU).then(() => {
      for (let i = 0; i < this.data.length; i++) {
        const item = this.data[i]
        if (item.id === 56) {
          switch (this.$route.name) {
          case 'salesStock':
          case 'salesStockAdd':
          case 'salesStockEdit':
            this.defaultActive = item.id + '-0'
            break
          case 'orderList':
          case 'order':
            this.defaultActive = item.id + '-1'
            break
          case 'hotelList':
          case 'addHotel':
          case 'updateHotel':
            this.defaultActive = item.id + '-2'
            break
          }
          break
        }
        if (item.id === 116) {
          switch (this.$route.name) {
          case 'dreamTripOrder':
            this.defaultActive = item.id + '-0'
            break
          }
          break
        }
      }
    })
  },
  computed: {
    data () {
      return this.$store.state.menu
    }
  },
  methods: {
    handleSelect (index, indexPath) {
      console.log(index, indexPath)
      const navIndex = indexPath[0]
      const itemIndex = indexPath[1]
      const selectItem = this.menuList[navIndex].children.find(item => {
        return item.id + '' === itemIndex
      })
      this.$router.push({ path: selectItem.url })
      // const arrIndex = index.split('-')
      // for (let i = 0; i < arrIndex.length; i++) {
      //   arrIndex[i] = parseInt(arrIndex[i])
      // }
      // for (let i = 0; i < this.data.length; i++) {
      //   if (this.data[i].id === arrIndex[0]) {
      //     window.location.href = this.data[i].children[arrIndex[1]].url
      //     break
      //   }
      // }
    }
  },
  components: {
    navList
  }
}
</script>

<style lang="stylus" module>
.leftNav
  >.elMenu
    background-color #fafafa
</style>
