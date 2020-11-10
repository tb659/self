<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-preproduction__preproductioninformation}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 190px">
          <el-popover v-model="componentTypeListVisible" ref="componentTypeListPopover" placement="bottom-start" trigger="click">
            <el-tree
              :data="componentTypeTreeList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="componentTypeListTree"
              :highlight-current="true"
              :expand-on-click-node="false"
              accordion
              @current-change="componentTypeListTreeCurrentChangeHandle">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.typeName" v-popover:componentTypeListPopover  placeholder="构件类型">
            <i
              v-if="dataForm.typeId !== ''"
              slot="suffix"
              @click.stop="componentTypeListTreeSetDefaultHandle()"
              class="el-icon-circle-close el-input__icon">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-input v-model="dataForm.systemCoding" placeholder="系统编码" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-input v-model="dataForm.componentSeries" placeholder="构件系列" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-input v-model="dataForm.componentName" placeholder="构件名称" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-input v-model="dataForm.productName" placeholder="项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-select v-model="dataForm.concreteStrengthGrade" filterable clearable placeholder="混凝土强度等级" style="width: 100%;">
            <el-option
              v-for="item in concreteStrengthGradeDictList"
              :key="item.id"
              :label="item.grade"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-select v-model="dataForm.useSite" filterable clearable placeholder="适用部位" style="width: 100%;">
            <el-option
              v-for="item in useSiteDictList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 32%">
          <el-date-picker
            v-model="daterange"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="componentType" label="构件类型" header-align="center" align="center" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <template v-for="type in componentTypeList">
              <template v-if="type.id === scope.row.componentType">{{type.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="systemCoding" label="系统编码" header-align="center" align="center" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column prop="componentSeries" label="构件系列" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="componentName" label="构件名称" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="status" label="当前工序" header-align="center" align="center" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0">未生产</el-tag>
            <el-tag v-if="scope.row.status === 1">钢筋制安</el-tag>
            <el-tag v-if="scope.row.status === 2">钢筋终检</el-tag>
            <el-tag v-if="scope.row.status === 3">钢筋入模及模板验收</el-tag>
            <el-tag v-if="scope.row.status === 4">埋件验收</el-tag>
            <el-tag v-if="scope.row.status === 5">混凝土浇筑</el-tag>
            <el-tag v-if="scope.row.status === 6">拆模外观验收</el-tag>
            <el-tag v-if="scope.row.status === 7">成品入库</el-tag>
            <el-tag v-if="scope.row.status === 8">成品出库装车</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="printStatus" label="打印状态" header-align="center" align="center" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.printStatus === 0">未打印</el-tag>
            <el-tag type="success" v-if="scope.row.printStatus === 1">已打印</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="printingTimes" label="打印次数" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="standardDrawingNo" label="标注图号" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="outlineSize" label=" 外形尺寸" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="concreteStrengthGrade" label="混凝土强度等级" header-align="center" align="center" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <template v-for="concreteStrengthGradeDict in concreteStrengthGradeDictList">
              <template v-if="concreteStrengthGradeDict.id === scope.row.concreteStrengthGrade">{{concreteStrengthGradeDict.grade}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="重量" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="productName" label="项目名称" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="useSite" label="适用部位" header-align="center" align="center" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <template v-for="useSiteDict in useSiteDictList">
              <template v-if="useSiteDict.id === scope.row.useSite">{{useSiteDict.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="buildingNo" label="楼号" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="floorNo" label="层号" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="productionUnit" label="制作单位" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="createDate" label="录入时间" header-align="center" align="center" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('preproduction:preproductioninformation:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
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
import AddOrUpdate from './preproductioninformation-add-or-update'
import ViewInfo from './preproductioninformation-view-info'
import Cookies from 'js-cookie'
import axios from 'axios'
import qs from 'qs'
import { moduleRoutes } from '@/router'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/preproduction/preproductioninformation/page',
        getDataListIsPage: true,
        exportURL: '/preproduction/preproductioninformation/export',
        deleteURL: '/preproduction/preproductioninformation',
        deleteIsBatch: true
      },
      componentTypeListVisible: false,
      componentTypeTreeList: [],
      componentTypeList: [],
      unitList: [],
      concreteStrengthGradeDictList: [],
      useSiteDictList: [],
      userList: [],
      qualityInspectionDictList: [],
      visualInspectionDictList: [],
      importUrl: `${window.SITE_CONFIG['apiURL']}/preproduction/preproductioninformation/import?token=${Cookies.get('token')}`,
      dataForm: {
        id: '',
        typeId: '',
        typeName: '',
        startDate: '',
        endDate: '',
        status: 4,
        useSite: '',
        concreteStrengthGrade: '',
        productName: '',
        systemCoding: '',
        componentSeries: '',
        componentName: ''
      },
      daterange: null,
      printType: ''
    }
  },
  components: {
    AddOrUpdate, ViewInfo
  },
  watch: {
    daterange (val) {
      if (val != null) {
        this.dataForm.startDate = val[0]
        this.dataForm.endDate = val[1]
      } else {
        this.dataForm.startDate = ''
        this.dataForm.endDate = ''
      }
    }
  },
  created () {
    this.getComponentTypeTreeList()
    this.getComponentTypeList()
    // this.getUnitList()
    // this.getModelList()
    // this.getSpecificationsList()
    this.getUseSiteDictList()
    this.getConcreteStrengthGradeDictList()
    // this.getQualityInspectionDictList()
    // this.getVisualInspectionDictList()
    // this.getUserList()
  },
  methods: {
    // 上传之前
    beforeUploadHandle (file) {
      if (file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$message.error(this.$t('upload.tip', { 'format': 'xlsx、xls' }))
        return false
      }
      this.num++
      this.dataListLoading = true
      this.message = this.$message({
        message: '当前导入Excel数据量过大，时间可能过长，请耐心等候。。。',
        duration: 0
      })
    },
    // 上传成功
    successHandle (res, file, fileList) {
      if (res.code !== 0) {
        return this.$message.error(res.msg)
      }
      this.message.close()
      this.message = this.$message({
        message: res.data,
        type: 'success',
        duration: 2000,
        onClose: () => {
          this.dataListLoading = false
          this.getDataList()
        }
      })
    },
    getComponentTypeTreeList () {
      this.$http.get(`/product/producttype/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.componentTypeTreeList = res.data
      }).catch(() => {})
    },
    getComponentTypeList () {
      this.$http.get(`/product/producttype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.componentTypeList = res.data
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
    // 型号列表
    getModelList () {
      this.$http.get(`/basis/model/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.modelList = res.data
      }).catch(() => {})
    },
    // 适用部位
    getUseSiteDictList () {
      this.$http.get(`applyPosition/applyposition/list`, {
        params: { }
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
        params: { }
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
      }).catch(() => {})
    },
    // 上级类型树, 设置默认值
    componentTypeListTreeSetDefaultHandle () {
      this.dataForm.typeId = ''
      this.dataForm.typeName = ''
    },
    // 所属部门树, 选中
    componentTypeListTreeCurrentChangeHandle (data, node) {
      this.dataForm.typeId = data.id
      this.dataForm.typeName = data.name
      this.componentTypeListVisible = false
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
      printparamsJsonArray.push({ 'PTK_AnyGraphicsPrint': '160,0,103903660,C:\\logo.jpg,0,180,160,0' })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '350,45,50,0,\'微软雅黑\',1,600,0,0,0,ID: ' + row.systemCoding + '' })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '160,180,50,0,\'微软雅黑\',1,600,0,0,0,项目名称：' + row.productName + '' })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '160,255,50,0,\'微软雅黑\',1,600,0,0,0,构件名称：' + row.componentName + '' })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '160,330,50,0,\'微软雅黑\',1,600,0,0,0,外形尺寸：' + row.outlineSize + '' })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '160,405,50,0,\'微软雅黑\',1,600,0,0,0,重量：' + row.amount + '' })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '160,480,50,0,\'微软雅黑\',1,600,0,0,0,检验员盖章：' })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '160,590,40,0,\'微软雅黑\',1,500,0,0,0,' + row.productionUnit + '' })
      printparamsJsonArray.push({ 'PTK_DrawBar2D_QR': '730,390,120,120,0,6,2,0,0,' + `${window.SITE_CONFIG[ 'printURL2' ]}` + '/products/products?informationId=' + row.id })

      printparamsJsonArray.push({ 'PTK_PrintLabel': '1,1' })
      printparamsJsonArray.push({ 'ClosePort': '' })
      data.printparams = JSON.stringify(printparamsJsonArray)
      var url = 'http://127.0.0.1:888/postek/print'
      axios.post(url, qs.stringify(data), {
      }).then(response => {
        this.updateHandle(row, 1)
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
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '290,45,50,0,\'微软雅黑\',1,500,0,0,0,ID: ' + row.systemCoding + '' })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '100,180,50,0,\'微软雅黑\',1,500,0,0,0,项目名称：' + row.productName + '' })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '100,255,50,0,\'微软雅黑\',1,500,0,0,0,构件名称：' + row.componentName + '' })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '100,330,50,0,\'微软雅黑\',1,500,0,0,0,外形尺寸：' + row.outlineSize + '' })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '100,405,50,0,\'微软雅黑\',1,500,0,0,0,重量：' + row.amount + '' })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '100,480,50,0,\'微软雅黑\',1,500,0,0,0,检验员盖章：' })
      printparamsJsonArray.push({ 'PTK_DrawText_TrueType': '100,590,40,0,\'微软雅黑\',1,300,0,0,0,' + row.productionUnit + '' })
      printparamsJsonArray.push({ 'PTK_DrawBar2D_QR': '670,390,120,120,0,6,2,0,0,' + `${window.SITE_CONFIG[ 'printURL2' ]}` + '/products/products?informationId=' + row.id })
      printparamsJsonArray.push({ 'PTK_AnyGraphicsPrint': '100,0,103903660,C:\\logo.jpg,0,180,160,0' })

      printparamsJsonArray.push({ 'PTK_PrintLabel': '1,1' })
      printparamsJsonArray.push({ 'ClosePort': '' })
      data.printparams = JSON.stringify(printparamsJsonArray)
      var url = 'http://127.0.0.1:888/postek/print'
      axios.post(url, qs.stringify(data), {
      }).then(response => {
        this.updateHandle(row, 2)
      }).catch(response => {
        this.$message('打印失败')
      })
    },
    getRowKeys (row) {
      return row.id
    },
    updateHandle (row, printType) {
      this.$http.put(`/preproduction/preproductioninformation/`, {
        id: row.id,
        printStatus: 1
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$http.post('/printrecord/printrecord/', {
          printId: row.id,
          printType: printType
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: '打印成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.getDataList()
            }
          })
        }).catch(() => {})
      })
    },
    showPrintRecord (row) {
      // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
      var routeName = `${this.$route.name}__${row.id}`
      var route = window.SITE_CONFIG['dynamicRoutes'].filter(item => item.name === routeName)[0]
      if (route) {
        return this.$router.push({ name: routeName, params: { 'printId': row.id } })
      }
      // 否则: 添加并全局变量保存, 再跳转
      route = {
        path: routeName,
        component: () => import(`@/views/modules/printrecord/printrecord`),
        name: routeName,
        meta: {
          ...window.SITE_CONFIG['contentTabDefault'],
          menuId: this.$route.meta.menuId,
          title: row.componentName + ` - 打印记录`
        }
      }
      this.$router.addRoutes([
        {
          ...moduleRoutes,
          name: `main-dynamic__${route.name}`,
          children: [route]
        }
      ])
      window.SITE_CONFIG['dynamicRoutes'].push(route)
      this.$router.push({ name: route.name, params: { 'printId': row.id } })
    }
  }
}
</script>
