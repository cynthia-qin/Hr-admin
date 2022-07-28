<template>
  <div>
    <el-button
      type="primary"
      size="small"
      @click="
        showAddDialog = true;
        isEdit = false;
      "
    >
      添加角色
    </el-button>
    <el-table :data="roleList" border>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column
        sortable
        label="角色名称"
        width="360px"
        prop="name"
      ></el-table-column>
      <el-table-column
        sortable
        label="描述"
        prop="description"
      ></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="showDialog(row.id)">
            分配权限
          </el-button>
          <el-button type="text" @click="showRoleDialog(row)"> 编辑 </el-button>
          <el-button type="text" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-pagination
        :current-page="paramsObj.page"
        :page-size="paramsObj.pagesize"
        :page-sizes="[1, 2, 3, 4, 5, 6]"
        layout="total,sizes,prev,pager,next,jumper"
        :total="total"
        @current-change="handlerCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </el-row>
    <!-- 分配权限 -->
    <el-dialog :visible.sync="showRightDialog" title="分配权限">
      <el-tree
        v-if="showRightDialog"
        ref="myTree"
        :data="permissions"
        :props="{ label: 'name' }"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="selectedPermission"
      ></el-tree>
      <template #footer>
        <el-button type="primary" @click="save">确认</el-button>
        <el-button @click="showRightDialog = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 新增角色 -->
    <el-dialog
      :visible.sync="showAddDialog"
      :title="isEdit ? '编辑部门' : '新增部门'"
      @close="onCancel"
    >
      <el-form ref="myForm" label-width="80px" :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onClick">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPermission, getPermissionById, assignPermission } from '@/api/permission'
import { getRoleList, delRole, addRole, editRole } from '@/api/setting'
import { transferListToTree } from '@/utils'
export default {
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1,
        pagesize: 4
      },
      roleList: [],
      total: null,
      showRightDialog: false,
      permissions: [], // 所有的权限数据
      selectedPermission: [], // 当前角色选中的权限
      id: null, // 当前角色的id
      showAddDialog: false,
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      // console.log(res)
      this.roleList = res.rows
      this.total = res.total
    },
    handlerCurrentChange (page) {
      // console.log(page)
      this.paramsObj.page = page
      this.getRoleList()
    },
    handleSizeChange (pagesize) {
      this.paramsObj.pagesize = pagesize
      this.getRoleList()
    },
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        // 当当前页的数据被删完的时候，应该跳转到上一页
        if (this.roleList.length === 0 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        }
        this.getRoleList()
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async showDialog (id) {
      this.id = id
      const res = await getPermission()
      // console.log(transferListToTree)
      this.permissions = transferListToTree(res, '0')
      const { permIds } = await getPermissionById(id)
      this.selectedPermission = permIds
      this.showRightDialog = true
      // console.log(permIds)
    },
    async save () {
      // console.log(this.$refs.myTree.getCheckedKeys())
      // console.log(this.$refs.myTree.getCheckedNodes())
      await assignPermission(this.id, this.$refs.myTree.getCheckedKeys())
      this.$message('修改权限成功')
      this.showRightDialog = false
    },
    onClick () {
      this.$refs.myForm.validate(async bool => {
        if (!bool) return this.$message.error('表单数据校验失败')
        if (this.isEdit) {
          //
          await editRole(this.form)
          this.$message.success('编辑角色成功')
        } else {
          await addRole(this.form)
          this.$message.success('添加角色成功')
        }
        this.showAddDialog = false
        this.getRoleList()
      })
    },
    onCancel () {
      this.form = {
        name: '',
        description: ''
      }
      this.$refs.myForm.resetFields()
      this.showAddDialog = false
    },
    showRoleDialog (row) {
      this.isEdit = true
      this.showAddDialog = true
      // 浅拷贝 因为我们的表单数据是v-model绑定的 为了不让我们修改角色还没提交，页面内容就发生变化，所以我们要让form等于一个新的对象地址，避免互相影响
      // this.form = { ...row }
      this.form = Object.assign({}, row)
    }
  }
}
</script>

<style scoped lang='scss'>
.el-table {
  margin-top: 20px;
}
</style>
