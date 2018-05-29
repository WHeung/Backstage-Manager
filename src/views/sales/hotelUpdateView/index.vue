<template>
  <div :class="$style.main">
    <h2>{{this.$route.params.id ? '修改酒店信息' : '新增酒店'}}</h2>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="8">
        <Item title="酒店中文名称:">
          <el-input v-model="hotel.name" placeholder="" slot="con"></el-input>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="8">
        <Item title="酒店英文名称:">
          <el-input v-model="hotel.engName" placeholder="" slot="con"></el-input>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="8">
        <Item title="所在城市:">
          <el-input v-model="hotel.city" placeholder="" slot="con"></el-input>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="14">
        <Item title="地址:">
          <el-input v-model="hotel.address" placeholder="" slot="con"></el-input>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="14">
        <Item title="酒店封面图:">
          <el-input v-model="hotel.cover" placeholder="" slot="con"></el-input>
        </Item>
      </el-col>
      <el-col :span="8">
        <span :class="$style.tip">最好使用 http://cdn01.dwfei.com 域名</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row" v-show="hotel.cover">
      <el-col :offset="2" :span="8">
        <img :src="hotel.cover"/>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="8">
        <Item title="星级:">
          <el-rate v-model="hotel.stars" slot="con"></el-rate>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="14">
        <Item title="酒店介绍:">
          <textarea v-model="hotel.introduction" :class="$style.introduction" slot="con"></textarea>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="24">
        <Item title="">
          <el-button type="primary" @click="goList" slot="con">返回酒店列表</el-button>
          <el-button type="primary" @click="submit" slot="con">保存</el-button>
        </Item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as types from '~src/store/types'
import Item from '~src/components/item.vue'

export default {
  name: 'hotel-list-view',
  components: { Item },
  data () {
    return {
      hotel: {
        name: '',
        engName: '',
        city: '',
        address: '',
        cover: '',
        stars: 0,
        introduction: ''
      }
    }
  },
  computed: {
    currentHotel () {
      return this.$store.state.salesHotel.hotel
    }
  },
  created () {
    if (this.currentHotel) {
      this.hotel = Object.assign({}, this.currentHotel)
    }
  },
  methods: {
    goList () {
      this.$router.push('/sales/hotels')
    },
    submit () {
      this.$store.dispatch(types.UPDATE_SALES_HOTEL_DETAIL, { updateHotel: this.hotel }).then(() => {
        this.$message({
          message: this.$route.params.id ? '成功修改' : '成功添加',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="stylus" module>
.main
  padding-bottom 50px
  h2
    padding-left 20px
    font-size 18px
    line-height 40px
    color #669fc7
    font-weight normal
    padding-top 20px
    border-bottom 1px solid #c3c3c3

.row
  margin-top 20px

.introduction
  width 600px
  height 400px

.tip
  color #666
</style>
