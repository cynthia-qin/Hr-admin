<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="登录账户设置" name="first">
          <!-- {{ $route.params.id }}
          <br /> 获取路径参数id
          {{ id }} -->
          <el-form
            ref="userInfo"
            style="width: 400px; margin: 50px 0 0 200px"
            label-width="80px"
            :model="userInfo"
            :rules="rules"
          >
            <el-form-item label="姓名" prop="username">
              <el-input v-model="userInfo.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="userInfo.password"></el-input>
            </el-form-item>
            <el-row type="flex" justify="center">
              <el-button type="primary" @click="save">确认</el-button>
              <el-button>取消</el-button>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second">
          <userInfo :id="id"/>
        </el-tab-pane>
        <el-tab-pane label="岗位信息" name="three">
          <jobInfo />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveEmployee } from '@/api/empolyee'
import userInfo from './components/userInfo.vue'
import jobInfo from './components/jobInfo.vue'
export default {
  filters: {},
  components: {
    userInfo,
    jobInfo
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      activeName: 'first',
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById () {
      const res = await getUserDetailById(this.id)
      res.password = null
      this.userInfo = res
    },
    save () {
      this.$refs.userInfo.validate(async Valid => {
        if (!Valid) return this.$message.error('数据校验失败')
        await saveEmployee(this.id, this.userInfo)
        // console.log(res)
        this.$message.success('修改成功')
      })
    }
  }
}
</script>

<style scoped>
</style>
