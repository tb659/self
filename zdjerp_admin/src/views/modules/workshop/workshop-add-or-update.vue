<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="车间名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="车间名称" :maxlength = '50'></el-input>
      </el-form-item>
      <el-form-item prop="parentName" label="上级车间" class="workshop-list">
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
        <el-input v-model="dataForm.parentName" v-popover:workshopListPopover :readonly="true" placeholder="上级目录">
          <i
            v-if="dataForm.pid !== '0'"
            slot="suffix"
            @click.stop="workshopListTreeSetDefaultHandle()"
            class="el-icon-circle-close el-input__icon">
          </i>
        </el-input>
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
      <el-row>
        <el-col :span="12">
          <el-form-item prop="sort" label="排序">
            <el-input-number v-model="dataForm.sort" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item  label="是否可用" prop="status">
            <el-radio-group v-model="dataForm.status">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
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
      workshopName: '',
      dataForm: {
        id: '',
        pid: '',
        name: '',
        userId: '',
        receiveUserName: '',
        sort: '',
        status: 1,
        remarks: '',
        parentName: '',
        userName: ''
      }
    }
  },
  computed: {
    dataRule () {
      let validateIsName = (rule, value, callback) => {
        if (this.dataForm.id) {
          if (this.workshopName !== value) {
            this.changeName(rule, value, callback)
          } else {
            callback()
          }
        } else {
          this.changeName(rule, value, callback)
        }
      }
      return {
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateIsName, trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        sort: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        status: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        userId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.workshopName = ''
      this.dataForm.receiveUserName = ''
      this.$nextTick(() => {
        this.getDeptUserTreeList()
        this.$refs['dataForm'].resetFields()
        Promise.all([
          this.getUserList(),
          this.getWorkshopList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          } else {
            this.workshopListTreeSetDefaultHandle()
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
    // 获取车间列表
    getWorkshopList () {
      return this.$http.get('/workshop/workshop/list').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.workshopList = res.data
      }).catch(() => {})
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
        this.userList.forEach(item => {
          if (item.id === this.dataForm.userId) {
            this.dataForm.receiveUserName = item.realName
          }
        })
        this.workshopName = res.data.name
        if (this.dataForm.pid === '0') {
          return this.workshopListTreeSetDefaultHandle()
        }
        this.$refs.workshopListTree.setCurrentKey(this.dataForm.pid)
      }).catch(() => {})
    },
    // 上级部门树, 设置默认值
    workshopListTreeSetDefaultHandle () {
      this.dataForm.pid = '0'
      this.dataForm.parentName = '一级车间'
    },
    // 上级部门树, 选中
    workshopListTreeCurrentChangeHandle (data) {
      this.dataForm.pid = data.id
      this.dataForm.parentName = data.name
      this.workshopListVisible = false
    },
    // 判断工位名是否相等
    changeName (rule, value, callback) {
      this.$http.get(`/workshop/workshop/name`, {
        params: {
          name: value
        }
      }).then(({ data: res }) => {
        if (res.data !== null && res.data.name !== null) {
          callback(new Error('车间名称不能重复'))
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/workshop/workshop/', this.dataForm).then(({ data: res }) => {
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
