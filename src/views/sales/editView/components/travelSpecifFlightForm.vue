<template>
  <div>
    <preLine title="航班信息"></preLine>
    <Flight type="go" :value="flightForm[0]" @input="changeFlight" :rules="rules" ref="form1"></Flight>
    <div :class="$style.line"></div>
    <Flight type="back" :value="flightForm[1]" @input="changeFlight" :rules="rules" ref="form2"></Flight>
  </div>
</template>
<script>
import preLine from './line.vue'
import Flight from './flightComponent.vue'
export default {
  name: 'travel-specif-flight',
  components: { preLine, Flight },
  data () {
    return {
      form: [{}, {}],
      initForm: [{}, {}]
    }
  },
  props: {
    value: Array,
    rules: Object,
    isFlight: Boolean
  },
  computed: {
    flightForm () {
      const value = JSON.parse(JSON.stringify(this.value)) // 数组内对象还是原来的value，所以先要进行深拷贝
      const flight = this.initFlight(value)
      return flight
    }
  },
  methods: {
    initFlight (value) {
      const flight = this.form
      flight[0] = Object.assign({}, value[0])
      flight[1] = Object.assign({}, value[1])
      return flight
    },
    changeFlight (val) {
      var flight
      if (val.isReturn === 'NO') {
        const flight1 = Object.assign({}, this.flightForm[1])
        flight = [val, flight1]
      } else {
        const flight0 = Object.assign({}, this.flightForm[0])
        flight0.travelDays = val.travelDays
        flight = [flight0, val]
      }
      this.isFlight && this.$emit('input', flight)
    }
  }
}
</script>
<style lang="stylus" module>
.floatLeft
  float left

.floatRight
  float right

.line
  border-bottom 1px solid #ddd
</style>
