<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__purchasewarehousing}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
<!--        <el-form-item style="width: 190px;">
          <el-input v-model="dataForm.contractNo" placeholder="合同编号" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号" clearable></el-input>
        </el-form-item>-->
        <el-form-item style="width: 190px;">
          <el-select v-model="dataForm.supplierName" clearable placeholder="供应商" style="width: 100%;">
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.supplierName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-input v-model="dataForm.contactInformation" placeholder="联系方式" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-input v-model="dataForm.preparedName" placeholder="制单人" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-select v-model="dataForm.purchaseTypeName" filterable clearable placeholder="采购类型" style="width: 100%;">
            <el-option
              v-for="item in purchaseTypeList"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 350px;">
          <el-date-picker
            v-model="daterange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="单据开始日期"
            end-placeholder="单据结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('purchase:purchasewarehousing:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('purchase:purchasewarehousing:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
 <!--       <el-table-column prop="contractNo" label="合同编号" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="documentNumber" label="单据编号" header-align="center" align="center" width="150"></el-table-column>-->
        <el-table-column prop="supplierName" label="供应商" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="preparedName" label="制单人" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="purchaseTypeName" label="采购类型" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="contactInformation" label="联系方式" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="status" label="待入库单状态" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '2'" size="small" type="success">已生成</el-tag>
            <el-tag v-else size="small" type="danger">未生成</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="documentDescription" label="单据说明" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="documentDate" label="单据日期" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('purchase:purchasewarehousing:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('purchase:purchasewarehousing:generateWaitingInStock') && scope.row.status === '1'" type="text" size="small" @click="generateWaitingInStock(scope.row.id)">生成入库单</el-button>
            <el-button v-if="$hasPermission('contract:contract:page')" type="text" size="small" @click="contractManage(scope.row)">合同管理</el-button>
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
      <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
      <!--附件上传-->
      <enclosure-file v-if="enclosureUrlVisible" ref="enclosureFile" @setEnclosureInfo="setEnclosureUrl"></enclosure-file>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './purchasewarehousing-add-or-update'
import ViewInfo from './purchasewarehousing-view-info'
import EnclosureFile from './purchasewarehousing-upload'
import { moduleRoutes } from '@/router'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      enclosureUrlVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/purchasewarehousing/purchasewarehousing/page',
        getDataListIsPage: true,
        exportURL: '/purchasewarehousing/purchasewarehousing/export',
        deleteURL: '/purchasewarehousing/purchasewarehousing',
        deleteIsBatch: true
      },
      daterange: null,
      supplierList: [],
      purchaseTypeList: [],
      dataForm: {
        id: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo, EnclosureFile
  },
  created () {
    this.getSupplierList()// 获取存放种类数据
    this.getPurchaseType()// 获取采购类型
  },
  watch: {
    daterange (val) {
      if (val != null) {
        this.dataForm.startDate = val[0] + ' 00:00:00'
        this.dataForm.endDate = val[1] + ' 23:59:59'
      } else {
        this.dataForm.startDate = ''
        this.dataForm.endDate = ''
      }
    }
  },
  methods: {
    // 查看
    viewInfoHandle (id) {
      this.viewInfoVisible = true
      this.$nextTick(() => {
        this.$refs.viewInfo.dataForm.id = id
        this.$refs.viewInfo.init()
      })
    },
    // 下载
    downloadHandle (row) {
      window.open(row.enclosureUrl)
    },
    // 获取文件的信息
    setEnclosureUrl (row) {
      this.dataListLoading = true
      this.$http.get(`/purchasewarehousing/purchasewarehousing/contract/` + row.get('id')).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$http.put('/purchasewarehousing/purchasewarehousing', {
          'id': row.get('id'),
          'enclosureUrl': row.get('src')
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.dataListLoading = false
              this.getDataList()
            }
          })
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    // 供应商列表
    getSupplierList: function () {
      this.$http.get(`/supplier/supplier/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.supplierList = res.data
      }).catch(() => {
      })
    },
    // 获取采购类型列表
    getPurchaseType () {
      this.$http.get(`sys/dict/dictList`, {
        params: { dictType: 'purchaseType' }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.purchaseTypeList = res.data
      }).catch(() => {
      })
    },
    contractHandle (id) {
      this.enclosureUrlVisible = true
      this.$nextTick(() => {
        this.$refs.enclosureFile.id = id
        this.$refs.enclosureFile.init()
      })
    },
    generateWaitingInStock (id) {
      this.$confirm(this.$t('prompt.info', { 'handle': '生成入库单' }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.get(`/purchasewarehousing/purchasewarehousing/generateWaitingInStock/` + id).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 500
          })
          this.getDataList()
        }).catch(() => {
        })
      }).catch(() => {})
    },
    contractManage (row) {
      // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
      var routeName = `${this.$route.name}__${row.id}`
      var route = window.SITE_CONFIG['dynamicRoutes'].filter(item => item.name === routeName)[0]
      if (route) {
        return this.$router.push({ name: routeName, params: { 'orderId': row.id, 'type': 2 } })
      }
      // 否则: 添加并全局变量保存, 再跳转
      route = {
        path: routeName,
        component: () => import(`@/views/modules/contract/contract`),
        name: routeName,
        meta: {
          ...window.SITE_CONFIG['contentTabDefault'],
          menuId: this.$route.meta.menuId,
          title: `采购订单合同管理`
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
      this.$router.push({ name: route.name, params: { 'orderId': row.id, 'type': 2 } })
    }
  }

}
</script>
