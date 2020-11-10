<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="工位名称" prop="name">
          <el-input  v-model="dataForm.name" placeholder="工位名称" :maxlength = '50'></el-input>
      </el-form-item>
      <el-form-item label="工序名称" prop="procedureId">
        <el-select v-model="dataForm.procedureId" placeholder="请选择" clearable filterable style="width: 100%">
          <el-option
            v-for="item in procedureList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col>
          <el-form-item label="负责人" prop="userId">
            <el-popover v-model="receiveUserTreeListVisible" ref="receiveUserListPopover" placement="bottom-start" trigger="click">
              <el-tree
                :data="receiveUserTreeList"
                :props="{ label: 'name', children: 'children' }"
                node-key="id"
                ref="receiveUserListTree"
                :highlight-current="true"
                :expand-on-click-node="false"
                accordion
                @current-change="receiveUserListTreeCurrentChangeHandle">
              </el-tree>
            </el-popover>
            <el-input v-model="dataForm.receiveUserName" v-popover:receiveUserListPopover :readonly="true" placeholder="负责人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
          <el-form-item label="备注" prop="remarks">
          <el-input v-model="dataForm.remarks" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" :max="9999"></el-input-number>
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
      userList: [],
      procedureList: [],
      receiveUserTreeListVisible: false,
      receiveUserTreeList: [],
      procedureName: '',
      dataForm: {
        id: '',
        procedureId: '',
        userId: '',
        receiveUserName: '',
        name: '',
        remarks: '',
        sort: ''
      }
    }
  },
  computed: {
    dataRule () {
      let validateIsName = (rule, value, callback) => {
        if (this.dataForm.id) {
          if (this.procedureName !== value) {
            this.changeName(rule, value, callback)
          } else {
            callback()
          }
        } else {
          this.changeName(rule, value, callback)
        }
      }
      return {
        procedureId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateIsName, trigger: 'blur' }
        ],
        userId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        sort: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.dataForm.receiveUserName = ''
      this.procedureName = ''
      this.$nextTick(() => {
        this.getDeptUserTreeList()
        this.$refs['dataForm'].resetFields()
        Promise.all([
          this.getUserList(),
          this.getProcedureList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    receiveUserListTreeCurrentChangeHandle (data, node) {
      this.dataForm.userId = data.id
      this.dataForm.receiveUserName = data.name
      this.receiveUserTreeListVisible = false
    },
    // 部门用户树型结构
    getDeptUserTreeList () {
      this.$http.get(`/sys/dept/listDeptAndUser`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.receiveUserTreeList = res.data
      }).catch(() => {})
    },
    // 获取用户集合
    getUserList: function () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
      }).catch(() => {
      })
    },
    // 获取工序集合
    getProcedureList: function () {
      this.$http.get(`/procedure/procedure/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.procedureList = res.data
      }).catch(() => {
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/workstation/workstation/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.userList.forEach(item => {
          if (item.id === this.dataForm.userId) {
            this.dataForm.receiveUserName = item.realName
          }
        })
        this.procedureName = res.data.name
      }).catch(() => {})
    },
    // 判断工位名是否相等
    changeName (rule, value, callback) {
      this.$http.get(`/workstation/workstation/name`, {
        params: {
          name: value
        }
      }).then(({ data: res }) => {
        if (res.data !== null && res.data.name !== null) {
          callback(new Error('工位名称不能重复'))
        } else {
          console.log(999)
          callback()
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/workstation/workstation/', this.dataForm).then(({ data: res }) => {
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
