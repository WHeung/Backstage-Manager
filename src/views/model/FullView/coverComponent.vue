<template>
  <div :class="$style.main">
    <el-progress :class="$style.progress" :style="sizeStyle" type="circle" :percentage="percent"
    v-if="typeof percent === 'number'" :status="percent === 100 ? 'success' : ''"></el-progress>
    <el-upload
      v-if="!percent"
      :class="$style.avatarUploader"
      name="upLoadImgs"
      action="/admin-sell/upload/img"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-progress="progress"
      :before-upload="beforeUpload">
      <div :class="$style.avatar" :style="sizeStyle">
        <img v-if="value" :src="value" :class="$style.avatarImg" :style="cutStyle">
        <i v-else class="el-icon-plus" :class="$style.avatarUploaderIcon"></i>
      </div>
      <i v-if="value" class="el-icon-circle-cross" :class="$style.delIcon" @click.stop="remove"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'cover-Component',
  data () {
    return {
      percent: '',
      cutStyle: ''
    }
  },
  props: ['value', 'sizeStyle', 'cutPic'], // sizeStyle:{width:;height:;line-height:;}
  created () {
    if (this.cutPic) {
      if (this.cutPic === 'width') {
        this.cutStyle = {
          position: 'relative',
          width: 'auto',
          left: '50%',
          transform: 'translateX(-50%)'

        }
      }
      if (this.cutPic === 'height') {
        this.cutStyle = {
          position: 'relative',
          height: 'auto',
          top: '50%',
          transform: 'translateY(-50%)'

        }
      }
    }
  },
  methods: {
    progress (event, file, fileList) {
      if (event && typeof event.percent === 'number') {
        if (event.percent !== 100) {
          this.percent = parseInt(event.percent)
        } else {
          this.hidenProgress()
        }
      } else if (file) {
        this.hidenProgress()
      }
    },
    hidenProgress () {
      setTimeout(() => {
        this.percent = ''
      }, 500)
    },
    uploadSuccess (res, file, fileList) {
      if (res.state.code === 0 && res.data.pictures) {
        const cover = res.data.pictures.split(',')[0]
        this.$emit('input', cover)
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
    remove () {
      this.$emit('input', '')
    },
    onError (err) {
      this.$message.error(err)
    }
  }
}
</script>

<style lang="stylus" module>
.main .progress
  position relative
  margin 0 10px 10px 0
  width 162px
  height 162px
  line-height 162px
  background-color rgba(0,0,0,.3)
  cursor pointer
  vertical-align top
  text-align center
  border 1px dashed #d9d9d9
  border-radius 6px
  display inline-flex
  justify-content center
  align-items center

.avatarUploader
  > div
    cursor pointer
    position relative
.avatar
  width 162px
  height 162px
  line-height 162px
  border-radius 6px
  overflow hidden
  border 1px dashed #d9d9d9
  &:hover
    border-color: #20a0ff
  .avatarUploaderIcon
    font-size 28px
    width 100%
    height 100%
    color #8c939d
    text-align center

.avatarImg
  width 100%
  height 100%
  display block

.delIcon
  position absolute
  right -5px
  top -5px
  font-size 20px
  color #000
  background #fff
  border-radius 50%
</style>
