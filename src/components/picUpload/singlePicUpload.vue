<template>
  <el-upload
    action="/admin-sell/upload/img"
    list-type="picture-card"
    name="upLoadImgs"
    :on-success="handlePicUploadSuccess"
    :on-remove="handlePicRemove"
    :file-list="fileList"
    :disabled="fileList.length === 1">
    <i class="el-icon-plus"></i>
  </el-upload>
</template>
<script>
export default {
  name: 'sing-pic-upload',
  props: ['source', 'name'],
  computed: {
    fileList () {
      if (!this.source) {
        return []
      } else {
        return [{
          name: this.name,
          url: this.source
        }]
      }
    }
  },
  methods: {
    handlePicRemove () {
      this.$emit('editPic', '')
    },
    handlePicUploadSuccess (res, file, fileList) {
      if (res.state.code === 0 && res.data.pictures) {
        const cover = res.data.pictures.split(',')[0]
        // this.$emit('input', cover)
        this.$emit('editPic', cover)
      } else {
        res.state.msg ? this.$message.error(res.state.msg) : this.$message.error('上传失败，请重试')
      }
    }
  }
}
</script> 
<style lang="stylus" module>
</style>
