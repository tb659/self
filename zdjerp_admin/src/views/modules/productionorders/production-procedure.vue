<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item label="车间班组" prop="deptId">
        <el-popover v-model="deptListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
          <el-tree
            :data="deptList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            ref="deptListTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="deptListTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" placeholder="请选择车间班组"></el-input>
      </el-form-item>
      <el-form-item label="工序模板" prop="procedureTemplateId">
        <el-select v-model="procedureTemplateId" placeholder="请选择工序模板" filterable @change="getTemplateList">
          <el-option
            v-for="procedure in procedureTemplateList"
            :key="procedure.id"
            :label="procedure.templateName"
            :value="procedure.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-steps direction="vertical" :active="1">
          <el-step v-for="(item, index) in dataList" :index="index" :key="index" :title="'步骤 '+(++index)">
            <template slot="description" >
              <el-select v-model="item.procedureId" placeholder="请选择工序" filterable>
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
                </el-option>
              </el-select>
              <el-button type="danger" size="mini" @click="delProcedure(index)" icon="el-icon-delete"></el-button>
            </template>
          </el-step>
        </el-steps>
        <el-button style="margin-top: 12px;" @click="addProcedure">添加工序</el-button>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="callOf">{{ $t('cancel') }}</el-button>
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
      deptListVisible: false,
      deptList: [],
      procedureList: [],
      userList: [],
      sort: 0,
      procedureTemplateId: '',
      dataForm: {
        id: '',
        productionOrdersId: '',
        productionOrdersDetailId: '',
        productionOrdersDetailIds: [],
        deptId: '',
        deptName: '',
        procedureId: '',
        userId: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        productionProcedureList: []
      },
      dataList: [],
      procedureTemplateList: []
    }
  },
  computed: {
    dataRule () {
      return {
        productionOrdersId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        productCoding: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        productName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        specificationId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        model: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        remark: [
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
        this.getDeptList()
        this.getUserList()
        this.getProcedureList()
        this.getProcedureTemplateList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.productionOrdersDetailId) {
          this.getInfo()
        }
      })
    },
    // 获取部门列表
    getDeptList () {
      return this.$http.get('/sys/dept/deptList').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data
      }).catch(() => {})
    },
    // 上级部门树, 选中
    deptListTreeCurrentChangeHandle (data) {
      this.dataForm.deptId = data.id
      this.dataForm.deptName = data.name
      this.deptListVisible = false
      this.getUserList(data.id)
    },
    getTemplateList () {
      this.$http.get(`/procedure/proceduretemplatedetail/getTemplateDetailList/${this.procedureTemplateId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataList = res.data
      }).catch(() => {})
    },
    getProcedureTemplateList () {
      this.$http.get(`/procedure/proceduretemplate/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.procedureTemplateList = res.data
      }).catch(() => {})
    },
    getProcedureList () {
      this.$http.get(`/procedure/procedure/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.procedureList = res.data
      }).catch(() => {})
    },
    getUserList (deptId) {
      this.$http.get(`/sys/user/selectByDeptId/`, {
        params: {
          deptId: deptId
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/productionprocedure/productionprocedure/list/${this.dataForm.productionOrdersDetailId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        if (res.data.length > 0) {
          this.sort = res.data.length
          this.dataForm.deptId = res.data[0].deptId
          var deptId = null
          this.getUserList(deptId)
          for (var i = 0; i < this.deptList.length; i++) {
            if (this.deptList[i].id === res.data[0].deptId) {
              this.dataForm.deptName = this.deptList[i].name
            }
            if (this.deptList[i].children.length > 0) {
              this.getDeptName(this.deptList[i].children, res.data[0].deptId)
            }
          }
          for (var k = 0; k < res.data.length; k++) {
            console.log(res.data[k])
            let obj = {
              procedureId: res.data[k].procedureId,
              userId: res.data[k].userId,
              sort: res.data[k].sort
            }
            this.dataList.push(obj)
          }
        } else {
          this.addProcedure()
        }
      }).catch(() => {})
    },
    getDeptName (deptList, deptId) {
      for (var i = 0; i < deptList.length; i++) {
        if (deptList[i].id === deptId) {
          this.dataForm.deptName = deptList[i].name
        }
        if (deptList[i].children.length > 0) {
          this.getDeptName(deptList[i].children, deptId)
        }
      }
    },
    addProcedure () {
      let list = {
        procedureId: '',
        userId: '',
        sort: ++this.sort
      }
      this.dataList.push(list)
    },
    delProcedure (index) {
      this.dataList.splice(index - 1, 1)
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.dataForm.productionProcedureList = this.dataList
        let obj = this.dataList
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/productionprocedure/productionprocedure/', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.callOf()
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false }),
    // 取消
    callOf () {
      this.visible = false
      this.$store.state.contentIsNeedRefresh = true
      this.$nextTick(() => {
        this.$store.state.contentIsNeedRefresh = false
      })
    },
    // 弹窗关闭
    handleClose (done) {
      done()
      this.$store.state.contentIsNeedRefresh = true
      this.$nextTick(() => {
        this.$store.state.contentIsNeedRefresh = false
      })
    }
  }
}
</script>
