<template>
  <el-form label-width="80px">
    <el-form-item label="企业名称">
      <el-input
        disabled
        style="width: 400px"
        :value="companyInfo.name"
      ></el-input>
    </el-form-item>
    <el-form-item label="企业地址">
      <el-input
        disabled
        style="width: 400px"
        :value="companyInfo.companyAddress"
      ></el-input>
    </el-form-item>
    <el-form-item label="公司电话">
      <el-input
        disabled
        style="width: 400px"
        :value="companyInfo.companyPhone"
      ></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input
        disabled
        style="width: 400px"
        :value="companyInfo.mailbox"
      ></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input
        disabled
        style="width: 400px"
        :value="companyInfo.remarks"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCompanyInfo } from '@/api/setting'
export default {
  filters: {},
  components: {},
  data () {
    return {
      companyInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  watch: {},
  async created () {
    this.companyInfo = await getCompanyInfo(this.companyId)
  },
  methods: {}
}
</script>

<style scoped lang='scss'>
</style>
