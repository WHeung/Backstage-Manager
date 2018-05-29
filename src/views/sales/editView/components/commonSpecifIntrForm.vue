<template>
  <div>
    <preLine title="套餐说明"></preLine>
    <el-form :class="$style.form">
      <el-row>
        <intrItem title="套餐亮点" subTitle="（简短几个字描述亮点标签）">
          <Tags slot="con" v-model="intr.tags"></Tags>
        </intrItem>
      </el-row>
      <el-row>
        <intrItem title="套餐详细说明" subTitle="（若套餐附赠其他内容，请在此处说明）">
          <Editor slot="con" v-model="intr.introduction"></editor>
        </intrItem>
      </el-row>
      <template v-if="pType==='TRAVEL'">
        <el-row>
          <el-col :span="9">
            <intrItem title="费用包含">
              <Editor slot="con" v-model="intr.feeInclude"></editor>
            </intrItem>
          </el-col>
          <el-col :span="9" :offset="3">
            <intrItem title="费用不包含">
              <Editor slot="con" v-model="intr.feeExclude"></editor>
            </intrItem>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <intrItem title="购买须知">
              <Editor slot="con" v-model="intr.purchaseInfo"></editor>
            </intrItem>
          </el-col>
          <el-col :span="9" :offset="3">
            <intrItem title="目的国签证政策">
              <Editor slot="con" v-model="intr.visaInfo"></editor>
            </intrItem>
          </el-col>
        </el-row>
      </template>
    </el-form>
  </div>
</template>
<script>
import preLine from './line.vue'
import intrItem from './intrItem.vue'
import Tags from './tagsComponent.vue'
import Editor from '~src/components/medium-editor.vue'
import compareObj from '~src/tool/compareObj'

export default{
  name: 'travel-specif-intr',
  components: { preLine, intrItem, Tags, Editor },
  data () {
    return {
      form: {
        tags: '',
        introduction: '',
        feeInclude: '',
        feeExclude: '',
        purchaseInfo: '',
        visaInfo: ''
      }
    }
  },
  props: {
    value: Object,
    pType: String
  },
  computed: {
    intr () {
      return Object.assign(this.form, this.value)
    }
  },
  watch: {
    intr: {
      handler (val) {
        const intr = Object.assign({}, val)
        if (!compareObj(intr, this.value)) { // 通过与表单各自排序后的对比， 不一样才进行更新，防止死循环
          this.$emit('input', intr)
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
</style>
