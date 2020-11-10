<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '90px'">
          <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="dataForm.templateName" placeholder="模板名称" maxlength="50"></el-input>
      </el-form-item>
          <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="dataForm.description" placeholder="描述" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item>
        <el-steps direction="vertical" :active="1">
          <el-step v-for="(item, index) in procedureTemplateList" :index="index" :key="index" :title="'步骤 '+(++index)">
            <template slot="description" >
              <el-select v-model="item.procedureId" placeholder="请选择工序">
                <el-option
                  v-for="procedure in procedureList"
                  :key="procedure.id"
                  :label="procedure.name"
                  :value="procedure.id">
                </el-option>
              </el-select>
              <el-select v-model="item.userId" placeholder="请选择员工" filterable>
                <el-option
                  v-for="user in userList"
                  :key="user.id"
                  :label="user.realName"
                  :value="user.id">
                  <span style="float: left">{{ user.realName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ user.deptName }}</span>
                </el-option>
              </el-select>
              <el-button v-if="index>1" style="margin-top: 12px;" @click="delProcedure(index,item.id)">删除工序</el-button>
            </template>
          </el-step>
        </el-steps>
        <el-button style="margin-top: 12px;" @click="addProcedure">添加工序</el-button>
      </el-form-item>
      </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      procedureTemplateList: [],
      procedureList: [],
      userList: [],
      sort: 0,
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
  computed: {
    dataRule () {
      return {
        templateName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        description: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updater: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updateDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        delFlag: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
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
        this.procedureTemplateList = []
        if (this.dataForm.id) {
          this.getInfo()
        } else {
          this.addProcedure()
        }
      })
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
    },
    // 添加工序
    addProcedure () {
      let list = {
        id: '',
        procedureId: '',
        userId: '',
        sort: ++this.sort
      }
      this.procedureTemplateList.push(list)
    },
    // 删除工序
    delProcedure (index, id) {
      if (id === undefined || id === '') {
        this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          this.procedureTemplateList.splice(index - 1, 1)
        }).catch(() => {})
      } else {
        this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          this.$http.delete('/procedure/proceduretemplatedetail', {
            'data': [id]
          }).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.procedureTemplateList.splice(index - 1, 1)
              }
            })
          }).catch(() => {})
        }).catch(() => {})
      }
    },
    getProcedureList () {
      this.$http.get(`/procedure/procedure/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.procedureList = res.data
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        let obj = this.procedureTemplateList
        for (let i = 0; i < obj.length; i++) {
          if (!obj[i].procedureId) {
            this.$message({
              message: '步骤' + (obj[i].sort) + '工序不能为空！',
              type: 'error',
              duration: 2000
            })
            return false
          }
          if (!obj[i].userId) {
            this.$message({
              message: '步骤' + (obj[i].sort) + '员工不能为空！',
              type: 'error',
              duration: 2000
            })
            return false
          }
        }
        this.dataForm.procedureTemplateList = this.procedureTemplateList
        this.$http[!this.dataForm.id ? 'post' : 'put']('/procedure/proceduretemplate/', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
