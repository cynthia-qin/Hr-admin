<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      accept="image/png,image/jpg,image/jpeg,image/gif"
      :limit="limit"
      :class="{ hidden: filsList.length === limit }"
      :on-change="handleChange"
      :file-list="filsList"
      :http-request="handleRequest"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-progress

      style="width: 180px"
      :percentage="percent"
    />
    <el-dialog :visible.sync="dialogVisible" title="预览">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDSnwsc8YfZM3Zv3xfDNL7jCSW9h7RccPx',
  SecretKey: 'To00oRt9CH9oLl26xfFd8TiV7YmnaAZs'
})
export default {
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      filsList: [], // 上传的文件列表
      percent: 0,
      showPercent: false
    }
  },
  methods: {
    handleRemove (file) {
      console.log(file)
      console.log(this.filsList)
      this.filsList = this.filsList.filter(item => item.uid !== file.uid)
      console.log(this.filsList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      console.log(file)
    },
    handleChange (file, filsList) {
      this.filsList = filsList
    },
    handleRequest (params) {
      this.showPercent = true
      // console.log(params)
      cos.putObject({
        Bucket: 'cynthia-123-1312866065', /* 必须 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
        Key: Date.now() + params.file.name, /* 必须 */
        StorageClass: 'STANDARD',
        Body: params.file, // 上传文件对象
        onProgress: (progressData) => {
          // console.log(JSON.stringify(progressData))
          this.percent = Math.ceil(progressData.loaded / progressData.total * 100)
          console.log(this.percent)
        }
      }, (err, data) => {
        console.log(err || data)
        // this.src = data.Location
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.hidden ::v-deep .el-upload--picture-card {
  display: none;
}
</style>
