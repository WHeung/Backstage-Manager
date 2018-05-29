<template>
  <div :class="$style.main">
    <h2>订单信息</h2>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="16">
        <Item title="标记:">
          <span :class="$style.markIcon" slot="con" @click="toggleMark">
            <i class="el-icon-star-on" v-if="detail.orderMark === 'YES'"></i>
            <i class="el-icon-star-off" v-else></i>
          </span>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="8">
        <Item title="主订单号:">
          <div :class="$style.con" slot="con">{{detail.orderId}}</div>
        </Item>
      </el-col>
      <el-col :span="8">
        <Item title="支付时间:">
          <div :class="$style.con" slot="con">{{detail.payTime}}</div>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="8">
        <Item title="下单手机:">
          <div :class="$style.con" slot="con">{{detail.phone}}</div>
        </Item>
      </el-col>
      <el-col :span="8">
        <Item title="订单状态:">
          <el-select slot="con" v-model="status" placeholder="全部状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row" v-for="(err, index) in errLogs" :key="index">
      <el-col :span="14">
        <Item :title="`错误信息${index + 1}:`">
          <div :class="$style.errMsg" slot="con">
            <div :class="$style.errDate">{{errLogs[index].logDateStr}}</div>&nbsp;&nbsp;
            <el-input v-model.trim="errLogs[index].logMsg"></el-input>
          </div>
        </Item>
      </el-col>
      <template v-if="index === errLogs.length - 1">
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-plus" @click="addErrLog"></el-button>
        </el-col>
        <el-col :span="2" v-if="index !== 0 && !err.id">
          <el-button type="primary" icon="el-icon-minus" @click="popErrLog"></el-button>
        </el-col>
      </template>
    </el-row>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="8">
        <el-upload
          action="/admin-sell/upload/img"
          name="upLoadImgs"
          :on-success="(res, file) => {uploadSuccess(res, 'uploadPass')}"
          :show-file-list="false"
          :limit="1">
          <Item title="入台证上传:">
            <div slot="con" style="font-size: 12px;line-height: 10px;">
              <el-button :class="$style.con">上传</el-button>&nbsp;(多个文件请压缩成zip格式)
            </div>
          </Item>
        </el-upload>
      </el-col>
      <el-col :span="8">
        <el-upload
          action="/admin-sell/upload/img"
          name="upLoadImgs"
          :on-success="(res, file) => {uploadSuccess(res, 'uploadInsu')}"
          :show-file-list="false"
          :limit="1">
          <Item title="保单上传:">
            <div slot="con" style="font-size: 12px;line-height: 10px;">
              <el-button :class="$style.con">上传</el-button>&nbsp;(多个文件请压缩成zip格式)
            </div>
          </Item>
        </el-upload>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row" v-if="uploadPass || uploadInsu">
      <el-col :span="8">
        <Item title="入台证下载:" v-if="uploadPass">
          <div slot="con" style="font-size: 12px;">
            <a :href="uploadPass" download>
              <el-button :class="$style.con">
                下载查看
              </el-button>
            </a>
          </div>
        </Item>
      </el-col>
      <el-col :span="8">
        <Item title="保单下载:" v-if="uploadInsu">
          <div slot="con" style="font-size: 12px;">
            <a :href="uploadInsu" download>
              <el-button :class="$style.con">
                下载查看
              </el-button>
            </a>
          </div>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="uploadPass || uploadInsu">
      <el-col :span="8">
        <div :class="$style.httpTxt" v-if="uploadPass">
          {{uploadPass}}
        </div>
      </el-col>
      <el-col :span="8">
        <div :class="$style.httpTxt" v-if="uploadInsu">
          {{uploadInsu}}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="4" :offset="1">
        <el-button type="primary" @click="updateOrder">确定修改订单</el-button>
      </el-col>
    </el-row>
    <h2>行程信息</h2>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="8">
        <Item title="入台日期:">
          <div :class="$style.con" slot="con">{{detail.entryDate}}</div>
        </Item>
      </el-col>
      <el-col :span="8">
        <Item title="出台日期:">
          <div :class="$style.con" slot="con">{{detail.exitDate}}</div>
        </Item>
      </el-col>
    </el-row>
    <h2>申请人信息&nbsp;&nbsp;&nbsp;<el-button :class="$style.titBtn" size="small" type="primary" @click="allDownload">打包下载申请人信息</el-button></h2>
    <div :class="$style.pItem" v-for="pGroup in personList" :key="pGroup.personId">
      <h3>子订单号: {{pGroup.orderId}}</h3>
      <el-row :gutter="20" :class="$style.row">
        <el-col :span="9">
          <Item title="主申请人姓名:">
            <div :class="$style.con" slot="con">{{pGroup.mainApplyName}}</div>
          </Item>
        </el-col>
        <el-col :span="9">
          <Item title="旅客身份:">
            <div :class="$style.con" slot="con">{{pGroup.mainApplyIdentity}}</div>
          </Item>
        </el-col>
      </el-row>
      <el-row :gutter="20" :class="$style.row" v-if="pGroup.mainApplyUrl">
        <el-col :class="$style.row" :span="9" v-for="(item, key) in config" :key="key" v-if="pGroup.mainApplyUrl[key]">
          <Item :title="item + ':'" :titClass="$style.titClass">
            <div slot="con" style="font-size: 12px;">
              <el-button :class="$style.con" @click="singleDownload(pGroup.mainApplyUrl[key], pGroup.personDegree + key)">
                下载查看
              </el-button>
            </div>
          </Item>
        </el-col>
      </el-row>
      <div :class="$style.itemLine"></div>
      <div :class="$style.pOther" v-for="pOther in pGroup.attrs" :key="pOther.personId">
        <el-row :gutter="20" :class="$style.row">
          <el-col :span="9">
            <Item title="随行亲属姓名:">
              <div :class="$style.con" slot="con">{{pOther.otherPersonName}}</div>
            </Item>
          </el-col>
        </el-row>
        <el-row :gutter="20" :class="$style.row" v-if="pOther.otherPersonUrl">
          <el-col :class="$style.row" :span="9" v-for="(item, key) in config" :key="key" v-if="pOther.otherPersonUrl[key]">
            <Item :title="item + ':'" :titClass="$style.titClass">
              <div slot="con" style="font-size: 12px;">
                <el-button :class="$style.con" @click="singleDownload(pGroup.mainApplyUrl[key], pGroup.personDegree + key)">
                  下载查看
                </el-button>
              </div>
            </Item>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Item from '~src/components/item.vue'
