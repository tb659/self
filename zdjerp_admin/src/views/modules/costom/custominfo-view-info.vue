<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false" width="75%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="6">
          <el-form-item label="客户名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="客户名称"  readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="公司网址" prop="net">
            <el-input v-model="dataForm.net" placeholder="公司网址" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属行业" prop="industryId">
            <el-select v-model="dataForm.industryId" placeholder="请选择" clearable filterable style="width: 100%" disabled>
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
            <el-input v-model="dataForm.phone" placeholder="公司电话" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="传真" prop="fax">
            <el-input v-model="dataForm.fax" placeholder="传真" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属地区" prop="areaId">
            <el-cascader
              :options="CityInfo"
              v-model="selectedOptions"
              :change-on-select="true"
              :clearable="true"
              :filterable="true" style="width: 100%" disabled>
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="公司地址" prop="address">
        <el-input v-model="dataForm.address" placeholder="公司地址" readonly></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="dataForm.contact" placeholder="联系人" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属部门" prop="contactDepart">
            <el-input v-model="dataForm.contactDepart" placeholder="所属部门"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="邮箱" prop="contactEmail">
            <el-input v-model="dataForm.contactEmail" placeholder="邮箱" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="QQ" prop="contactQq">
            <el-input v-model="dataForm.contactQq" placeholder="QQ" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="联系人手机" prop="contactPhone">
            <el-input v-model="dataForm.contactPhone" placeholder="联系人手机" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="微信" prop="weixin">
            <el-input v-model="dataForm.weixin" placeholder="微信" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="客户类型" prop="typeId">
            <el-select v-model="dataForm.typeId" placeholder="请选择" clearable filterable style="width: 100%" disabled>
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
            <el-select v-model="dataForm.originId" placeholder="请选择" clearable filterable style="width: 100%" disabled>
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
            <el-select v-model="dataForm.levelId" placeholder="请选择" clearable filterable style="width: 100%" disabled>
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
            <el-input v-model="dataForm.taxCode" placeholder="税号" readonly></el-input>
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
            <el-input v-model="dataForm.cardCode" placeholder="证件编号" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开户行" prop="bankName">
            <el-input v-model="dataForm.bankName" placeholder="开户行" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="银行账号" prop="bankCode">
            <el-input v-model="dataForm.bankCode" placeholder="银行账号" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="dataForm.remarks" placeholder="备注" type="textarea" readonly></el-input>
      </el-form-item>
      </el-form>
    <template>
      <div class="tableData">
        <div class="table" >
          <el-table :data="tableData" ref="table" tooltip-effect="dark" border stripe style="width: 100%">
            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
            <el-table-column label="联系人姓名">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" placeholder="姓名" :maxlength = '10' readonly></el-input>
              </template>
            </el-table-column>
            <el-table-column label="联系人电话">
              <template slot-scope="scope">
                <el-input v-model="scope.row.contactPhone" placeholder="联系电话" :maxlength = '10' readonly></el-input>
              </template>
            </el-table-column>
            <el-table-column label="所属部门">
              <template slot-scope="scope">
                <el-input v-model="scope.row.department" placeholder="所属部门" :maxlength = '30' readonly></el-input>
              </template>
            </el-table-column>
            <el-table-column label="职位">
              <template slot-scope="scope">
                <el-input v-model="scope.row.position" placeholder="职位" :maxlength = '10' readonly></el-input>
              </template>
            </el-table-column>
            <el-table-column label="邮箱">
              <template slot-scope="scope">
                <el-input v-model="scope.row.contactEmail" placeholder="邮箱" :maxlength = '30' readonly></el-input>
              </template>
            </el-table-column>
            <el-table-column label="微信">
              <template slot-scope="scope">
                <el-input v-model="scope.row.weixin" placeholder="微信" :maxlength = '10' readonly></el-input>
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remarks" placeholder="备注" :maxlength = '10' readonly></el-input>
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
import CityInfo from '@/utils/citydata'
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
        delFlag: ''
      },
      tableData: []
    }
  },
  methods: {
    init () {
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
        this.tableData = res.data.customContactList
      }).catch(() => {})
    }
  }
}
</script>
