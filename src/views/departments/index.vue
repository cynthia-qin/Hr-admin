<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card v-loading="isLoading">
        <el-tabs>
          <el-tab-pane label="用户管理">
            <!-- 用了一个行列布局 -->
            <TreeItem :node="titleObj" @delDepartment="getDepartmentsList" />
            <el-tree :data="data" default-expand-all>
              <template v-slot="{ node }">
                <TreeItem :node="node" @delDepartment="getDepartmentsList" />
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import TreeItem from './components/TreeItem.vue'
import { getDepartmentsList } from '@/api/departments'
export default {
  components: {
    TreeItem
  },
  data () {
    return {
      data: [],
      titleObj: {},
      isLoading: true // 页面刚加载的时候就显示，数据加载完成隐藏
    }
  },
  created () {
    this.getDepartmentsList()
  },
  methods: {
    async getDepartmentsList () {
      const res = await getDepartmentsList()
      this.data = this.transferListToTree(res.depts, '')
      this.titleObj = res.depts[0]
      this.isLoading = false
    },
    transferListToTree (array, pid) {
      const list = []
      array.forEach(item => {
        if (item.pid === pid) {
          list.push(item)
          item.children = this.transferListToTree(array, item.id)
        }
      })
      return list
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
