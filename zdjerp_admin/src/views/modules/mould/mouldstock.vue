<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-mould__mouldstock}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-popover v-model="mouldTypeTreeListVisible" ref="mouldTypeListPopover" placement="bottom-start" trigger="click">
            <el-tree
              :data="mouldTypeTreeList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="mouldTypeListTree"
              :highlight-current="true"
              :expand-on-click-node="false"
              accordion
              @current-change="mouldTypeListTreeCurrentChangeHandle">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.typeName" v-popover:mouldTypeListPopover  placeholder="模具类型">
            <i
              v-if="dataForm.typeId !== ''"
              slot="suffix"
              @click.stop="mouldTypeListTreeSetDefaultHandle()"
              class="el-icon-circle-close el-input__icon">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="编码/名称/助记码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-select v-model="printType" filterable clearable placeholder="批量打印类型" style="width: 100%;">
            <el-option label="二维码" value="1"></el-option>
            <el-option label="二维码（小）" value="2"></el-option>
            <el-option label="RFID" value="3"></el-option>
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
        <el-table-column prop="typeName" label="模具类型" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="mouldId" label="模具" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="mould in mouldList">
              <template v-if="mould.id === scope.row.mouldId">{{mould.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="系统编码" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="name" label="模具名称" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="mnemonicCode" label="助记码" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="unit" label="单位" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <template v-for="unit in unitList">
              <template v-if="unit.id === scope.row.unit">{{unit.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="specifications" label="模具规格" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="applicableComponents" label="模具适用构件" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="entryDate" label="模具进场日期" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="manager" label="负责人" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="user in userList">
              <template v-if="user.id === scope.row.manager">{{user.realName}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="productionUnit" label="制作单位" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="unitprice" label="单价" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="amount" label="金额" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="taxrate" label="税率" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="taxunitprice" label="含税单价" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="taxamount" label="含税金额" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="status" label="模具状态" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="success">在库</el-tag>
            <el-tag v-if="scope.row.status === 1" type="danger">领取中</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="170">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('mould:mouldstock:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
<!--            <el-button v-if="$hasPermission('mould:mouldstock:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>-->
            <el-button v-if="$hasPermission('mould:mould:printQrCode')" type="text" size="small" @click="printQrCode(scope.row)">二维码</el-button>
            <el-button v-if="$hasPermission('mould:mould:printQrCode')" type="text" size="small" @click="printQrCodeSmall(scope.row)">二维码(小)</el-button>
            <el-button v-if="$hasPermission('mould:mould:printQrCode')" type="text" size="small" @click="printRFID(scope.row)">RFID</el-button>
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
import AddOrUpdate from './mouldstock-add-or-update'
import ViewInfo from './mouldstock-view-info'
import axios from 'axios'
import qs from 'qs'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/mould/mouldstock/page',
        getDataListIsPage: true,
        exportURL: '/mould/mouldstock/export',
        deleteURL: '/mould/mouldstock',
        deleteIsBatch: true
      },
      mouldTypeTreeListVisible: false,
      mouldTypeTreeList: [],
      mouldTypeList: [],
      mouldList: [],
      unitList: [],
      specificationsList: [],
      userList: [],
      dataForm: {
        id: '',
        name: '',
        typeId: '',
        typeName: ''
      },
      printType: ''
    }
  },
  components: {
    AddOrUpdate, ViewInfo
  },
  created: function () {
    this.getMouldTypeTreeList()
    // this.getMouldTypeList()
    this.getMouldList()
    this.getUnitList()
    // this.getSpecificationsList()
    this.getUserList()
  },
  methods: {
    // 所属部门树, 选中
    mouldTypeListTreeCurrentChangeHandle (data, node) {
      this.dataForm.typeId = data.id
      this.dataForm.typeName = data.name
      this.mouldTypeTreeListVisible = false
    },
    // 上级类型树, 设置默认值
    mouldTypeListTreeSetDefaultHandle () {
      this.dataForm.typeId = ''
      this.dataForm.typeName = ''
    },
    getMouldTypeTreeList () {
      this.$http.get(`/mould/mouldtype/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.mouldTypeTreeList = res.data
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
    getMouldList () {
      this.$http.get(`/mould/mould/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.mouldList = res.data
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
    getUserList () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
      }).catch(() => {})
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
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '350,45,0,6,2,2,N,模具编码: ' + row.code + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '160,200,0,6,2,2,N,模具名称：' + row.name + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '160,300,0,6,2,2,N,规格型号：' + row.specificationsName + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '160,400,0,6,2,2,N,模具分类：' + row.typeName + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawBar2D_QR': '730,230,350,350,0,7,2,0,0,' + `${window.SITE_CONFIG[ 'printURL3' ]}` + '/index/mould?id=' + row.id })
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
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '290,45,0,6,2,2,N,模具编码: ' + row.code + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '100,200,0,6,2,2,N,模具名称：' + row.name + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '100,300,0,6,2,2,N,规格型号：' + row.specificationsName + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawTextEx': '100,400,0,6,2,2,N,模具分类：' + row.typeName + ',0' })
      printparamsJsonArray.push({ 'PTK_DrawBar2D_QR': '670,230,350,350,0,7,2,0,0,' + `${window.SITE_CONFIG[ 'printURL3' ]}` + '/index/mould?id=' + row.id })
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
      printparamsJsonArray.push({ 'PTK_DrawBar2D_QR': '235,50,260,260,0,8,4,0,8,' + `${window.SITE_CONFIG[ 'printURL3' ]}` + '/index/mould?id=' + row.id })
      printparamsJsonArray.push({ 'PTK_RWRFIDLabel': '1,0,2,6,1,' + row.id + 'ABCCDEF03' })
      printparamsJsonArray.push({ 'PTK_PrintLabel': '1,1' })
      data.printparams = JSON.stringify(printparamsJsonArray)
      var url = 'http://127.0.0.1:888/postek/print'
      axios.post(url, qs.stringify(data), {
      }).then(response => {
        this.$message('打印二维码成功')
      }).catch(response => {
        this.$message('打印二维码失败')
      })
    },
    getRowKeys (row) {
      return row.id
    }
  }
}
</script>
