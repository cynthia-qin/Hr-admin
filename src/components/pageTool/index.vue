<template>
  <el-card>
    <el-row type="flex" justify="between" align="middle">
      <el-col>
        <el-alert
          v-if="title.length > 0"
          :title="title"
          type="info"
          show-icon
          :closable="false"
          style="width: unset; display: inline"
        >
        </el-alert>
      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <slot name="right"></slot>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  filters: {},
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  methods: {}
}
</script>

<style scoped lang='scss'>
</style>
