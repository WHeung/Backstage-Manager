<template>
  <div :class="$style.main">
    <h2>产品信息：</h2>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="16">
        <Item title="特卖标题:">
          <div :class="$style.con" slot="con">{{detail.title}}</div>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="8">
        <Item title="出发时间:" v-if="detail.productType==='TRAVEL'">
          <div :class="$style.con" slot="con">{{detail.departureTime}}</div>
        </Item>
      </el-col>
      <el-col :span="8">
        <Item title="tabtip:">
          <div :class="$style.con" slot="con">{{detail.tabTip}}</div>
        </Item>
      </el-col>
    </el-row>
    <h2>订单信息：</h2>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="8">
        <Item title="订单号:">
          <div :class="$style.con" slot="con">{{detail.orderId}}</div>
        </Item>
      </el-col>
      <el-col :span="8">
        <Item title="库存ID:">
          <div :class="$style.con" slot="con">{{detail.storeId}}</div>
        </Item>
      </el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :span="8">
        <Item title="出票状态:">
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
      <el-col :span="4">
        <el-button type="primary" @click="changeStatus">确定修改出票状态</el-button>
      </el-col>
      <el-col :span="4" :offset="1" :class="$style.markIcon">
        <span @click="toggleMark">
          <i class="el-icon-star-on" v-if="detail.orderMark === 'YES'"></i>
          <i class="el-icon-star-off" v-else></i>
        </span>
      </el-col>
    </el-row>
    <h2>订单联系人信息：</h2>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="8">
        <Item title="姓名:">
          <div :class="$style.con" slot="con">{{detail.contactName}}</div>
        </Item>
      </el-col>
      <el-col :span="8">
        <Item title="手机号码:">
          <div :class="$style.con" slot="con">{{detail.contactMobile}}</div>
        </Item>
      </el-col>
    </el-row>
    <el-row :gutter="20" :class="$style.row">
      <el-col :span="8">
        <Item title="联系邮箱:">
          <div :class="$style.con" slot="con">{{detail.contactEmail}}</div>
        </Item>
      </el-col>
      <el-col :span="8">
        <Item title="地址:">
          <div :class="$style.con" slot="con">{{detail.contactAddress}}</div>
        </Item>
      </el-col>
    </el-row>
    <h2>出行人信息：</h2>
    <div v-for="item in detail.goManList" :key="item.id">
      <h3>{{item.title}}：</h3>
      <el-row :gutter="20" :class="$style.row">
        <el-col :span="8">
          <Item title="中文名称:">
            <div :class="$style.con" slot="con">{{item.cnName}}</div>
          </Item>
        </el-col>
      </el-row>
      <template v-if="detail.productType==='TRAVEL'">
        <el-row :gutter="20" :class="$style.row">
          <el-col :span="8">
            <Item title="姓:">
              <div :class="$style.con" slot="con">{{item.familyName}}</div>
            </Item>
          </el-col>
          <el-col :span="8">
            <Item title="名:">
              <div :class="$style.con" slot="con">{{item.firstName}}</div>
            </Item>
          </el-col>
        </el-row>
        <el-row :gutter="20" :class="$style.row">
          <el-col :span="8">
            <Item title="护照号码:">
              <div :class="$style.con" slot="con">{{item.passportNo}}</div>
            </Item>
          </el-col>
          <el-col :span="8">
            <Item title="证件有效期:">
              <div :class="$style.con" slot="con">{{item.passportExpire}}</div>
            </Item>
          </el-col>
        </el-row>
        <el-row :gutter="20" :class="$style.row" v-if="item.hkPassNo">
          <el-col :span="8">
            <Item title="香港通行证:">
              <div :class="$style.con" slot="con">{{item.hkPassNo}}</div>
            </Item>
          </el-col>
          <el-col :span="8">
            <Item title="证件有效期:">
              <div :class="$style.con" slot="con">{{item.hkPassExpire}}</div>
            </Item>
          </el-col>
        </el-row>
        <el-row :gutter="20" :class="$style.row" v-if="item.taiwanPassNo">
          <el-col :span="8">
            <Item title="台湾通行证:">
              <div :class="$style.con" slot="con">{{item.taiwanPassNo}}</div>
            </Item>
          </el-col>
          <el-col :span="8">
            <Item title="证件有效期:">
              <div :class="$style.con" slot="con">{{item.taiwanPassExpire}}</div>
            </Item>
          </el-col>
        </el-row>
        <el-row :gutter="20" :class="$style.row">
          <el-col :span="8">
            <Item title="国籍:">
              <div :class="$style.con" slot="con">{{item.nation}}</div>
            </Item>
          </el-col>
          <el-col :span="8">
            <Item title="出生日期:">
              <div :class="$style.con" slot="con">{{item.birthday}}</div>
            </Item>
          </el-col>
        </el-row>
        <el-row :gutter="20" :class="$style.row">
          <el-col :span="8">
            <Item title="性别:">
              <div :class="$style.con" slot="con">{{item.gender}}</div>
            </Item>
          </el-col>
          <el-col :span="8">
            <Item title="邮箱:">
              <div :class="$style.con" slot="con">{{item.email}}</div>
            </Item>
          </el-col>
        </el-row>
      </template>
    </div>
    <h2>订单金额：</h2>
    <el-row :class="$style.row">
      <el-col :span="8">
        <Item title="成人:">
          <div :class="$style.con" slot="con">{{detail.adultsCount * detail.adultUnitPrice}}元</div>
        </Item>
      </el-col>
      <el-col :class="$style.notice" :span="8">
        {{detail.adultUnitPrice + '元'}} * {{detail.adultsCount + '人'}}
      </el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :span="8">
        <Item title="儿童:">
          <div :class="$style.con" slot="con">{{detail.childrenCount * detail.childUnitPrice}}元</div>
        </Item>
      </el-col>
      <el-col :class="$style.notice" :span="8">
        {{detail.childUnitPrice + '元'}} * {{detail.childrenCount + '人'}}
      </el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :span="8">
        <Item title="房间差价:">
          <div :class="$style.con" slot="con">{{detail.roomDiffPrice}}元</div>
        </Item>
      </el-col>
    </el-row>
    <template v-for="item in detail.adminInsuranceBeanList">
      <el-row :class="$style.row">
        <el-col :span="8">
          <Item :title="item.insuranName">
            <div :class="$style.con" slot="con">{{item.totalPrice}}元</div>
          </Item>
        </el-col>
        <el-col :class="$style.notice" :span="8">
          {{item.unitPrice + '元'}} * {{item.counts + '人'}}
        </el-col>
      </el-row>
    </template>
    <el-row :class="$style.row">
      <el-col :span="8">
        <Item title="订单总价:">
          <div :class="$style.con" slot="con">{{detail.totalPrice}}元</div>
        </Item>
      </el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :span="8">
        <Item title="代金券:">
          <div :class="$style.con" slot="con">{{detail.couponPrice}}元</div>
        </Item>
      </el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :span="8">
        <Item title="实际支付:">
          <div :class="$style.con" slot="con">{{detail.payAmount}}元</div>
        </Item>
      </el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :span="8">
        <Item title="订单状态:">
          <div :class="$style.con" slot="con">{{statusFormatter(detail.status)}}</div>
        </Item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Item from '~src/components/item.vue'
