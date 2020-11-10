<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-preproduction__preproductioninformation}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
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
          <el-select v-model="dataForm.grade" filterable clearable placeholder="混凝土强度等级" style="width: 100%;">
            <el-option
              v-for="item in concreteStrengthGradeDictList"
              :key="item.id"
              :label="item.grade"
              :value="item.grade">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-select v-model="dataForm.useSiteId" filterable clearable placeholder="适用部位" style="width: 100%;">
            <el-option
              v-for="item in useSiteDictList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="width: 190px">
          <el-select v-model="dataForm.unqualifiedType" filterable clearable placeholder="状态" style="width: 100%;">
            <el-option
              v-for="item in unqualified"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
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
        <el-table-column prop="systemCoding" label="系统编码" header-align="center" align="center" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column prop="componentSeries" label="构件系列" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="componentName" label="构件名称" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>

        <el-table-column prop="productName" label="项目名称" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="useSite" label="适用部位" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="standardDrawingNo" label="标注图号" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="outlineSize" label=" 外形尺寸" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="grade" label="混凝土强度等级" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>

        <el-table-column prop="productionDate" label="生产日期" header-align="center" align="center" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column prop="status" label="不合格原因" header-align="center" align="center" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <el-tag type="danger">{{scope.row.unqualifiedType}}</el-tag>
          </template>
        </el-table-column>
         <el-table-column prop="status" label="当前工序" header-align="center" align="center" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <el-tag>{{scope.row.processName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('preproduction:nonconforming:info')" type="text" size="small" @click="viewInfoHandle(scope.row.unqualifiedId, scope.row.unqualifiedType)">查看</el-button>
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
      <view-info v-if="viewInfoVisible" @pictures="pictures" ref="viewInfo"></view-info>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import ViewInfo from './nonconforming-info'
import Cookies from 'js-cookie'
import axios from 'axios'
import qs from 'qs'
import { moduleRoutes } from '@/router'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/preproduction/nonconforming/page',
        getDataListIsPage: true
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
        startTime: '',
        endTime: '',
        useSiteId: '',
        grade: '',
        productName: '',
        systemCoding: '',
        componentSeries: '',
        componentName: '',
        unqualifiedType: ''
      },
      daterange: null,
      printType: '',
      unqualified: [{
        label: '返工返修',
        value: 1
      }, {
        label: '报废',
        value: 3
      }]
    }
  },
  components: {
    ViewInfo
  },
  watch: {
    daterange (val) {
      if (val != null) {
        this.dataForm.startTime = val[0]
        this.dataForm.endTime = val[1]
      } else {
        this.dataForm.startTime = ''
        this.dataForm.endTime = ''
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
    pictures (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    // 查看
    viewInfoHandle (id, type) {
      this.viewInfoVisible = true
      this.$nextTick(() => {
        this.$refs.viewInfo.dataForm.id = id
        this.$refs.viewInfo.type = type
        this.$refs.viewInfo.init()
      })
    },
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
