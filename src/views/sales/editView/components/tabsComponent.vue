<template>
  <div>
    <el-tabs type="card" :class="$style.tabs" :value="actTab" @tab-click="clickTab">
      <template v-if="childs.length > 1">
      <el-tab-pane :name="index + ''" v-for="(child,index) in childs" :key="index">
        <el-badge slot="label" is-dot :hidden="hideDotList[index] || index + '' === actTab">
          <div :class="$style.tabtip">{{child.mainBean.tabTip}}</div>
        </el-badge>
      </el-tab-pane>
      </template>
      <el-tab-pane name="addTab" :closable="false">
        <span slot="label"><i class="el-icon-plus"></i> 添加规格</span>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogFormVisible" @close="cleanDialog" :before-close="beforeClose">
      <div slot="title" :class="$style.tabsTitle">请补充以下信息，方可新建</div>
      <el-form :model="newTabMsg" ref="form">
        <el-form-item label="第一个规格名称" label-width="130px" prop="firstTabtip" :rules="rules.required" v-if="childs.length===1">
          <el-input v-model="newTabMsg.firstTabtip" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新规格名称" label-width="130px" prop="newTabtip" :rules="rules.required">
          <el-input v-model="newTabMsg.newTabtip" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addTab">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as types from '~src/store/types'
import compareObj from '~src/tool/compareObj'

export default {
  name: 'edit-tabs-Component',
  components: { },
  data () {
    return {
      newTabMsg: {
        firstTabtip: '',
        newTabtip: ''
      },
      dialogFormVisible: false,
      oldTab: ''
    }
  },
  props: ['actTab', 'childs', 'rules'],
  computed: {
    originalChilds () {
      return this.$store.state.salesEdit.originalChilds
    },
    hideDotList () {
      return this.evalDot(this.actTab)
    }
  },
  created () {
    if (this.childs && this.childs.length > 1) {
      this.$store.dispatch(types.UPDATE_SALES_TABS, { actTab: this.childs.length - 1 + '' })
    }
  },
  methods: {
    clickTab (tab) {
      if (tab.name === 'addTab') { // 在点击tab添加产品的时候，保存 点击新增之前 激活的tab
        this.oldTab = this.actTab
        this.dialogFormVisible = true
      }
      if (tab.name !== this.actTab) {
        this.$store.dispatch(types.UPDATE_SALES_TABS, { actTab: tab.name })
      }
    },
    addTab () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.$store.dispatch(types.ADD_SALES_FORM_CHILD, { tabMsg: this.newTabMsg })
        } else {
          return
        }
      })
    },
    cancel () {
      this.dialogFormVisible = false
      if (this.childs.length !== 1 &&
      this.actTab === 'addTab' &&
      this.actTab !== this.oldTab) { // 当添加不成功关闭弹窗时，如果已经激活的tab不是addTab并且子产品不唯一时，跳回原来的tab
        this.$store.dispatch(types.UPDATE_SALES_TABS, { actTab: this.oldTab })
      }
    },
    beforeClose (done) {
      this.cancel()
      done()
    },
    cleanDialog () {
      this.newTabMsg = Object.assign(this.newTabMsg, {
        firstTabtip: '',
        newTabtip: ''
      })
    },
    evalDot () {
      const list = []
      this.childs.forEach((item, index) => {
        const isHide = this.originalChilds[index] ? compareObj(this.childs[index], this.originalChilds[index]) : false
        list.push(isHide)
      })
      return list
    }
  }
}
</script>

<style lang="stylus" module>
.tabs
  margin-top 20px

.tabtip
  min-width: 50px;
  text-align: center;
  box-sizing: border-box;
  height: 35px;
  line-height: 35px;

.tabsTitle
  position absolute
  left 50%
  transform translateX(-50%)
  color #f00
  font-size 13px

</style>
