<template>
  <div :class="$style.main">
    <el-row :class="$style.row" :gutter="20">
      <el-col :span="10">
        <Item title="input:">
          <el-input slot="con" disabled v-model="form.disabled"></el-input>
        </Item>
      </el-col>
      <el-col :span="10">
        <Item title="input:" :noblank="true">
          <el-input slot="con" clearable v-model="form.input"></el-input>
        </Item>
      </el-col>
    </el-row>
    <el-row :class="$style.row" :gutter="20">
      <el-col :span="10">
        <Item title="select:" :noblank="true">
          <el-select placeholder="请选择" slot="con" v-model="form.select">
            <el-option label="one" value="one"></el-option>
            <el-option label="two" value="two"></el-option>
            <el-option label="three" value="three"></el-option>
            <el-option label="four" value="four"></el-option>
            <el-option label="five" value="five"></el-option>
          </el-select>
        </Item>
      </el-col>
      <el-col :span="10">
        <Item title="searchSelect:" :noblank="true">
          <el-select placeholder="可输入搜索" slot="con" multiple filterable v-model="form.searchSelect">
            <el-option label="one" value="one"></el-option>
            <el-option label="two" value="two"></el-option>
            <el-option label="three" value="three"></el-option>
            <el-option label="four" value="four"></el-option>
            <el-option label="five" value="five"></el-option>
          </el-select>
        </Item>
      </el-col>
    </el-row>
    <el-row :class="$style.row" :gutter="20">
      <el-col :span="10">
        <Item title="date:" :noblank="true">
          <el-date-picker slot="con" type="datetime" v-model="form.date"></el-date-picker>
        </Item>
      </el-col>
      <el-col :span="10">
        <Item title="switch:">
          <el-switch slot="con" active-color="#20a0ff" inactive-color="#bfcdb9" v-model="form.switch"></el-switch>
        </Item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as Types from '~src/store/types.js'
import Item from '~src/components/inputItem/index.vue'

export default {
  name: 'input-view',
  components: { Item },
  data () {
    return {
      form: {
        disabled: 'disabled',
        input: '',
        date: '',
        switch: '',
        select: '',
        searchSelect: ''
      }
    }
  },
  created () {
    this.$store.commit(Types.SET_BREAD_NAV, ['功能模板', '基本表单'])
  }
}
</script>

<style lang="stylus" module>
.row
  margin-top 15px
</style>
