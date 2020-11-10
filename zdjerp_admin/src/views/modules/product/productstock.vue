<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="block" style="float: left; width: 15%; height: 450px; position:absolute">
      <el-scrollbar style="height: 100%;">
        <el-tree :data="warehouseTreeList" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false" style="display:inline-block;">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span @click="handleNodeClick(data, node)" :title="node.label">{{ node.label.length > 8 ? node.label.substr(0,8) + '...' : node.label }}</span>
            <span>
              <el-button type="text" v-show="data.pid == 0" size="small" icon="el-icon-refresh" @click="refreshHandle()"></el-button>
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="mod-product__productstock}" style = "float: right; width:83%;">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-popover v-model="productTypeTreeListVisible" ref="productTypeListPopover" placement="bottom-start" trigger="click">
            <el-tree
              :data="productTypeTreeList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="productTypeListTree"
              :highlight-current="true"
              :expand-on-click-node="false"
              accordion
              @current-change="productTypeListTreeCurrentChangeHandle">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.productTypeName" v-popover:productTypeListPopover  placeholder="产成品类型">
            <i
              v-if="dataForm.productTypeId !== ''"
              slot="suffix"
              @click.stop="productTypeListTreeSetDefaultHandle()"
              class="el-icon-circle-close el-input__icon">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="编码/系列/名称/助记码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.projectName" placeholder="项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-select v-model="printType" filterable clearable placeholder="批量打印类型" style="width: 100%;">
            <el-option label="二维码" value="1"></el-option>
            <el-option label="二维码（小）" value="2"></el-option>
            <el-option label="防水二维码" value="3"></el-option>
            <el-option label="RFID" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('preproduction:preproductioninformation:printQrCode')" type="primary" @click="batchPrint()">批量打印</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" :row-key="getRowKeys" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50" :reserve-selection="true"></el-table-column>
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="typeId" label="产成品类型" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="type in productTypeList">
              <template v-if="type.id === scope.row.typeId">{{type.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="系统编码" show-overflow-tooltip header-align="center" align="center" width="240px"></el-table-column>
        <el-table-column prop="componentSeries" label="构件系列" show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>
        <el-table-column prop="componentName" label="构件名称" show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>
        <el-table-column prop="mnemonicCode" label="助记码" show-overflow-tooltip header-align="center" align="center" width="100px"></el-table-column>
        <el-table-column prop="warehouseName" label="库房位置" show-overflow-tooltip header-align="center" align="center" width="100px"></el-table-column>
        <el-table-column prop="unit" label="单位" header-align="center" align="center">
          <template slot-scope="scope">
            <template v-for="unit in unitList">
              <template v-if="unit.id === scope.row.unit">{{unit.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="useSite" label="适用部位" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="useSiteDict in useSiteDictList">
              <template v-if="useSiteDict.id === scope.row.useSite">{{useSiteDict.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="outlineSize" label="外形尺寸" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="concreteStrengthGrade" label="混凝土强度等级" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="concreteStrengthGradeDict in concreteStrengthGradeDictList">
              <template v-if="concreteStrengthGradeDict.id === scope.row.concreteStrengthGrade">{{concreteStrengthGradeDict.grade}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="buildingNo" label="楼号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="floorNo" label="层号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="standardDrawingNo" label="标准图号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="batch" label="批次" show-overflow-tooltip header-align="center" align="center" width="100px"></el-table-column>
        <el-table-column prop="castingDate" label="浇筑日期" show-overflow-tooltip header-align="center" align="center" width="180px"></el-table-column>
        <el-table-column prop="productionDate" label="生产日期" show-overflow-tooltip header-align="center" align="center" width="180px"></el-table-column>
        <el-table-column prop="length" label="长" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="width" label="宽" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="height" label="高" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="qualityInspection" label="质量检验" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="visualInspection" label="外观检验" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="productionManager" label="生产负责人" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <template v-for="user in userList">
              <template v-if="user.id === scope.row.productionManager">{{user.realName}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="qualityInspector" label="质检员" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <template v-for="user in userList">
              <template v-if="user.id === scope.row.qualityInspector">{{user.realName}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="experimenter" label="实验员" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <template v-for="user in userList">
              <template v-if="user.id === scope.row.experimenter">{{user.realName}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('product:productstock:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('product:productstock:printQrCode')" type="text" size="small" @click="printQrCode(scope.row)">二维码</el-button>
            <el-button v-if="$hasPermission('product:productstock:printQrCode')" type="text" size="small" @click="printQrCodeSmall(scope.row)">二维码(小)</el-button>
            <el-button v-if="$hasPermission('product:productstock:printQrCode')" type="text" size="small" @click="printNewQrCode(scope.row)">防水二维码</el-button>
            <el-button v-if="$hasPermission('product:productstock:printQrCode')" type="text" size="small" @click="printRFID(scope.row)">RFID</el-button>
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
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './productstock-add-or-update'
import ViewInfo from './productstock-view-info'
import axios from 'axios'
import qs from 'qs'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/product/productstock/page',
        getDataListIsPage: true,
        exportURL: '/product/productstock/export',
        deleteURL: '/product/productstock',
        deleteIsBatch: true
      },
      warehouseTreeList: [],
      flag: '',
      productTypeTreeListVisible: false,
      productTypeTreeList: [],
      productTypeList: [],
      unitList: [],
      modelList: [],
      specificationsList: [],
      useSiteDictList: [],
      concreteStrengthGradeDictList: [],
      qualityInspectionDictList: [],
      visualInspectionDictList: [],
      userList: [],
      dataForm: {
        id: '',
        name: '',
        warehouseId: '',
        productTypeName: '',
        productTypeId: '',
        leaveFactoryStatus: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        pid: 'pid'
      },
      printType: ''
    }
  },
  created () {
    this.getWarehouseTreeList()
    this.getProductTypeTreeList()
    this.getProductTypeList()
    this.getUnitList()
    // this.getModelList()
    // this.getSpecificationsList()
    this.getUseSiteDictList()
    this.getConcreteStrengthGradeDictList()
    this.getQualityInspectionDictList()
    this.getVisualInspectionDictList()
    this.getUserList()
  },
  components: {
    AddOrUpdate, ViewInfo
  },
  methods: {
    refreshHandle () {
      this.getWarehouseTreeList()
    },
    handleNodeClick (data, node) {
      this.dataForm.warehouseId = data.id
      this.getDataList()
    },
    getWarehouseTreeList () {
      this.$http.get(`/basis/storeroom/list`, {
        params: {
          status: 1,
          type: 2
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.warehouseTreeList = res.data
        this.dataForm.warehouseId = ''
        this.dataForm.code = ''
        this.dataForm.name = ''
        this.dataForm.specificationType = ''
        this.getDataList()
      }).catch(() => {})
    },
    // 库房
    productTypeListTreeCurrentChangeHandle (data, node) {
      this.dataForm.productTypeId = data.id
      this.dataForm.productTypeName = data.name
      this.productTypeTreeListVisible = false
    },
    productTypeListTreeSetDefaultHandle () {
      this.dataForm.productTypeId = ''
      this.dataForm.productTypeName = ''
    },
    getProductTypeTreeList () {
      this.$http.get(`/product/producttype/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.productTypeTreeList = res.data
      }).catch(() => {
      })
    },
    getProductTypeList () {
      this.$http.get(`/product/producttype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.productTypeList = res.data
      }).catch(() => {
      })
    },
    // 单位列表
    getUnitList () {
      this.$http.get(`/articleUnit/articleunit/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.unitList = res.data
      }).catch(() => {
      })
    },
    // 规格列表
    getSpecificationsList () {
      this.$http.get(`/basis/specification/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.specificationsList = res.data
      }).catch(() => {
      })
    },
    // 型号列表
    getModelList () {
      this.$http.get(`/basis/model/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.modelList = res.data
      }).catch(() => {
      })
    },
    // 适用部位
    getUseSiteDictList () {
      this.$http.get(`applyPosition/applyposition/list`, {
        params: { dictType: 'sybw' }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.useSiteDictList = res.data
      }).catch(() => {
      })
    },
    // 混凝土强度等级
    getConcreteStrengthGradeDictList () {
      this.$http.get(`concreteStrength/concretestrength/list`, {
        params: { dictType: 'hntqddj' }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.concreteStrengthGradeDictList = res.data
      }).catch(() => {
      })
    },
    // 质量检验
    getQualityInspectionDictList () {
      this.$http.get(`sys/dict/dictList`, {
        params: { dictType: 'zljy' }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.qualityInspectionDictList = res.data
      }).catch(() => {
      })
    },
    // 外观检验
    getVisualInspectionDictList () {
      this.$http.get(`sys/dict/dictList`, {
        params: { dictType: 'wgjy' }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.visualInspectionDictList = res.data
      }).catch(() => {
      })
    },
    getUserList () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
      }).catch(() => {
      })
    },
    batchPrint () {
      if (!this.printType) {
        return this.$message({
          message: this.$t('请选择批量打印类型！'),
          type: 'warning',
          duration: 1000
        })
      }
      if (this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('请选择要操作的项！'),
          type: 'warning',
          duration: 1000
        })
      }
      if (this.printType === '1') {
        this.dataListSelections.forEach(item => {
          this.printQrCode(item)
        })
      }
      if (this.printType === '2') {
        this.dataListSelections.forEach(item => {
          this.printQrCodeSmall(item)
        })
      }
      if (this.printType === '3') {
        this.dataListSelections.forEach(item => {
          this.printNewQrCode(item)
        })
      }
      if (this.printType === '4') {
        this.dataListSelections.forEach(item => {
          this.printRFID(item)
        })
      }
    },
    printQrCode (row) {
      var data = {}
      data.reqParam = '1'
      data.lang = 'zh'
      var printparamsJsonArray = []
      printparamsJsonArray.push({ 'OpenPort': '255' })
      printparamsJsonArray.push({ 'PTK_PcxGraphicsDel': '*' })
      printparamsJsonArray.push({ 'PTK_ClearBuffer': '' })
      printparamsJsonArray.push({ 'PTK_SetDirection': 'B' })
      printparamsJsonArray.push({ 'PTK_SetPrintSpeed': '4' })
      printparamsJsonArray.push({ 'PTK_SetDarkness': '10' })
      printparamsJsonArray.push({ 'PTK_SetLabelHeight': '690,8,0,false' })
      printparamsJsonArray.push({ 'PTK_SetLabelWidth': '1100' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '350,45,0,3,1,2,N,ID: ' + row.code + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '160,190,0,6,2,2,N,构件名称：' + row.componentName + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '160,280,0,6,2,2,N,构件系列：' + row.componentSeries + ',0' })
      var productionDate = row.productionDate
      var arr = productionDate.split(' ')
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '160,370,0,6,2,2,N,生产日期：' + arr[0] + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '160,460,0,6,2,2,N,质量检验：' + row.qualityInspection + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawBar2D_QR': '730,230,350,350,0,7,2,0,0,' + `${window.SITE_CONFIG[ 'printURL' ]}` + '/index/index?id=' + row.id })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '160,550,40,0,6,1,300,0,0,0,中电建（洛阳）装配式建筑科技有限公司' })
      printparamsJsonArray.push({ 'PTK_AnyGraphicsPrint': '160,0,103903660,C:\\logo.jpg,0,180,160,0' })

      printparamsJsonArray.push({ 'PTK_PrintLabel': '1,1' })
      printparamsJsonArray.push({ 'ClosePort': '' })
      data.printparams = JSON.stringify(printparamsJsonArray)
      var url = 'http://127.0.0.1:888/postek/print'
      axios.post(url, qs.stringify(data), {
      }).then(response => {
        this.$message('打印成功')
      }).catch(response => {
        this.$message('打印失败')
      })
    },
    printQrCodeSmall (row) {
      var data = {}
      data.reqParam = '1'
      data.lang = 'zh'
      var printparamsJsonArray = []
      printparamsJsonArray.push({ 'OpenPort': '255' })
      printparamsJsonArray.push({ 'PTK_PcxGraphicsDel': '*' })
      printparamsJsonArray.push({ 'PTK_ClearBuffer': '' })
      printparamsJsonArray.push({ 'PTK_SetDirection': 'B' })
      printparamsJsonArray.push({ 'PTK_SetPrintSpeed': '4' })
      printparamsJsonArray.push({ 'PTK_SetDarkness': '10' })
      printparamsJsonArray.push({ 'PTK_SetLabelHeight': '690,8,0,false' })
      printparamsJsonArray.push({ 'PTK_SetLabelWidth': '1100' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '290,45,0,3,1,2,N,ID: ' + row.code + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '100,190,0,6,2,2,N,构件名称：' + row.componentName + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '100,280,0,6,2,2,N,构件系列：' + row.componentSeries + ',0' })
      var productionDate = row.productionDate
      var arr = productionDate.split(' ')
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '100,370,0,6,2,2,N,生产日期：' + arr[0] + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '100,460,0,6,2,2,N,质量检验：' + row.qualityInspection + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawBar2D_QR': '670,230,350,350,0,7,2,0,0,' + `${window.SITE_CONFIG[ 'printURL' ]}` + '/index/index?id=' + row.id })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '100,550,40,0,6,1,300,0,0,0,中电建（洛阳）装配式建筑科技有限公司' })
      printparamsJsonArray.push({ 'PTK_AnyGraphicsPrint': '100,0,103903660,C:\\logo.jpg,0,180,160,0' })

      printparamsJsonArray.push({ 'PTK_PrintLabel': '1,1' })
      printparamsJsonArray.push({ 'ClosePort': '' })
      data.printparams = JSON.stringify(printparamsJsonArray)
      var url = 'http://127.0.0.1:888/postek/print'
      axios.post(url, qs.stringify(data), {
      }).then(response => {
        this.$message('打印成功')
      }).catch(response => {
        this.$message('打印失败')
      })
    },
    printNewQrCode (row) {
      var data = {}
      data.reqParam = '1'
      data.lang = 'zh'
      var printparamsJsonArray = []
      printparamsJsonArray.push({ 'OpenPort': '255' })
      printparamsJsonArray.push({ 'PTK_PcxGraphicsDel': '*' })
      printparamsJsonArray.push({ 'PTK_ClearBuffer': '' })
      printparamsJsonArray.push({ 'PTK_SetDirection': 'B' })
      printparamsJsonArray.push({ 'PTK_SetPrintSpeed': '4' })
      printparamsJsonArray.push({ 'PTK_SetDarkness': '10' })
      printparamsJsonArray.push({ 'PTK_SetLabelHeight': '690,8,0,false' })
      printparamsJsonArray.push({ 'PTK_SetLabelWidth': '1100' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '470,85,0,3,1,2,N,ID: ' + row.code + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '280,230,0,6,2,2,N,构件名称：' + row.componentName + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '280,320,0,6,2,2,N,构件系列：' + row.componentSeries + ',0' })
      var productionDate = row.productionDate
      var arr = productionDate.split(' ')
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '280,410,0,6,2,2,N,生产日期：' + arr[0] + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '280,500,0,6,2,2,N,质量检验：' + row.qualityInspection + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawBar2D_QR': '850,270,350,350,0,7,2,0,0,' + `${window.SITE_CONFIG[ 'printURL' ]}` + '/index/index?id=' + row.id })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '280,610,40,0,6,1,300,0,0,0,中电建（洛阳）装配式建筑科技有限公司' })
      printparamsJsonArray.push({ 'PTK_AnyGraphicsPrint': '280,40,103903660,C:\\logo.jpg,0,180,160,0' })

      printparamsJsonArray.push({ 'PTK_PrintLabel': '1,1' })
      printparamsJsonArray.push({ 'ClosePort': '' })
      data.printparams = JSON.stringify(printparamsJsonArray)
      var url = 'http://127.0.0.1:888/postek/print'
      axios.post(url, qs.stringify(data), {
      }).then(response => {
        this.$message('打印成功')
      }).catch(response => {
        this.$message('打印失败')
      })
    },
    printRFID (row) {
      var data = {}
      data.reqParam = '1'
      data.lang = 'zh'
      var printparamsJsonArray = []

      printparamsJsonArray.push({ 'OpenPort': '255' })
      printparamsJsonArray.push({ 'PTK_PcxGraphicsDel': '*' })
      printparamsJsonArray.push({ 'PTK_ClearBuffer': '' })
      printparamsJsonArray.push({ 'PTK_SetDirection': 'B' })
      printparamsJsonArray.push({ 'PTK_SetPrintSpeed': '4' })
      printparamsJsonArray.push({ 'PTK_SetDarkness': '10' })
      printparamsJsonArray.push({ 'PTK_SetLabelHeight': '360,1,0,false' })// 300
      printparamsJsonArray.push({ 'PTK_SetLabelWidth': '600' })// 800
      printparamsJsonArray.push({ 'PTK_DrawBar2D_QR': '235,45,260,260,0,8,4,0,8,' + `${window.SITE_CONFIG[ 'printURL' ]}` + '/index/index?id=' + row.id })
      printparamsJsonArray.push({ 'PTK_RWRFIDLabel': '1,0,2,6,1,' + row.id + 'ABCCDEF04' })
      printparamsJsonArray.push({ 'PTK_PrintLabel': '1,1' })
      data.printparams = JSON.stringify(printparamsJsonArray)
      var url = 'http://127.0.0.1:888/postek/print'
      axios.post(url, qs.stringify(data), {
      }).then(response => {
        console.log('post发送Ajax请求,请求成功', response.data)
      }).catch(response => {
        console.log('post发送Ajax请求,请求失败', response)
      })
    },
    getRowKeys (row) {
      return row.id
    }
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view{
    white-space: nowrap;
  }
  .el-scrollbar .el-scrollbar__wrap{overflow-x: hidden;}
</style>
