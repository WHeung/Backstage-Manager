<template>
  <el-col :span="outLength" :offset="offset">
    <el-form-item :label="title" :prop="prop" :rules="rules">
      <el-col :span="inLength">
        <slot></slot>
      </el-col>
    </el-form-item>
  </el-col>
</template>

<script>
export default {
  name: 'intrItem',
  props: {
    title: String,
    prop: String,
    rules: Array,
    out: String,
    in: String,
    off: String
  },
  computed: {
    outLength () {
      return this.out ? parseInt(this.out) : 24
    },
    inLength () {
      return this.in ? parseInt(this.in) : 24
    },
    offset () {
      return this.off ? parseInt(this.off) : 0
    }
  }
}
</script>
