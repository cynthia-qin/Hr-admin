<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; padding: 30px 140px; font-size: 14px; width: 100%"
    >
      <el-col>
        <span>{{ isTitle ? node.data.name : node.name }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ isTitle ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="onCommand">
              <span> 操作<i class="el-icon-arrow-down" /> </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="isTitle">
                  <el-dropdown-item command="b">编辑子部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除子部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- @click.native.stop 阻止冒泡 -->
    <el-dialog
      :visible="addDialogVisible"
      :title="title"
      @click.native.stop
      @close="handlerClose"
    >
      <el-form
        ref="addForm"
        label-width="100px"
        :model="addDepartmentForm"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="addDepartmentForm.name"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码">
          <el-input
            v-model="addDepartmentForm.code"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门负责人">
          <!-- <el-input v-model="addDepartmentForm.manager"></el-input> -->
          <el-select
            v-model="addDepartmentForm.manager"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍">
          <el-input
            v-model="addDepartmentForm.introduce"
            type="textarea"
            placeholder="1-300个字符"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlerClose">取消</el-button>
        <el-button type="primary" @click="obSubmit"> 确认 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delDepartment, addDepartment, getDepartmentsList, editDepartment } from '@/api/departments'
import { getSimpleList } from '@/api/user'
export default {
  name: 'TreeItem',
  filters: {},
  components: {},
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    const validateName = async (rule, val, callback) => {
      const { depts } = await getDepartmentsList()
      if (this.isEdit) {
        // 编辑部门
        depts.filter(item => item.pid === this.node.data.pid && item.id !== this.node.data.id).some(item => item.name === val) ? callback(new Error('部门名称不能重复')) : callback()
      } else {
        // 新增部门
        const id = this.node.data ? this.node.data.id : ''
        depts.filter(item => item.pid === id).some(item => item.name === val) ? callback(new Error('部门名称不能重复')) : callback()
      }
    }
    return {
      addDialogVisible: false, // 添加/编辑部门弹出框
      addDepartmentForm: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3-10之间', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ]
      },
      users: [], // 所有的部门信息
      isEdit: false // 当前是否是编辑
    }
  },
  computed: {
    isTitle () {
      // return Boolean(this.node.data)
      return !!this.node.data
    },
    title () {
      return this.isEdit ? '编辑部门' : '新增部门'
    }
  },
  watch: {},
  created () { },
  methods: {
    async onCommand (key) {
      if (this.users.length === 0) {
        this.getSimpleList()
      }
      if (key === 'a') {
        this.isEdit = false
        this.addDialogVisible = true
      } else if (key === 'b') {
        this.isEdit = true
        this.addDialogVisible = true
        // this.addDepartmentForm = this.node.data
        console.log('编辑')
        this.addDepartmentForm = { ...this.node.data }
      } else {
        try {
          await this.$confirm('确认删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await delDepartment(this.node.data.id)
          this.$emit('delDepartment')
        } catch (err) {
          console.log(err)
          this.$notify({
            message: '取消了删除',
            duration: 1000
          })
        }
      }
    },
    async getSimpleList () {
      this.users = await getSimpleList()
    },
    handlerClose () {
      this.$refs.addForm.resetFields()
      this.addDialogVisible = false
    },
    async obSubmit () {
      // this.addDepartmentForm.pid = this.node.data.id
      try {
        await this.$refs.addForm.validate()
        if (this.isEdit) {
          console.log(111)
          delete this.addDepartmentForm.children
          // console.log(this.addDepartment)
          await editDepartment(this.addDepartmentForm)
        } else {
          this.addDepartmentForm.pid = this.node.data ? this.node.data.id : ''
          await addDepartment(this.addDepartmentForm)
        }
        this.addDialogVisible = false
        // 更新页面
        this.$emit('delDepartment')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
