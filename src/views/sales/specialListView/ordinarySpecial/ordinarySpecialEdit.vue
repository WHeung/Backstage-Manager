<template>
  <el-form :class="$style.form" :inline="true" label-position="right" label-width="130px">
    <el-row>
      <inline-item out="12" title="专题ID：">
        {{ specialDetail.id ? specialDetail.id : '-' }}
      </inline-item>
      <inline-item out="12" title="是否显示：">
        <el-select placeholder="是否显示" v-model="specialDetail.visible">
        <el-option v-for="item in pageConfig.visibleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"></el-option>
        </el-select>
      </inline-item>
    </el-row>
    <el-row>
      <inline-item out="12" title="专题类型：">
        <el-input value="普通专题" disabled ></el-input>
      </inline-item>
      <inline-item out="12" title="首页专题名称：">
        <el-input  v-model="specialDetail.name"></el-input>
      </inline-item>
    </el-row>
    <el-row>        
      <inline-item out="12" title="专题导航栏标题：">
        <el-input v-model="specialDetail.title"></el-input>
      </inline-item>
      <inline-item out="12" title="专题下方小字描述">
        <el-input v-model="specialDetail.promotion"></el-input>
      </inline-item>
    </el-row>
    <el-row>
      <intrItem title="专题页描述：">
        <editor slot="con" v-if="this.$route.params.id && specialDetail.introduction ||!this.$route.params.id" v-model="specialDetail.introduction"></editor>
      </intrItem>
    </el-row>
    <el-row>
      <intrItem title="专题页banner展示图（限一张）" subTitle="尺寸：750px宽，高度无限制"></intrItem>
      <single-pic-upload
        @editPic="editBanner"
        :source="specialDetail.cover"
        :name="'banner'">
      </single-pic-upload>
    </el-row>
    <preLine title="设置专题产品"></preLine>
      <el-row :class="$style.rowWrap">
        <el-select v-model="selectedProduct" filterable placeholder="请选择（可输入搜索）" multiple style="width: 400px;">
          <el-option
            v-for="item in specialProductList"
            :key="item.id"
            :label="item.id + ' ' + item.title"
            :value="item">
          </el-option>
        </el-select>
        <el-button @click="addProduct" style="margin-left: 10px">确定</el-button>
        <div :class="$style.productNum">
          产品数量：{{ specialDetail.nationSells.length }}
        </div>
      </el-row>
    <el-row>
      <el-table :data="specialDetail.nationSells" border style="width: 100%">
      <el-table-column prop="sellId" label="库存ID" width="80"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="originalPrice" label="成人价/人" width="100"></el-table-column>
      <el-table-column label="排序" width="100">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.sortNo"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button @click="deleteSpecialProduct(scope.row.id)" type="text" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-row>
    <el-row>  
      <div :class="$style.rowWrap">
        <el-button type="primary" @click="save">保存</el-button>
        <el-checkbox :class="$style.radio" v-model="specialDetail.visible">保存并展示</el-checkbox>
      </div>
    </el-row>
  </el-form>
</template>
<script>
  import * as types from '~src/store/types'
  import editor from '~src/components/mediumEditor/index.vue'
  import intrItem from '../../editView/components/intrItem.vue'
  import preLine from '../../editView/components/line.vue'
  import inlineItem from '../../editView/components/inlineItem.vue'
  import singlePicUpload from '~src/components/picUpload/singlePicUpload.vue'

  export default {
    name: 'country-special-edit',
    components: {
      editor: editor,
      intrItem: intrItem,
      preLine: preLine,
      inlineItem: inlineItem,
      singlePicUpload: singlePicUpload
    },
    data () {
      return {
        specialDetail: {
          name: '',
          cover: '',
          introduction: '',
          nationSells: [],
          promotion: '',
          sortNo: '',
          tags: '',
          title: '',
          type: 'NORMAL',
          visible: ''
        },
        pageConfig: {
          visibleOptions: [{
            value: false,
            label: '否'
          }, {
            value: true,
            label: '是'
          }],
          picUploaddialogVisible: false
        },
        specialProductList: [],
        selectedProduct: {}
      }
    },
    computed: {
      detail () {
        return this.$store.state.salesSpecial.ordinarySpecial.detail
      }
    },
    created () {
      if (this.$route.params.id) {
        this.$store
          .dispatch(types.UPDATE_SPECIAL_DETAIL, { id: this.$route.params.id, type: 'NORMAL' })
          .then(() => {
            if (!this.detail.introduction) {
              this.detail.introduction = ' '
            }
            Object.assign(this.specialDetail, this.detail)
          })
      }
      const data = {
        page: {
          page: 1,
          size: 0
        },
        status: 'ON_SELL',
        // productType: 'TRAVEL',
        idorTitle: '',
        type: 'GENERAL'
      }
      this.$store.dispatch(types.UPDATE_SALES_DATA, { info: data }).then(res => {
        this.specialProductList = [...res.info]
      })
    },
    methods: {
      editBanner (val) {
        this.specialDetail.cover = val
      },
      save () {
        if (this.specialDetail.nationSells.length === 0) {
          delete this.specialDetail.nationSells
        }
        this.$store.dispatch(types.SUBMIT_SPECIAL_DETAIL, { nationDetail: this.specialDetail }).then((res) => {
          if (res.state.code === 0) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          } else {
            this.$message.error('保存失败')
          }
        })
      },
      addProduct () {
        for (var item of this.selectedProduct) {
          item.sellId = item.id
          this.specialDetail.nationSells.push(item)
        }
        // this.specialDetail.nationSells.concat(this.selectedProduct)
        this.selectedProduct = []
      },
      deleteSpecialProduct (id) {
        this.specialDetail.nationSells.forEach((item, index) => {
          if (item.id === id) {
            this.specialDetail.nationSells.splice(index, 1)
          }
        })
      }
    }
  }
</script>
<style lang="stylus" module>
  .row-wrap
    padding 10px 0
  .form
    padding 20px
  .product-num
    float right
  .radio
    margin-left 10px
</style>
