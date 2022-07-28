<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <RoleManage />
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <companyInfo />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import RoleManage from './components/RoleManage.vue'
import companyInfo from './components/companyInfo.vue'
export default {
  components: {
    RoleManage,
    companyInfo
  },
  data () {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style>
</style>
