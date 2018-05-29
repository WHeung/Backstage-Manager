<template>
  <div :class="$style.inputList">
    <div :class="$style.inputItem" v-for="(tag,index) in tags" :key="index">
      <el-input :class="$style.elInput" v-model="tags[index]" @change="change(index)"></el-input>
      <el-button @click="delTag(index)" :class="[$style.delTagBtn,{[$style.hidden]: index === 0}]" size="small">删除</el-button>
    </div>
    <div :class="$style.addTagBtn">
      <el-button :class="$style.addTagBtn" @click="addTag()">
        新增
      </el-button>
    </div>
  </div>  
</template>

<script>
export default {
  name: 'tags-Component',
  props: ['value'], // value: "多种多样,逗号分隔"
  computed: {
    tags () {
      return this.value ? this.value.split(',') : ['']
    }
  },
  methods: {
    addTag () {
      this.tags.push('')
      this.emit()
    },
    delTag (index) {
      this.tags.splice(index, 1)
      this.emit()
    },
    change (index) {
      this.tags[index] = this.tags[index].replace(/(^\s*)|(\s*$)/g, '')
      this.emit()
    },
    emit () {
      this.$emit('input', this.tags.join(','))
    }
  }
}
</script>

<style lang="stylus" module>
.inputList
  display flex
  flex-wrap wrap
  .inputItem
    flex-basis 20%
    display flex
    margin 0 20px 10px 0
    .elInput
      flex-bascic 80%
    .delTagBtn
      border 0
      background transparent

.addTagBtn
  height 100%
  line-height 100%
  color #20a0ff !important

.hidden
  visibility hidden
</style>
