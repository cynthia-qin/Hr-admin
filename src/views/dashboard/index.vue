<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <input
        ref="myFile"
        type="file"
        accept="image/jpg,image/png,image/jpeg,image/png"
        @change="handleClick"
      />
      <img :src="'https://' + src" alt="" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDSnwsc8YfZM3Zv3xfDNL7jCSW9h7RccPx',
  SecretKey: 'To00oRt9CH9oLl26xfFd8TiV7YmnaAZs'
})
// console.log(cos)
export default {
  name: 'Dashboard',
  data () {
    return {
      src: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    handleClick (e) {
      // console.dir(e.target)
      cos.putObject({
        Bucket: 'cynthia-123-1312866065', /* 必须 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
        Key: 'cynthia', /* 必须 */
        StorageClass: 'STANDARD',
        Body: e.target.files[0], // 上传文件对象
        onProgress: function (progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        console.log(err || data)
        this.src = data.Location
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
