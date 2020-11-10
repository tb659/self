<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" width="75%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input v-model="dataForm.supplierName" placeholder="供应商名称" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商类别" prop="supplierTypeId">
            <el-select v-model="dataForm.supplierTypeId" placeholder="请选择" clearable filterable style="width: 100%">
              <el-option
                v-for="item in supplierTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="网址" prop="supplierNet">
            <el-input v-model="dataForm.supplierNet" placeholder="网址" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="电话" prop="supplierPhone">
            <el-input v-model="dataForm.supplierPhone" placeholder="电话" maxlength="13"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="传真" prop="supplierFax">
            <el-input v-model="dataForm.supplierFax" placeholder="传真" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="城市" prop="cityId">
            <el-input v-model="dataForm.cityId" placeholder="城市" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
          <el-form-item label="供应商地址" prop="supplierAdd">
          <el-input v-model="dataForm.supplierAdd" placeholder="供应商地址" maxlength="100"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="联系人" prop="contactMan">
            <el-input v-model="dataForm.contactMan" placeholder="联系人" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机" prop="supplierMobile">
            <el-input v-model="dataForm.supplierMobile" placeholder="手机" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱" prop="supplierEmail">
            <el-input v-model="dataForm.supplierEmail" placeholder="邮箱" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="微信号" prop="supplierWeixin">
            <el-input v-model="dataForm.supplierWeixin" placeholder="微信号" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="QQ" prop="supplierQq">
            <el-input v-model="dataForm.supplierQq" placeholder="QQ" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮编" prop="supplierPost">
            <el-input v-model="dataForm.supplierPost" placeholder="邮编" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="开户银行" prop="bank">
            <el-input v-model="dataForm.bank" placeholder="开户银行" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户账号" prop="bankCode">
            <el-input v-model="dataForm.bankCode" placeholder="开户账号" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户名称" prop="bankName">
            <el-input v-model="dataForm.bankName" placeholder="开户名称" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="开户行2" prop="otherBank">
            <el-input v-model="dataForm.otherBank" placeholder="开户行2" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户账号2" prop="otherBankCode">
            <el-input v-model="dataForm.otherBankCode" placeholder="开户账号2" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户名2" prop="otherBankName">
            <el-input v-model="dataForm.otherBankName" placeholder="开户名2" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="附件" prop="enclosureUrl">
        <el-input v-model="dataForm.enclosureUrl" placeholder="附件" @focus="getEnclosureUrl"></el-input>
      </el-form-item>
          <el-form-item label="税号" prop="taxCode">
          <el-input v-model="dataForm.taxCode" placeholder="税号" maxlength="100"></el-input>
      </el-form-item>
          <el-form-item label="备注" prop="remarks">
          <el-input type="textarea"  v-model="dataForm.remarks" placeholder="备注" maxlength="255"></el-input>
      </el-form-item>
      </el-form>
    <template>
      <div class="tableDate">
        <div class="table">
          <el-button type="primary" size="small" @click.prevent="addRow()">添加其他联系人</el-button>
          <el-table
            :data="tableData"
            ref="table"
            tooltip-effect="dark"
            border
            stripe
            style="width: 100%">
            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
            <el-table-column  label="联系人姓名" align="center" width="200">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" placeholder="联系人姓名" maxlength="50"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="联系人手机号" width="200">
              <template slot-scope="scope">
                <el-input v-model="scope.row.phoneNum" placeholder="联系人手机号" maxlength="11"></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="邮箱" align="center" width="200">
              <template slot-scope="scope">
                <el-input v-model="scope.row.email" placeholder="邮箱" maxlength="50"></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="QQ" align="center" width="200">
              <template slot-scope="scope">
                <el-input v-model="scope.row.qq" placeholder="QQ"  maxlength="20"></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="微信" align="center" width="200">
              <template slot-scope="scope">
                <el-input v-model="scope.row.weixin" placeholder="微信"  maxlength="50"></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="备注" align="center" width="200">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remarks" placeholder="备注" maxlength="50"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="100">
              <template slot-scope="scope">
                <el-button v-if="$hasPermission('supplier:suppliercontact:delete')" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </template>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <!--附件上传-->
    <enclosure-file v-if="enclosureUrlVisible" ref="enclosureFile" @setEnclosureInfo="setEnclosureUrl"></enclosure-file>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { isEmail, isMobile, isPhone } from '@/utils/validate'
