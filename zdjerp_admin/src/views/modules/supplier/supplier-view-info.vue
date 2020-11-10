<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false" width="75%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input v-model="dataForm.supplierName" placeholder="供应商名称" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商类别" prop="supplierTypeId">
            <el-select v-model="dataForm.supplierTypeId"   disabled placeholder="请选择" clearable filterable style="width: 100%">
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
            <el-input v-model="dataForm.supplierNet" placeholder="网址" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="电话" prop="supplierPhone">
            <el-input v-model="dataForm.supplierPhone" placeholder="电话" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="传真" prop="supplierFax">
            <el-input v-model="dataForm.supplierFax" placeholder="传真" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="城市" prop="cityId">
            <el-input v-model="dataForm.cityId" placeholder="城市" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="供应商地址" prop="supplierAdd">
        <el-input v-model="dataForm.supplierAdd" placeholder="供应商地址" readonly></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="联系人" prop="contactMan">
            <el-input v-model="dataForm.contactMan" placeholder="联系人" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机" prop="supplierMobile">
            <el-input v-model="dataForm.supplierMobile" placeholder="手机" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱" prop="supplierEmail">
            <el-input v-model="dataForm.supplierEmail" placeholder="邮箱" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="微信号" prop="supplierWeixin">
            <el-input v-model="dataForm.supplierWeixin" placeholder="微信号" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="QQ" prop="supplierQq">
            <el-input v-model="dataForm.supplierQq" placeholder="QQ" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮编" prop="supplierPost">
            <el-input v-model="dataForm.supplierPost" placeholder="邮编" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="开户银行" prop="bank">
            <el-input v-model="dataForm.bank" placeholder="开户银行" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户账号" prop="bankCode">
            <el-input v-model="dataForm.bankCode" placeholder="开户账号" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户名称" prop="bankName">
            <el-input v-model="dataForm.bankName" placeholder="开户名称" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="开户行2" prop="otherBank">
            <el-input v-model="dataForm.otherBank" placeholder="开户行2" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户账号2" prop="otherBankCode">
            <el-input v-model="dataForm.otherBankCode" placeholder="开户账号2" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户名2" prop="otherBankName">
            <el-input v-model="dataForm.otherBankName" placeholder="开户名2" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="附件" prop="enclosureUrl">
        <el-input v-model="dataForm.enclosureUrl" placeholder="附件" readonly></el-input>
      </el-form-item>
      <el-form-item label="税号" prop="taxCode">
        <el-input v-model="dataForm.taxCode" placeholder="税号" readonly></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input type="textarea"  v-model="dataForm.remarks" placeholder="备注" readonly></el-input>
      </el-form-item>
      </el-form>
    <template>
      <div class="tableDate">
        <div class="table">
          <el-table
            :data="tableData"
            ref="table"
            tooltip-effect="dark"
            border
            stripe
            style="width: 100%">
            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
            <el-table-column  label="联系人姓名" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" placeholder="联系人姓名" maxlength="50" readonly></el-input>
              </template>
            </el-table-column>
            <el-table-column label="联系人手机号" style="width: 16%">
              <template slot-scope="scope">
                <el-input v-model="scope.row.phoneNum" placeholder="联系人手机号" maxlength="11" readonly></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="邮箱" align="center" style="width: 16%">
              <template slot-scope="scope">
                <el-input v-model="scope.row.email" placeholder="邮箱" maxlength="50" readonly></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="QQ" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.qq" placeholder="QQ"  maxlength="20" readonly></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="微信" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.weixin" placeholder="微信"  maxlength="50" readonly></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="备注" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remarks" placeholder="备注" maxlength="50" readonly></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </template>
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
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        remarks: '',
        delFlag: ''
      }
    }
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
    }
  }
}
</script>
