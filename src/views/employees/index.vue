<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool title="成功的文案">
        <template #right>
          <el-button size="mini" type="danger" @click="exportExcel">
            普通excel导出
          </el-button>
          <el-button size="mini" type="info">复杂表头excel导出</el-button>
          <el-button
            size="mini"
            type="success"
            @click="$router.push('/import?type=user')"
          >
            excel导入
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="addEmployeeVisible = true"
          >
            新增员工
          </el-button>
        </template>
      </PageTool>
      <el-card style="margin-top: 10px">
        <el-table border :data="employees">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            label="姓名"
            sortable
            prop="username"
          ></el-table-column>
          <el-table-column label="头像" prop="staffPhoto">
            <template v-slot="scope">
              <img
                :src="scope.row.staffPhoto"
                style="width: 40px"
                @click="showQrDialogFn(scope.row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="工号" prop="workNumber"></el-table-column>
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterEmployee"
          ></el-table-column>
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="{ row }">
              {{ row.formOfEmployment | formatFormType }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template v-slot="{ row }">{{
              row.timeOfEntry | dateFormat
            }}</template>
          </el-table-column>
          <el-table-column label="状态" prop="enableState">
            <template v-slot="{ row }">
              <el-switch :value="row.enableState"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" style="width: 350px">
            <template v-slot="{ row }">
              <el-button
                type="text"
                @click="$router.push('/employees/detail/' + row.id)"
              >
                查看
              </el-button>
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text" @click="showRole(row.id)">
                角色
              </el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev,pager,next"
          :current-page="paramsObj.page"
          :total="total"
        ></el-pagination>
      </el-card>
    </div>
    <!-- 分配角色 -->
    <el-dialog :visible.sync="showRoleDialog" title="分配角色">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button type="primary" @click="onConfirm">确认</el-button>
        <el-button @click="showRoleDialog = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 新增员工 -->
    <el-dialog
      :visible.sync="addEmployeeVisible"
      title="新增员工"
      @close="handleClose"
    >
      <el-form
        ref="employeeRef"
        label-width="80px"
        :model="employeeForm"
        :rules="employeeFormRules"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="employeeForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="employeeForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="employeeForm.timeOfEntry"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select v-model="employeeForm.formOfEmployment">
            <el-option
              v-for="item in hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="employeeForm.workNumber"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" prop="departmentName">
          <el-input
            v-model="employeeForm.departmentName"
            @focus="showDepartment"
          ></el-input>
          <el-tree
            v-if="departmentList.length > 0"
            :data="departmentList"
            :props="{ label: 'name' }"
            default-expand-all
            @node-click="handleNodeClick"
          ></el-tree>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="employeeForm.correctionTime"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary">确认</el-button>
        <el-button>取消</el-button>
      </template>
    </el-dialog>
    <!--员工头像二维码 -->
    <el-dialog :visible.sync="showQrDialog" title="员工头像">
      <el-row type="flex" justify="center">
        <canvas ref="canvas"></canvas>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployee, assignRole } from '@/api/empolyee'
import employees from '@/constant/employees'
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { validMobile } from '@/utils/validate'
import { getDepartmentsList } from '@/api/departments'
import QRCode from 'qrcode'
export default {
  filters: {
    formatFormType (id) {
      var obj = employees.hireType.find(item => item.id === id - 0)
      if (obj) {
        return employees.hireType.find(item => item.id === id - 0).value
      } else {
        return '未知'
      }
    }
  },
  data () {
    const validMobileFn = (rule, val, callback) => {
      validMobile(val) ? callback() : callback(new Error('手机号格式 不正确'))
    }
    return {
      paramsObj: {
        page: 1,
        size: 4
      },
      total: 0,
      employees: [],
      showRoleDialog: false,
      checkList: [],
      roleList: [],
      id: null, // 表示当前得员工id
      addEmployeeVisible: false,
      employeeForm: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      employeeFormRules: {
        mobile: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: validMobileFn, trigger: 'blur' }
        ],
        timeOfEntry: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      hireType: employees.hireType,
      departmentList: [],
      showQrDialog: false
    }
  },
  created () {
    this.getEmployee()
  },
  methods: {
    async getEmployee () {
      const { total, rows } = await getEmployee(this.paramsObj)
      this.total = total
      this.employees = rows
    },
    formatterEmployee (row, column, cellValue) {
      var obj = employees.hireType.find(item => item.id === cellValue - 0)
      if (obj) {
        return employees.hireType.find(item => item.id === cellValue - 0).value
      } else {
        return '未知'
      }
    },
    async exportExcel () {
      const { rows } = await getEmployee({ page: 1, size: this.total })
      // console.log(rows)
      // 把列表数据处理成二维数组
      rows.forEach(item => {
        delete item.password
        delete item.staffPhoto
      })
      const data = []
      rows.forEach(item => {
        data.push(Object.values(item))
      })
      console.log(data)
      // 导出表头
      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      const tHeader = Object.keys(rows[0]).map(item => headers[item])
      console.log(tHeader)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      }
      )
    },
    exportExcel1 () {
      const multiHeader = ['', '主要信息', '', '', '', '', '']
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const data = [
        ['张三', '13000000', '2019-1-1', '正式', '2019-1-2', '110', 'java部门'],
        ['李四', '13000000', '2019-1-1', '正式', '2019-1-2', '111', 'java部门']
      ]

      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          multiHeader, // 第一行表头 复杂表头
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          merges // 设置合并规则
        })
      })
    },
    async showRole (id) {
      this.id = id
      const { rows } = await getRoleList({ page: 1, pagesize: 9999 })
      this.roleList = rows
      const { roleIds } = await getUserDetailById(id)
      console.log(roleIds)
      this.checkList = roleIds
      this.showRoleDialog = true
    },
    async onConfirm () {
      await assignRole({
        id: this.id,
        roleIds: this.checkList
      })
      this.$message.success('分配权限成功')
      this.showRoleDialog = false
    },
    handleClose () {
      this.$refs.employeeRef.resetFields()
      this.addEmployeeVisible = false
    },
    async showDepartment () {
      const res = await getDepartmentsList()
      // 我们的数据不能直接使用，而是先加工处理一下才能使用 递归在写的时候慢慢就意识到了 层次不确定
      function tranferListToTree (list, pid) {
        var list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = tranferListToTree(list, item.id)
          }
        })
        return list1
      }
      this.departmentList = tranferListToTree(res.depts, '')
    },
    handleNodeClick (obj) {
      // 将当前点击得部门节点名称赋值给form表单得部门名称
      this.employeeForm.departmentName = obj.name
      // 清空树形数据
      this.departmentList = []
    },
    showQrDialogFn (src) {
      this.showQrDialog = true
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.canvas, src, function (error) {
          if (error) console.error(error)
          console.log('success!')
        })
      })
    }

  }
}
</script>

<style>
</style>