import EnclosureFile from './supplier-upload'
export default {
  data () {
    return {
      visible: false,
      enclosureUrlVisible: false,
      supplierTypeList: [],
      tableData: [],
      dataForm: {
        id: '',
        supplierTypeId: '',
        supplierName: '',
        supplierAdd: '',
        contactMan: '',
        supplierPhone: '',
        supplierMobile: '',
        supplierFax: '',
        supplierEmail: '',
        supplierNet: '',
        supplierQq: '',
        supplierWeixin: '',
        supplierPost: '',
        cityId: '',
        bank: '',
        bankName: '',
        bankCode: '',
        taxCode: '',
        otherBank: '',
        otherBankName: '',
        otherBankCode: '',
        enclosureUrl: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        remarks: '',
        delFlag: '',
        supplierContactList: []
      }
    }
  },
  computed: {
    dataRule () {
      var validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback()
        }
        if (!isEmail(value)) {
          return callback(new Error(this.$t('validate.format', { 'attr': '邮箱' })))
        }
        callback()
      }
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback()
        }
        if (!isPhone(value)) {
          return callback(new Error(this.$t('validate.format', { 'attr': '电话' })))
        }
        callback()
      }
      var validateMobile = (rule, value, callback) => {
        if (value) {
          if (!isMobile(value)) {
            return callback(new Error(this.$t('validate.format', { 'attr': '手机号' })))
          }
        }
        callback()
      }
      return {
        supplierName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        supplierPhone: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        supplierMobile: [
          { validator: validateMobile, trigger: 'blur' }
        ],
        supplierEmail: [
          { validator: validateEmail, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    EnclosureFile
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.tableData = []
        this.supplierTypeList = []
        Promise.all([
          this.getSupplierTypeList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    // 获取文件的信息
    setEnclosureUrl (url) {
      this.dataForm.enclosureUrl = url
    },
    // 初始化弹框
    getEnclosureUrl () {
      this.enclosureUrlVisible = true
      this.$nextTick(() => {
        this.$refs.enclosureFile.init()
      })
    },
    getSupplierTypeList: function () {
      this.$http.get(`/supplier/suppliertype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.supplierTypeList = res.data
      }).catch(() => {
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/supplier/supplier/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.tableData = res.data.supplierContactList
      }).catch(() => {})
    },
    // 增加行
    addRow () {
      var list = {
        name: '',
        phoneNum: '',
        email: '',
        qq: '',
        weixin: '',
        remarks: ''
      }
      this.tableData.unshift(list)
    },
    handleDelete (index) { // 删除行数
      this.tableData.splice(index, 1)
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        const obj = this.tableData
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].name === '') {
            this.$message({
              message: '第' + (i + 1) + '行联系人姓名不能为空！',
              type: 'error',
              duration: 2000
            })
            return false
          }
          if (obj[i].phoneNum === '') {
            this.$message({
              message: '第' + (i + 1) + '行联系人手机号不能为空！',
              type: 'error',
              duration: 2000
            })
            return false
          }
          if (obj[i].phoneNum !== '') {
            if (!isMobile(obj[i].phoneNum)) {
              this.$message({
                message: '第' + (i + 1) + '行联系人手机号格式不正确！',
                type: 'error',
                duration: 2000
              })
              return false
            }
          }
          if (obj[i].email !== '') {
            if (!isEmail(obj[i].email)) {
              this.$message({
                message: '第' + (i + 1) + '行邮箱格式不正确！',
                type: 'error',
                duration: 2000
              })
              return false
            }
          }
        }
        this.dataForm.supplierContactList = this.tableData
        this.$http[!this.dataForm.id ? 'post' : 'put']('/supplier/supplier/', this.dataForm).then(({ data: res }) => {
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
