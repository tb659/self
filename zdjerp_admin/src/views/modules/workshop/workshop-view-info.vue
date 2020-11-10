<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col>
          <el-form-item label="车间名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="车间名称" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="上级车间" prop="name" v-if="dataForm.pid != 0">
            <el-input v-model="dataForm.parentName" placeholder="车间名称" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="负责人" prop="userId">
        <el-input v-model="dataForm.userName" placeholder="工位负责人" readonly></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="dataForm.remarks" placeholder="备注" readonly></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="sort" label="排序">
            <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" disabled></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否占用" prop="status">
            <el-radio-group v-model="dataForm.status" disabled>
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
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
        name: '',
        sort: '',
        parentName: '',
        status: ''
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
    // 获取信息
    getInfo () {
      this.$http.get(`/workshop/workshop/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    }
  }
}
</script>
