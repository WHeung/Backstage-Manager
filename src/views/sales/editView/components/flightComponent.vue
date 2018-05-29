<template>
  <el-form :class="$style.form" label-position="right" label-width="130px" :rules="rules" ref="form" :model="flight">
    <template v-if="type==='go'">
      <el-row>
        <inlineItem out="12" in="9" title="航空公司代码:" prop="companyCode" :rules="rules.required">
          <el-input v-model="flight.companyCode"></el-input>
        </inlineItem>
        <inlineItem out="12" in="9" title="航班号:" prop="flightNo" :rules="rules.required">
          <el-input v-model="flight.flightNo"></el-input>
        </inlineItem>
      </el-row>
    </template>
    <template v-else>
      <el-row>
        <inlineItem out="12" in="9" title="航司代码(选填):" prop="companyCode">
          <el-input v-model="flight.companyCode"></el-input>
        </inlineItem>
      </el-row>
      <el-row>
        <inlineItem out="12" title="返程日期:" prop="travelDays" :rules="rules.required">
          <el-col :span="2">第</el-col>
          <el-col :span="5">
            <el-input v-model.number="flight.travelDays"></el-input>
          </el-col>
          <el-col :span="2" :offset="1">天</el-col>
        </inlineItem>
        <inlineItem out="12" in="9" title="返程航班号:" prop="flightNo" :rules="rules.required">
          <el-input v-model="flight.flightNo"></el-input>
        </inlineItem>
      </el-row>
    </template>
    <el-row>
      <inlineItem out="12" in="9" title="出发机场代码:" prop="departureAirportCode" :rules="rules.required">
        <el-input placeholder="三字代码" v-model="flight.departureAirportCode"></el-input>
      </inlineItem>
      <inlineItem out="12" in="9" title="到达机场代码:" prop="arrivalAirportCode" :rules="rules.required">
        <el-input placeholder="三字代码" v-model="flight.arrivalAirportCode"></el-input>
      </inlineItem>
    </el-row>
    <el-row>
      <inlineItem out="8" title="出发时间:" prop="departureTime" :rules="rules.required">
        <!--<el-time-picker :picker-options="{format:'HH:mm'}" format="HH:mm"
          :value="flight.departureTime" @input="function(val){inputVal(val, 'departureTime')}"></el-time-picker>-->
        <el-time-select v-model="flight.departureTime"
        :picker-options="{ start: '00:00', step: '00:05', end: '23:59' }"></el-time-select>
      </inlineItem>
      <inlineItem out="8" title="到达时间:" prop="arrivalTime" :rules="rules.required">
        <el-time-select v-model="flight.arrivalTime"
        :picker-options="{ start: '00:00', step: '00:05', end: '23:59' }"></el-time-select>
      </inlineItem>
      <inlineItem out="8" title="飞行时间:">
        <el-time-select v-model="durationMinute"
        :picker-options="{ start: '00:30', step: '00:05', end: '18:00' }"></el-time-select>
      </inlineItem>
    </el-row>
  </el-form>
</template>

<script>
import inlineItem from './inlineItem.vue'
import compareObj from '~src/tool/compareObj'
// import { StringHHmmToDate, NumberMinutesToDate, DateToStringHHmm, DateToNumberMinutes } from '~src/filters'

export default {
  name: 'flight-component',
  components: { inlineItem },
  data () {
    return {
      form: {
        companyCode: '',
        flightNo: '',
        travelDays: '',
        departureAirportCode: '',
        arrivalAirportCode: '',
        isReturn: '',
        departureTime: '',
        arrivalTime: '',
        durationMinute: ''
      }
    }
  },
  props: {
    value: Object,
    rules: Object,
    type: String
  },
  computed: {
    flight () {
      const flight = this.initFlight(this.value)
      flight.isReturn = this.type === 'go' ? 'NO' : 'YES'
      return flight
    },
    durationMinute: {
      get () {
        if (typeof this.flight.durationMinute === 'number') {
          const num = this.flight.durationMinute
          const hours = parseInt(num / 60)
          const minutes = parseInt(num) % 60
          return hours + ':' + minutes
        } else {
          return ''
        }
      },
      set (val) {
        if (val) {
          const arr = val.split(':')
          this.flight.durationMinute = arr[0] * 60 + parseInt(arr[1])
        } else {
          this.flight.durationMinute = ''
        }
      }
    }
  },
  methods: {
    initFlight (value) {
      const flight = Object.assign(this.form, value)
      return flight
    }
  },
  watch: {
    flight: {
      handler (val) {
        const flight = Object.assign({}, val)
        if (!compareObj(flight, this.value)) {
          this.$emit('input', flight)
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-date-editor.el-input,.el-form-item__error
  width 123px
</style>
<style lang="stylus" module>
.form
  padding 20px 0
</style>