import * as types from '~src/store/types'

export default {
  name: 'sales-order-detail-view',
  components: { Item },
  data () {
    return {
      statusOptions: [
        { name: '待支付', value: 'WAITPAY' },
        { name: '确认中', value: 'TICKETING' },
        { name: '确认成功', value: 'SUCCESS' },
        { name: '确认失败', value: 'FAIL' },
        { name: '取消', value: 'CANCELED' }
      ],
      status: ''
    }
  },
  created () {
    this.fetchData()
  },
  computed: {
    detail () {
      return this.$store.state.salesOrder.detail || {}
    }
  },
  methods: {
    fetchData () {
      const orderId = this.$route.params.id
      this.$store.dispatch(types.UPDATE_SALES_ORDER_DETAIL, { orderId }).then(() => {
        this.status = this.$store.state.salesOrder.detail.status || ''
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
    changeStatus () {
      const changeStatus = this.status
      const orderId = this.$route.params.id
      if (this.detail.productType === 'INSURANCE' && changeStatus !== 'FAIL') {
        this.$alert('保单信息只能修改成确认失败', {
          confirmButtonText: '知道了'
        })
        return
      }
      this.$confirm(`确认将订单状态修改成: ${this.statusFormatter(this.status)} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch(types.UPDATE_SALES_ORDER_CHANGE_STATUS, { orderId, changeStatus }).then(() => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
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
    }
  }
}
</script>

<style lang="stylus" module>
.main
  background-color #fff
  width 100%
  padding-bottom 40px

.row
  margin-top 20px

.main h2
  padding-left 20px
  font-size 18px
  line-height 40px
  color #669fc7
  font-weight normal
  padding-top 20px
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
</style>
