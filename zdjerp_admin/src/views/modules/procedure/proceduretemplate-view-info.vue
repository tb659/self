<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="dataForm.templateName" placeholder="模板名称" readonly></el-input>
      </el-form-item>
          <el-form-item label="描述" prop="description">
          <el-input v-model="dataForm.description" placeholder="描述" readonly></el-input>
      </el-form-item>
      <el-form-item>
        <el-steps direction="vertical" :active="1">
          <el-step v-for="(item, index) in procedureTemplateList" :index="index" :key="index" :title="'步骤 '+(++index)">
            <template slot="description" >
              <el-select v-model="item.procedureId" placeholder="请选择工序" disabled>
                <el-option
                  v-for="procedure in procedureList"
                  :key="procedure.id"
                  :label="procedure.name"
                  :value="procedure.id">
                </el-option>
              </el-select>
              <el-select v-model="item.userId" placeholder="请选择员工" disabled>
                <el-option
                  v-for="user in userList"
                  :key="user.id"
                  :label="user.realName"
                  :value="user.id">
                </el-option>
              </el-select>
            </template>
          </el-step>
        </el-steps>
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
      procedureList: [],
      userList: [],
      sort: 0,
      procedureTemplateList: [],
      dataForm: {
        id: '',
        templateName: '',
        description: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        procedureTemplateList: []
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getProcedureList()
        this.getUserList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    getProcedureList () {
      this.$http.get(`/procedure/procedure/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.procedureList = res.data
      }).catch(() => {})
    },
    getUserList () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/procedure/proceduretemplate/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.procedureTemplateList = this.dataForm.procedureTemplateList
      }).catch(() => {})
    }
  }
}
</script>
