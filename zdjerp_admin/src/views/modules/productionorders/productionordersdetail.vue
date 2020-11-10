<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-productionorders__productionordersdetail}">
      <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
        <el-row>
          <el-col :span="6">
            <el-form-item label="合同编号" prop="contractNo">
              <el-input v-model="dataForm.contractNo" placeholder="合同编号" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编号" prop="documentNumber">
              <el-input v-model="dataForm.documentNumber" placeholder="单据编号" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据日期" prop="documentDate">
              <el-input v-model="dataForm.documentDate" placeholder="单据日期" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总数量" prop="totalNumber">
              <el-input v-model="dataForm.totalNumber" placeholder="总数量" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="单据说明" prop="documentDescription">
          <el-input type="textarea" v-model="dataForm.documentDescription" placeholder="单据说明" maxlength="200" readonly></el-input>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="productionProcedureHandle">批量设置工序</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataForm.detailList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="productCoding" show-overflow-tooltip label="编码" width="250" header-align="center" align="center"></el-table-column>
        <el-table-column prop="productName" show-overflow-tooltip label="名称" width="150" header-align="center" align="center"></el-table-column>
        <el-table-column prop="deptId" show-overflow-tooltip label="单位" width="80" header-align="center" align="center">
          <template slot-scope="scope">
            <template v-for="item in deptList">
              <template v-if="item.id === scope.row.deptId">{{item.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="outlineSize" show-overflow-tooltip label="外形尺寸" width="250" header-align="center" align="center"></el-table-column>
        <el-table-column prop="quantity" show-overflow-tooltip label="数量" width="80" header-align="center" align="center"></el-table-column>
        <el-table-column prop="procedureStatus" label="工序设置状态" width="120" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.procedureStatus === 0" size="small" type="danger">未设置</el-tag>
            <el-tag v-if="scope.row.procedureStatus === 1" size="small" type="success">已设置</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="生成预生产构件状态" width="160" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" size="small" type="danger">未生成</el-tag>
            <el-tag v-if="scope.row.status === 1" size="small" type="success">已生成</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" width="250" header-align="center" align="center"></el-table-column>
        <el-table-column prop="buildingNo" show-overflow-tooltip label="楼号" width="150" header-align="center" align="center"></el-table-column>
        <el-table-column prop="floorNo" show-overflow-tooltip label="层号" width="150" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="productionProcedureHandle(scope.row)">设置工序</el-button>
            <el-button type="text" size="small" v-if="scope.row.status === 0" @click="addProductionInformationHandle(scope.row)">生成预生产构件</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <!-- 弹窗, 查看 -->
      <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
      <!-- 弹窗，设置工序 -->
      <production-procedure v-if="productionProcedureVisible" ref="productionProcedure" @refreshDataList="getDataList"></production-procedure>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './productionordersdetail-add-or-update'
import ViewInfo from './productionordersdetail-view-info'
import ProductionProcedure from './production-procedure'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/productionorders/productionorders/page',
        getDataListIsPage: true,
        exportURL: '/productionorders/productionorders/export',
        deleteURL: '/productionorders/productionorders',
        deleteIsBatch: true
      },
      productionProcedureVisible: false,
      specificationList: [],
      modelList: [],
      deptList: [],
      dataForm: {
        id: '',
        contractNo: '',
        documentDate: '',
        documentNumber: '',
        preparedId: '',
        documentDescription: '',
        totalNumber: '',
        inNumber: '',
        notInNumber: '',
        reviewStatus: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        detailList: []
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo, ProductionProcedure
  },
  activated () {
    if (this.dataForm.id === '') {
      this.dataForm.id = this.$route.params.id || ''
      if (this.dataForm.id) {
        this.getSpecificationList()
        this.getModelList()
        this.getDeptList()
        this.$refs['dataForm'].resetFields()
        this.getInfo()
      }
    }
    this.getDataList()
  },
  methods: {
    productionProcedureHandle (row) {
      if (this.mixinViewModuleOptions.deleteIsBatch && !row.id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: '请选择需要批量设置工序的构件',
          type: 'warning',
          duration: 1000
        })
      }
      this.productionProcedureVisible = true
      this.$nextTick(() => {
        this.$refs.productionProcedure.dataForm.productionOrdersDetailId = row.id
        this.$refs.productionProcedure.dataForm.productionOrdersDetailIds = row.id ? [row.id] : this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey])
        this.$refs.productionProcedure.init()
      })
    },
    // 规格列表
    getSpecificationList: function () {
      this.$http.get(`/basis/specification/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.specificationList = res.data
      }).catch(() => {
      })
    },
    // 型号列表
    getModelList: function () {
      this.$http.get(`/basis/model/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.modelList = res.data
      }).catch(() => {
      })
    },
    // 单位列表
    getDeptList () {
      this.$http.get(`/articleUnit/articleunit/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data
      }).catch(() => {})
    },
    getInfo () {
      this.$http.get(`/productionorders/productionorders/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      })
    },
    addProductionInformationHandle (row) {
      this.$http.post(`productionorders/productionordersdetail/addProductionInformation`, {
        id: row.id,
        productionOrdersId: row.productionOrdersId
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$message({
          message: this.$t('prompt.success'),
          type: 'success',
          duration: 500,
          onClose: () => {
            this.getInfo()
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
