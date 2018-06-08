<template>
  <el-form :class="$style.form" :rules="rules" ref="form" :model="main">
    <el-row :gutter="20">
      <el-col :span="10">
        <Item :titClass="$style.itemTit" title="ID:">
          <el-form-item slot="con" prop="id">
          <el-input v-model="main.id" disabled></el-input>
          </el-form-item>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="20">
        <Item :titClass="$style.itemTit" title="标题:" :noblank="true">
          <el-form-item slot="con" prop="title" :rules="rules.required">
          <el-input v-model="main.title"></el-input>
          </el-form-item>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <Item :titClass="$style.itemTit" title="开售时间(可不填):">
          <el-form-item slot="con" prop="openTime">
          <el-date-picker type="datetime" v-model="openTime"></el-date-picker>
          </el-form-item>
        </Item>
      </el-col>
      <el-col :span="10" :offset="1">
        <Item :titClass="$style.itemTit" title="下架时间(可不填):">
          <el-form-item slot="con" prop="closeTime">
          <el-date-picker type="datetime" v-model="closeTime"></el-date-picker>
          </el-form-item>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <Item :titClass="$style.itemTit" title="每日推荐:">
          <el-select slot="con" v-model="main.recommend" placeholder="请选择">
            <el-option label="是" value="YES"></el-option>
            <el-option label="否" value="NO"></el-option>
          </el-select>
        </Item>
      </el-col>
      <el-col :span="8" :offset="3">
        <Item :titClass="$style.itemTit" title="推荐排序:">
          <el-input slot="con" v-model.number="main.sortNo"></el-input>
        </Item>
      </el-col>
    </el-row>
    <el-row :class="$style.row" :gutter="20">
      <div :class="$style.intrTtem">
        <div :class="$style.intrTit">
          <h2>封面展示小图</h2><span>限1张</span>
        </div>
        <Cover v-model="main.cover"></Cover>
      </div>
    </el-row>
    <el-row :class="$style.row" :gutter="20">
      <div :class="$style.intrTtem">
        <div :class="$style.intrTit">
          <h2>套餐展示大图</h2><span>数量不限</span>
        </div>
        <Pictures v-model="main.pictures"></Pictures>
      </div>
    </el-row>
    <el-row :class="$style.row" :gutter="20">
      <div :class="$style.intrTtem">
        <div :class="$style.intrTit">
          <h2>套餐亮点</h2><span>（简短几个字描述亮点标签）</span>
        </div>
        <Tags v-model="main.tags"></Tags>
      </div>
    </el-row>
  </el-form>
</template>
<script>
import Item from '~src/components/inputItem/index.vue'
import Tags from './tagsComponent.vue'
import Cover from './coverComponent.vue'
import Pictures from './picturesComponent.vue'
import compareObj from '~src/tool/compareObj'
import { DayDateToString, StringToDayDate, dateToString } from '~src/filters'

export default {
  name: 'main',
  components: { Tags, Cover, Pictures, Item },
  data () {
    return {
      initForm: {
        id: '',
        title: '',
        openTime: '',
        closeTime: '',
        cover: '',
        pictures: '',
        tags: '',
        recommend: 'YES',
        sortNo: ''
      }
    }
  },
  props: ['value', 'rules'],
  computed: {
    main () {
      return Object.assign(this.initForm, this.value)
    },
    openTime: {
      get () {
        return this.main.openTime ? new Date(this.main.openTime) : ''
      },
      set (val) {
        this.main.openTime = val ? dateToString(val) : ''
      }
    },
    closeTime: {
      get () {
        return this.main.closeTime ? new Date(this.main.closeTime) : ''
      },
      set (val) {
        this.main.closeTime = val ? dateToString(val) : ''
      }
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

.row
  margin-top 20px

.duration
  display flex

.durationDay
  max-width 68px
.durationTime
  max-width 102px

.itemTit
  width 120px

.intrItem
  margin-bottom 20px
  &:after
    display table
    content ''
    clear both

.intrTit
  margin 10px 0
  >h2
    color #000
    font-size 20px
    font-family simHei
    display inline
    margin-right 10px
</style>

