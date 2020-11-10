<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" width="75%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '100px'">
      <el-row>
        <el-col :span="6">
          <el-form-item label="客户名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="客户名称" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="公司网址" prop="net">
            <el-input v-model="dataForm.net" placeholder="公司网址" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属行业" prop="industryId">
            <el-select v-model="dataForm.industryId" placeholder="请选择" clearable filterable style="width: 100%">
              <el-option
                v-for="item in industryList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="公司电话" prop="phone">
            <el-input v-model="dataForm.phone" placeholder="公司电话" maxlength="13"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="传真" prop="fax">
            <el-input v-model="dataForm.fax" placeholder="传真" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属地区" prop="areaId">
            <el-cascader
              :options="CityInfo"
              v-model="selectedOptions"
              :change-on-select="true"
              :clearable="true"
              :filterable="true"
              @change="handleChange" style="width: 100%">
             </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="公司地址" prop="address">
        <el-input v-model="dataForm.address" placeholder="公司地址" maxlength="200"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="dataForm.contact" placeholder="联系人" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属部门" prop="contactDepart">
            <el-input v-model="dataForm.contactDepart" placeholder="所属部门"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系人手机" prop="contactPhone">
            <el-input v-model="dataForm.contactPhone" placeholder="联系人手机" maxlength="11"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="QQ" prop="contactQq">
            <el-input v-model="dataForm.contactQq" placeholder="QQ" maxlength="10"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="邮箱" prop="contactEmail">
            <el-input v-model="dataForm.contactEmail" placeholder="邮箱" maxlength="15"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="微信" prop="weixin">
            <el-input v-model="dataForm.weixin" placeholder="微信" maxlength="25"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="客户类型" prop="typeId">
            <el-select v-model="dataForm.typeId" placeholder="请选择" clearable filterable style="width: 100%">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户来源" prop="originId">
            <el-select v-model="dataForm.originId" placeholder="请选择" clearable filterable style="width: 100%">
              <el-option
                v-for="item in originList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户状态" prop="statusId">
            <el-input v-model="dataForm.statusId" placeholder="客户状态"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户级别" prop="levelId">
            <el-select v-model="dataForm.levelId" placeholder="请选择" clearable filterable style="width: 100%">
              <el-option
                v-for="item in levelList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="客户归属" prop="ownership">
            <el-input v-model="dataForm.ownership" placeholder="客户归属"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="税号" prop="taxCode">
            <el-input v-model="dataForm.taxCode" placeholder="税号" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="证件类型" prop="cardTypeId">
            <el-input v-model="dataForm.cardTypeId" placeholder="证件类型id" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="证件编号" prop="cardCode">
            <el-input v-model="dataForm.cardCode" placeholder="证件编号" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开户行" prop="bankName">
            <el-input v-model="dataForm.bankName" placeholder="开户行" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="银行账号" prop="bankCode">
            <el-input v-model="dataForm.bankCode" placeholder="银行账号" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
          <el-form-item label="备注" prop="remarks">
          <el-input v-model="dataForm.remarks" placeholder="备注" type="textarea" maxlength="200"></el-input>
      </el-form-item>
      </el-form>
    <template>
      <div class="tableData">
        <div class="table">
          <el-form label-position="right" :model="tableForm" :inline="true" ref="tableForm">
            <el-table :data="tableForm.tableData" style="width: 100%" tooltip-effect="dark" stripe>
              <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
              <el-table-column label="联系人姓名" width="200">
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' +scope.$index + '.name'"
                                :rules="[{ required: true, message: '姓名不能为空',trigger: 'blur'}]">
                    <el-input v-model="scope.row.name" placeholder="姓名" :maxlength = '10'></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="联系人电话" width="200">
                <template slot-scope="scope">
                  <el-form-item  :prop="'tableData.' +scope.$index + '.contactPhone'"
                                 :rules="moreRules.contactPhone">
                    <el-input v-model="scope.row.contactPhone" placeholder="联系电话" :maxlength = '13'></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="所属部门" width="200">
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' +scope.$index + '.department'"
                                :rules="[{ required: true, message: '所属部门不能为空',trigger: 'blur'}]">
                    <el-input v-model="scope.row.department" placeholder="所属部门" :maxlength = '30'></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="职位" width="200">
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' +scope.$index + '.position'"
                                :rules="[{ required: true, message: '职位不能为空',trigger: 'blur'}]">
                    <el-input v-model="scope.row.position" placeholder="职位" :maxlength = '10'></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="邮箱" width="200">
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' +scope.$index + '.contactEmail'"
                                :rules="moreRules.contactEmail">
                    <el-input v-model="scope.row.contactEmail" placeholder="邮箱" :maxlength = '30'></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="微信" width="200">
                <template slot-scope="scope">
                  <el-form-item>
                    <el-input v-model="scope.row.weixin" placeholder="微信" :maxlength = '10'></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="备注" width="200">
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' +scope.$index + '.remarks'"
                                :rules="[{ required: false, message: '备注',trigger: 'blur'}]">
                    <el-input v-model="scope.row.remarks" placeholder="备注" :maxlength = '10'></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
                <template slot="header" slot-scope="scope">
                  <el-button type="primary" size="small" @click.prevent="addRow()">添加其他联系人</el-button>
                </template>
                <template slot-scope="scope">
                  <el-button v-if="tableForm.tableData.length > 0" type="text" size="small" @click="handleDelete(index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </div>
    </template>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import CityInfo from '@/utils/citydata'
