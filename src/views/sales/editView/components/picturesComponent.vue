<template>
  <div>
    <div :class="$style.picList" v-for="(pic,index) in this.pictures" :key="index">
      <img :src="pic">
      <div :class="$style.modal">
        <i class="el-icon-delete2" @click="removePic(index)"></i>
      </div>
    </div>
    <div :class="$style.progressList" v-for="(progress,index) in progressList" :key="index">
      <el-progress type="circle" :percentage="progress"></el-progress>
    </div>
    <el-upload
      :class="$style.avatarUploader"
      action="/admin-sell/upload/img"
      name="upLoadImgs"
      multiple
      :on-progress="progress"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :before-upload="beforeUpload"
      :on-error="onError">
      <i :class="$style.avatarUploaderIcon" class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'pictures-Component',
  data () {
    return {
      progressList: {}
    }
  },
  props: ['value'], // value: "imgUrl,imgUrl,imgUrl"
  computed: {
    pictures () {
      return this.value ? this.value.split(',') : []
    }
  },
  methods: {
    uploadSuccess (res, file, fileList) {
      if (res.state.code === 0 && res.data.pictures) {
        const picture = res.data.pictures.split(',')[0]
        this.pictures.push(picture)
        this.emit()
      } else {
        res.state.msg ? this.$message.error(res.state.msg) : this.$message.error('上传失败，请重试')
      }
    },
    beforeUpload (file) {
      const isLt500K = file.size / 1024 < 500
      if (!isLt500K) {
        this.$message.error('上传头像图片大小不能超过 500KB!')
      }
      return isLt500K
    },
    progress (event, file, fileList) {
      if (event && typeof event.percent === 'number') {
        if (event.percent !== 100) {
          this.$set(this.progressList, file.name, parseInt(event.percent))
        } else {
          delete this.progressList[file.name]
          this.progressList = Object.assign({}, this.progressList)
        }
      } else if (file) {
        delete this.progressList[file.name]
      }
    },
    removePic (index) {
      this.pictures.splice(index, 1)
      this.emit()
    },
    onError (err) {
      this.$message.error(err)
    },
    emit () {
      this.$emit('input', this.pictures.join(','))
    }
  }
}
</script>

<style lang="stylus" module>
.picList
  display inline-block
  position relative
  margin 0 10px 10px 0
  width 375px
  border 0
  background #fff
  cursor pointer
  vertical-align top
  img
    width 100%
    height 100%
    display block

.progressList
  position relative
  margin 0 10px 10px 0
  width 375px
  height 250px
  line-height 250px
  background-color rgba(0,0,0,.3)
  cursor pointer
  vertical-align top
  text-align center
  border 1px dashed #d9d9d9
  border-radius 6px
  display inline-flex
  justify-content center
  align-items center

.modal
  position absolute
  width 100%
  height 100%
  left 0
  top 0
  cursor default
  text-align center
  color #fff
  opacity 0
  font-size 20px
  background-color rgba(0,0,0,.5)
  transition opacity .3s
  display flex
  justify-content center
  align-items center
  i
    font-size 30px
    cursor pointer
  &:hover
    opacity 1
.avatarUploader
  display inline-block
  border 0
  background #fff
  cursor pointer
  .avatarUploaderIcon
    width 375px
    height 250px
    line-height 250px
    box-sizing border-box
    font-size 28px
    color #8c939d
    text-align center
    border 1px dashed #d9d9d9
    border-radius 6px
    position relative
    overflow hidden
    &:hover
      border-color #20a0ff


</style>
