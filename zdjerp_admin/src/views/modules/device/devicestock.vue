<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-device__devicestock}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="设备名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.mnemonicCode" placeholder="助记码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-select v-model="printType" filterable clearable placeholder="批量打印类型" style="width: 100%;">
            <el-option label="二维码" value="1"></el-option>
            <el-option label="二维码（小）" value="2"></el-option>
            <el-option label="RFID" value="3"></el-option>
            <el-option label="巡检/保养二维码" value="4"></el-option>
            <el-option label="巡检/保养二维码（小）" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('preproduction:preproductioninformation:printQrCode')" type="primary" @click="batchPrint()">批量打印</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" :row-key="getRowKeys" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50" :reserve-selection="true"></el-table-column>
        <el-table-column type="index"  label="序号" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="code" label="系统编码" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="typeName" label="设备类型" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="name" label="设备名称" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="mnemonicCode" label="助记码" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="quantity" label="数量" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="deviceNo" label="设备编号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="specificationType" label="规格型号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="power" label="设备功率" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="voltage" label="电压" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="productionCapacity" label="生产能力" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="manufactor" label="生产厂家" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="productionUnit" label="制作单位" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="unitprice" label="单价" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="amount" label="金额" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="taxrate" label="税率" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="taxunitprice" label="含税单价" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="taxamount" label="含税金额" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="170">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('device:devicestock:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('device:devicestock:printQrCode')" type="text" size="small" @click="printQrCode(scope.row)">二维码</el-button>
            <el-button v-if="$hasPermission('device:devicestock:printQrCode')" type="text" size="small" @click="printQrCodeBySmall(scope.row)">二维码(小)</el-button>
            <el-button v-if="$hasPermission('device:devicestock:printQrCode')" type="text" size="small" @click="printRFID(scope.row)">RFID</el-button>
            <el-button v-if="$hasPermission('device:devicestock:printQrCode')" type="text" size="small" @click="printId(scope.row)">巡检/保养二维码</el-button>
            <el-button v-if="$hasPermission('device:devicestock:printQrCode')" type="text" size="small" @click="printIdBySmall(scope.row)">巡检/保养二维码(小)</el-button>
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
      <!-- 弹窗, 查看 -->
      <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import ViewInfo from './devicestock-view-info'
import axios from 'axios'
import qs from 'qs'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: false,
        getDataListURL: '/device/devicestock/page',
        getDataListIsPage: true,
        exportURL: '/device/devicestock/export',
        deleteURL: '/device/devicestock',
        deleteIsBatch: true
      },
      dataForm: {
        id: '',
        deviceId: ''
      },
      printType: ''
    }
  },
  activated () {
    if (this.dataForm.deviceId === '') {
      this.dataForm.deviceId = this.$route.params.deviceId || ''
      if (this.dataForm.deviceId !== '') {
        this.mixinViewModuleOptions.getDataListURL = '/device/devicestock/page'
      }
    } else {
      this.$route.params.deviceId = this.dataForm.deviceId
    }
    this.getDataList()
  },
  components: {
    ViewInfo
  },
  methods: {
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
          this.printQrCodeBySmall(item)
        })
      }
      if (this.printType === '3') {
        this.dataListSelections.forEach(item => {
          this.printRFID(item)
        })
      }
      if (this.printType === '4') {
        this.dataListSelections.forEach(item => {
          this.printId(item)
        })
      }
      if (this.printType === '5') {
        this.dataListSelections.forEach(item => {
          this.printIdBySmall(item)
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
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '350,45,0,6,2,2,N,设备编码: ' + row.deviceNo + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '160,200,0,6,2,2,N,设备名称：' + row.name + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '160,300,0,6,2,2,N,规格型号：' + row.specifications + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '160,400,0,6,2,2,N,设备分类：' + row.typeName + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawBar2D_QR': '730,230,350,350,0,7,2,0,0,' + `${window.SITE_CONFIG[ 'printURL1' ]}` + '/index/goods?type=1&id=' + row.id })
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
    printQrCodeBySmall (row) {
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
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '290,45,0,6,2,2,N,设备编码: ' + row.deviceNo + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '100,200,0,6,2,2,N,设备名称：' + row.name + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '100,300,0,6,2,2,N,规格型号：' + row.specifications + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '100,400,0,6,2,2,N,设备分类：' + row.typeName + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawBar2D_QR': '670,230,350,350,0,7,2,0,0,' + `${window.SITE_CONFIG[ 'printURL1' ]}` + '/index/goods?type=1&id=' + row.id })
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
      printparamsJsonArray.push({ 'PTK_DrawBar2D_QR': '235,45,260,260,0,8,4,0,8,' + `${window.SITE_CONFIG[ 'printURL1' ]}` + '/index/goods?type=1&id=' + row.id })
      printparamsJsonArray.push({ 'PTK_RWRFIDLabel': '1,0,2,6,1,' + row.id + 'ABCCDEF01' })
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
    printId (row) {
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
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '350,45,0,6,2,2,N,设备编码: ' + row.deviceNo + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '160,200,0,6,2,2,N,设备名称：' + row.name + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '160,300,0,6,2,2,N,规格型号：' + row.specifications + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '160,400,0,6,2,2,N,设备分类：' + row.typeName + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawBar2D_QR': '730,230,350,350,0,12,2,0,0,deviceId:' + row.id })
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
    printIdBySmall (row) {
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
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '290,45,0,6,2,2,N,设备编码: ' + row.deviceNo + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '100,200,0,6,2,2,N,设备名称：' + row.name + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '100,300,0,6,2,2,N,规格型号：' + row.specifications + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '100,400,0,6,2,2,N,设备分类：' + row.typeName + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawBar2D_QR': '670,230,350,350,0,12,2,0,0,deviceId:' + row.id })
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
    getRowKeys (row) {
      return row.id
    }
  }
}
</script>
