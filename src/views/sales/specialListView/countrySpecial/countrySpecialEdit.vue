<template>
  <el-form :class="$style.form" :inline="true" label-position="right" label-width="130px">
    <el-row>
      <inline-item out="12" title="国家ID：">
        {{ specialDetail.id ? specialDetail.id : '-' }}
      </inline-item>
      <inline-item out="12"  title="是否显示：">
        <el-select placeholder="是否显示" v-model="specialDetail.visible">
          <el-option
            v-for="item in pageConfig.visibleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </inline-item>
    </el-row>
    <el-row>
      <inline-item out="12" title="专题类型：">
        <el-input value="国家专题" disabled></el-input>
      </inline-item>
      <inline-item out="12" title="所属国家：">
        <el-input v-model="specialDetail.nationName"></el-input>
      </inline-item>
    </el-row>
    <el-row>
      <inline-item out="12" title="导航栏标题">
        <el-input v-model="specialDetail.title"></el-input>
      </inline-item>
      <inline-item out="12" title="专题页标签">
        <el-input v-model="specialDetail.tags"></el-input>
      </inline-item>
    </el-row>
    <el-row>
      <intrItem title="专题页描述：">
        <editor slot="con" v-if="this.$route.params.id && specialDetail.introduction ||!this.$route.params.id" v-model="specialDetail.introduction"></editor>
      </intrItem>
    </el-row>
    <el-row>
      <intrItem title="封面展示图" subTitle="（限一张）国家：296 x 216px"></intrItem>
      <single-pic-upload
        @editPic="editCover"
        :source="specialDetail.coverMin"
        :name="'cover'">
      </single-pic-upload>
    </el-row>
    <el-row>
      <intrItem title="专题页banner展示图" subTitle="（限一张）尺寸：750px宽，高度无限制"></intrItem>
      <single-pic-upload
        @editPic="editBanner"
        :source="specialDetail.cover"
        :name="'banner'">
      </single-pic-upload>
    </el-row>
    <div v-if="this.$route.params.id">
      <preLine title="设置产品专题"></preLine>
      <el-row>
        <div :class="[$style.productNum, $style.rowWrap]">
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
            <!--<template slot-scope="scope">
              <el-button @click="deleteSpecialProduct(scope.row.id)" type="text" size="mini">删除</el-button>
            </template>-->
            <template slot-scope="scope">
              <el-button @click="editSpeicalProductVisible(scope.row)" type="text" size="mini">{{scope.row.visible ? '隐藏' : '显示'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <el-row >
      <div :class="$style.rowWrap">
        <el-button type="primary" @click="save">保存</el-button>
        <el-checkbox :class="$style.radio" v-model="specialDetail.visible">保存并展示</el-checkbox>
      </div>
    </el-row>
  </el-form>
</template>
<script>
  import * as types from '~src/store/types'
  import editor from '~src/components/medium-editor.vue'
  import intrItem from '../../editView/components/intrItem.vue'
  import inlineItem from '../../editView/components/inlineItem.vue'
  import preLine from '../../editView/components/line.vue'
  import singlePicUpload from '~src/components/picUpload/singlePicUpload.vue'
  
  export default {
    name: 'country-special-edit',
    components: {
      editor: editor,
      intrItem: intrItem,
      inlineItem: inlineItem,
      preLine: preLine,
      singlePicUpload: singlePicUpload
    },
    data () {
      return {
        specialDetail: {
          name: '',
          introduction: '',
          nationSells: [],
          promotion: '',
          sortNo: '',
          tags: '',
          title: '',
          type: 'COUNTRY',
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
          productVisibleOptions: {
            'true': '隐藏',
            'false': '显示'
          },
          picUploaddialogVisible: false
        }
      }
    },
    computed: {
      detail () {
        return this.$store.state.salesSpecial.countrySpecial.detail
      }
    },
    created () {
      if (this.$route.params.id) {
        this.$store.dispatch(types.UPDATE_SPECIAL_DETAIL, { id: this.$route.params.id, type: 'COUNTRY' }).then(() => {
          if (!this.detail.introduction) {
            this.detail.introduction = ' '
          }
          Object.assign(this.specialDetail, this.detail)
        })
      }
    },
    methods: {
      editSpeicalProductVisible (obj) {
        obj.visible = !obj.visible
      },
      deleteSpecialProduct (id) {
        this.specialDetail.nationSells.forEach((item, index) => {
          if (item.id === id) {
            this.specialDetail.nationSells.splice(index, 1)
          }
        })
      },
      editCover (val) {
        this.specialDetail.coverMin = val
      },
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
      }
    }
  }
</script>
<style lang="stylus" module>
  .row-wrap
    padding 10px 0
  .product-num
    display flex
    justify-content flex-end

  .form
    padding 20px

  .radio
    padding-left 10px
  .avatar-uploader .el-upload 
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  
  .avatar-uploader .el-upload:hover 
    border-color: #20a0ff;
  
  .avatar-uploader-icon 
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  
  .avatar 
    width: 296px;
    height: 216px;
    display: block;
  
</style>
