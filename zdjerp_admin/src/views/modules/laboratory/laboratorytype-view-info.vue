<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="库房名称" maxlength="50" readonly></el-input>
      </el-form-item>
      <el-form-item prop="parentName" label="上级名称" class="dept-list">
        <el-input v-model="dataForm.parentName" :readonly="true" placeholder="上级名称"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" :min="0" controls-position="right" label="排序" disabled></el-input-number>
      </el-form-item>
      </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        pid: '',
        pids: '',
        name: '',
        sort: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: ''
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 上级树, 设置默认值
    deptListTreeSetDefaultHandle () {
      this.dataForm.pid = '0'
      this.dataForm.parentName = '一级'
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/laboratory/laboratorytype/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        if (this.dataForm.pid === '0') {
          return this.deptListTreeSetDefaultHandle()
        }
      }).catch(() => {})
    }
  }
}
</script>
