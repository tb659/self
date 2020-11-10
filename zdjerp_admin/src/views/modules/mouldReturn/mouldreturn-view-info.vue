<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false" width="65%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '100px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="工单号" prop="workOrderCode">
            <el-input v-model="dataForm.workOrderCode" :readonly="true" placeholder="工单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入库库房" prop="warehouseId">
            <el-input v-model="dataForm.warehouseName" :readonly="true" placeholder="入库库房"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="退回时间" prop="returnTime">
            <el-input v-model="dataForm.returnTime" :readonly="true" placeholder="退回时间"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="退回人" prop="returnUserId">
            <el-input v-model="dataForm.returnUserName" :readonly="true" placeholder="退回人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="退回人电话" prop="returnUserPhone">
            <el-input v-model="dataForm.returnUserPhone" :readonly="true" placeholder="退回人电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="经办人" prop="operatorId">
            <el-input v-model="dataForm.operatorName" :readonly="true" placeholder="经办人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" :readonly="true" placeholder="备注"></el-input>
      </el-form-item>
      <el-table :data="dataList" border style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="typeId" show-overflow-tooltip label="模具类型" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="type in mouldTypeList">
              <template v-if="type.id === scope.row.typeId">{{type.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="code" show-overflow-tooltip label="系统编码" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="模具名称" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="mnemonicCode" show-overflow-tooltip label="助记码" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="unit" show-overflow-tooltip label="单位" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="unit in unitList">
              <template v-if="unit.id === scope.row.unit">{{unit.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="specifications" show-overflow-tooltip label="模具规格" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="applicableComponents" show-overflow-tooltip label="模具适用构件" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="entryDate" show-overflow-tooltip label="模具进场日期" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="productionUnit" show-overflow-tooltip label="制作单位" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" header-align="center" align="center" width="150"></el-table-column>
      </el-table>
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
      warehouseList: [],
      userList: [],
      mouldTypeList: [],
      unitList: [],
      dataList: [],
      specificationsList: [],
      dataForm: {
        id: '',
        receiveId: '',
        workOrderCode: '',
        returnTime: '',
        returnUserId: '',
        returnUserName: '',
        returnUserPhone: '',
        warehouseId: '',
        warehouseName: '',
        operatorId: '',
        operatorName: '',
        remark: '',
        status: '',
        reviewStatus: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        mouldList: []
      },
      type: ''
    }
  },
  created: function () {
    this.getMouldTypeList()
    this.getUnitList()
    this.getSpecificationsList()
    this.getWarehouseList()
    this.getUserList()
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 仓库列表
    getWarehouseList () {
      this.$http.get(`/basis/storeroom/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.warehouseList = res.data
      }).catch(() => {})
    },
    // 用户列表
    getUserList () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
      }).catch(() => {})
    },
    // 模具类型列表
    getMouldTypeList () {
      this.$http.get(`/mould/mouldtype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.mouldTypeList = res.data
      }).catch(() => {})
    },
    // 单位列表
    getUnitList () {
      this.$http.get(`/articleUnit/articleunit/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.unitList = res.data
      }).catch(() => {})
    },
    // 规格列表
    getSpecificationsList () {
      this.$http.get(`/basis/specification/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.specificationsList = res.data
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/mouldReturn/mouldreturn/get/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.warehouseList.forEach(item => {
          if (item.id === this.dataForm.warehouseId) {
            this.dataForm.warehouseName = item.name
          }
        })
        this.userList.forEach(item => {
          if (item.id === this.dataForm.returnUserId) {
            this.dataForm.returnUserName = item.realName
          }
          if (item.id === this.dataForm.operatorId) {
            this.dataForm.operatorName = item.realName
          }
        })
        this.dataList = this.dataForm.mouldList
      }).catch(() => {})
    }
  }
}
</script>