import { isMobile, isPhone } from '@/utils/validate'
export default {
  data () {
    return {
      visible: false,
      CityInfo: CityInfo,
      selectedOptions: [],
      typeList: [],
      originList: [],
      levelList: [],
      industryList: [],
      dataForm: {
        id: '',
        name: '',
        levelId: '',
        cardTypeId: '',
        cardCode: '',
        statusId: '',
        industryId: '',
        typeId: '',
        phone: '',
        net: '',
        fax: '',
        originId: '',
        provinceId: '',
        cityId: '',
        areaId: '',
        address: '',
        contact: '',
        contactTel: '',
        contactPhone: '',
        contactDepart: '',
        contactEmail: '',
        contactQq: '',
        weixin: '',
        ownership: '',
        bankName: '',
        bankCode: '',
        taxCode: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        remarks: '',
        customContactList: []
      },
      tableForm: {
        tableData: [{
          name: '',
          contactPhone: '',
          department: '',
          position: '',
          contactEmail: '',
          weixin: '',
          remarks: ''
        }]
      },
      // 新增表单的验证规则
      moreRules: {
        contactPhone: [{ required: true, message: '电话不能为空', trigger: 'blur' }, {
          validator: (rule, value, callback) => {
            if (/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value) || /^1[0-9]{10}$/.test(value)) {
              callback()
            } else {
              callback(new Error('请输入正确的电话号'))
            }
          },
          trigger: 'blur'
        }],
        contactEmail: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }, {
          validator: (rule, value, callback) => {
            if (!/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value)) {
              callback(new Error('请输入正确的邮箱号'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    dataRule () {
      // 电话校验
      let validateMobile = (rule, value, callback) => {
        if (value) {
          if (!isPhone(value)) {
            return callback(new Error('请输入正确的电话号'))
          }
        }
        callback()
      }
      // 手机号校验
      let validatePhone = (rule, value, callback) => {
        if (value) {
          if (!isMobile(value)) {
            return callback(new Error('请输入正确的手机号'))
          }
        }
        callback()
      }
      return {
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        phone: [
          { validator: validateMobile, trigger: 'blur' }
        ],
        contactPhone: [
          { validator: validatePhone, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.tableForm.tableData = []
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        Promise.all([
          this.getTypeList(),
          this.getOriginList(),
          this.getLevelList(),
          this.getIndustryList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    // 获取类型集合
    getTypeList: function () {
      this.$http.get(`/costom/customtype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.typeList = res.data
      }).catch(() => {
      })
    },
    // 获取来源集合
    getOriginList: function () {
      this.$http.get(`/costom/customorigin/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.originList = res.data
      }).catch(() => {
      })
    },
    // 获取等级集合
    getLevelList: function () {
      this.$http.get(`/costom/customlevel/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.levelList = res.data
      }).catch(() => {
      })
    },
    // 获取行业类型集合
    getIndustryList: function () {
      this.$http.get(`/costom/customindustry/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.industryList = res.data
      }).catch(() => {
      })
    },
    // 绑定省市县
    handleChange (value) {
      this.dataForm.provinceId = this.selectedOptions[0]
      this.dataForm.cityId = this.selectedOptions[1]
      this.dataForm.areaId = this.selectedOptions[2]
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/costom/custominfo/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.selectedOptions = [Number(this.dataForm.provinceId), Number(this.dataForm.cityId), Number(this.dataForm.areaId)]
        this.handleChange(this.selectedOptions)
        this.tableForm.tableData = res.data.customContactList
      }).catch(() => {})
    },
    // 增加行
    addRow () {
      this.tableForm.tableData.push({
        name: '',
        contactPhone: '',
        department: '',
        position: '',
        contactEmail: '',
        contactQq: '',
        weixin: '',
        remarks: ''
      })
    },
    handleDelete (index) { // 删除行数
      this.tableForm.tableData.splice(index, 1)
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.dataForm.customContactList = this.tableForm.tableData
        this.$http[!this.dataForm.id ? 'post' : 'put']('/costom/custominfo/', this.dataForm).then(({ data: res }) => {
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