import * as types from '~src/store/types'
import config from './config'
import CallApi from '~src/store/api'

export default {
  name: 'sales-tw-order-view',
  components: { Item },
  data () {
    return {
      statusOptions: [
        { name: '确认中', value: 'TICKETING' },
        { name: '已送供应商', value: 'SENTAWAY' },
        { name: '审核失败，待重新提交', value: 'BACKAUDIT' },
        { name: '确认成功', value: 'SUCCESS' },
        { name: '确认失败', value: 'FAIL' }
      ],
      status: '',
      errLogs: [],
      uploadPass: '',
      uploadInsu: '',
      config: config,
      detail: {}
    }
  },
  created () {
    this.fetchData()
  },
  computed: {
    personList () {
      const persons = this.detail.applyPersons
      const data = {}
      if (persons) {
        const otherList = []
        persons.forEach(item => { // 遍历所有人，对主申请人并加上attrs空数组， 对随从归到一个新数组
          if (item.personDegree === 'MAIN') {
            item.attrs = []
            data[item.personId] = item
          } else {
            otherList.push(item)
          }
        })
        otherList.forEach(item => { // 遍历所有随从，吧每个随从放进主申请人attrs中
          data[item.mainPersonId] && data[item.mainPersonId].attrs.push(item)
        })
      }
      return data
    }
  },
  methods: {
    fetchData () {
      const orderId = this.$route.query.id
      CallApi(types.FETCH_SALES_TW_ORDER_DETAIL, orderId).then(res => {
        const data = res.data.data.orderDetail
        this.detail = data
        if (data.errLogBeans && data.errLogBeans.length) {
          this.errLogs = JSON.parse(JSON.stringify(data.errLogBeans))
        } else {
          this.errLogs = []
          this.addErrLog()
        }
        this.uploadPass = data.uploadEntryTwUrl || ''
        this.uploadInsu = data.uploadInsuranceUrl || ''
        this.status = data.status || ''
      })
    },
    statusFormatter (status) {
      const statusMap = {
        'NEW': '新订单',
        'TICKETING': '确认中',
        'SUCCESS': '确认成功',
        'WAITPAY': '待支付',
        'FAIL': '确认失败',
        'CANCELED': '关闭'
      }
      return statusMap[status]
    },
    updateOrder () {
      this.$confirm(`确认订单修改?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const errLogs = JSON.parse(JSON.stringify(this.errLogs))
        let lastLog
        while ((lastLog = errLogs[errLogs.length - 1], lastLog && !lastLog.logMsg && !lastLog.id)) {
          errLogs.pop()
        }
        const data = {
          orderDetail: Object.assign({}, this.detail, {
            orderId: this.detail.orderId,
            status: this.status,
            uploadEntryTwUrl: this.uploadPass,
            uploadInsuranceUrl: this.uploadInsu,
            errLogBeans: errLogs
          })
        }
        CallApi(types.FETCH_SALES_TW_ORDER_UPDATE, data).then(() => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.fetchData()
        })
      })
    },
    toggleMark () {
      const data = {
        orderId: this.detail.orderId,
        orderMark: this.detail.orderMark === 'YES' ? 'NO' : 'YES'
      }
      this.$store.dispatch(types.UPDATE_SALES_ORDER_MARK, data).then(() => {
        this.$message.success('修改成功')
        this.fetchData()
      }).catch(() => {
        this.$message.error('修改失败，请重试')
      })
    },
    addErrLog () {
      this.errLogs.push({
        logMsg: '',
        logDate: '',
        logDateStr: ''
      })
    },
    popErrLog () {
      this.errLogs.pop()
    },
    uploadSuccess (res, name) {
      if (res.state.code === 0 && res.data.pictures) {
        const cover = res.data.pictures.split(',')[0]
        this[name] = cover
      } else {
        res.state.msg ? this.$message.error(res.state.msg) : this.$message.error('上传失败，请重试')
      }
    },
    singleDownload (urls, name) {
      const list = urls.split(',')
      const index = 0
      createDownload(list, name, index)
      // list.forEach((item, index) => {
      //   const a = document.createElement('a')
      //   a.href = item
      //   a.download = name + index // 跨域下载会导致download下载无效
      //   a.click()
      // })
    },
    allDownload () {
      CallApi(types.FETCH_SALES_TW_ORDER_FILE, this.detail.orderId)
    }
  }
}

function createDownload (list, name, index) {
  const a = document.createElement('a')
  const item = list[index]
  a.href = item
  a.download = name + index // 跨域下载会导致download下载名称无效
  a.click()
  // 如果循环调用click只会触发最后一次，前面都不触发，使用递归方式解决
  if (list[index + 1]) {
    setTimeout(() => {
      createDownload(list, name, index + 1)
    }, 200)
  }
}
</script>

<style lang="stylus" module>
a
  text-decoration unset
.main
  background-color #fff
  width 100%
  padding-bottom 40px

.row
  margin-top 20px

.main h2
  padding-left 20px
  font-size 18px
  line-height 50px
  color #669fc7
  font-weight normal
  padding-top 30px
  border-bottom 1px solid #c3c3c3

.main h3
  padding-left 20px
  font-size 16px
  line-height 40px
  color #669fc7
  font-weight normal

.con
  min-height 34px
  line-height 34px
  background-color #f5f5f5
  border 1px solid #c3c3c3
  padding-left 10px

.notice
  line-height 36px
  color #675f6d

.markIcon i
  line-height 37px
  cursor pointer

.pItem
  margin-top 40px
  border 1px solid #888
  padding 10px 0
.itemLine
  margin 30px 10px 0
  height 1px
  background #ddd
.pOther
  margin-top 30px

.titClass
  label
    font-size 13px
    line-height normal
    height 40px
    display flex
    align-items center
    justify-content flex-end

.httpTxt
  word-wrap break-word
  font-size 12px
  padding-left 30px

.errMsg
  display flex
.errDate
  font-size 13px
  flex 0 0 73px
  line-height 21px
  background #eee
  border-radius 4px
  text-align center
  color #000
</style>
