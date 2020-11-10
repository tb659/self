<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col>
          <el-form-item label="班组名称" prop="name">
            <el-input  v-model="dataForm.name" placeholder="班组名称" :maxlength = '50'></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="所属车间" prop="workshopName">
            <el-popover v-model="workshopListVisible" ref="workshopListPopover" placement="bottom-start" trigger="click">
              <el-tree
                :data="workshopList"
                :props="{ label: 'name', children: 'children' }"
                node-key="id"
                ref="workshopListTree"
                :highlight-current="true"
                :expand-on-click-node="false"
                accordion
                @current-change="workshopListTreeCurrentChangeHandle">
              </el-tree>
            </el-popover>
            <el-input v-model="dataForm.workshopName" v-popover:workshopListPopover :readonly="true"  placeholder="车间"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
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
      workshopList: [],
      workshopListVisible: false,
      receiveUserTreeListVisible: false,
      receiveUserTreeList: [],
      teamName: '',
      dataForm: {
        id: '',
        workshopId: '0',
        workshopName: '',
        receiveUserName: '',
        name: '',
        userId: '',
        remarks: '',
        sort: ''
      }
    }
  },
  computed: {
    dataRule () {
      let validateIsName = (rule, value, callback) => {
        if (this.dataForm.id) {
          if (this.teamName !== value) {
            this.changeName(rule, value, callback)
          } else {
            callback()
          }
        } else {
          this.changeName(rule, value, callback)
        }
      }
      return {
        workshopName: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
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
      this.teamName = ''
      this.dataForm.receiveUserName = ''
      this.$nextTick(() => {
        this.getDeptUserTreeList()
        this.$refs['dataForm'].resetFields()
        Promise.all([
          this.getWorkshopList(),
          this.getUserList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    // 获取车间列表
    getWorkshopList () {
      return this.$http.get('/workshop/workshop/list').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.workshopList = res.data
      }).catch(() => {})
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
    // 获取信息
    getInfo () {
      this.$http.get(`/team/team/${this.dataForm.id}`).then(({ data: res }) => {
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
        this.$refs.workshopListTree.setCurrentKey(this.dataForm.workshopId)
        this.teamName = res.data.name
      }).catch(() => {})
    },
    // 上级部门树, 选中
    workshopListTreeCurrentChangeHandle (data) {
      this.dataForm.workshopId = data.id
      this.dataForm.workshopName = data.name
      this.workshopListVisible = false
    },
    // 判断班组名是否相等
    changeName (rule, value, callback) {
      this.$http.get(`/team/team/name`, {
        params: {
          name: value
        }
      }).then(({ data: res }) => {
        if (res.data !== null && res.data.name !== null) {
          callback(new Error('班组名称不能重复'))
        } else {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/team/team/', this.dataForm).then(({ data: res }) => {
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
