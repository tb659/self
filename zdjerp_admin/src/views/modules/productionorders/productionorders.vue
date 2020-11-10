<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-productionorders__productionorders}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
<!--        <el-form-item>
          <el-input v-model="dataForm.contractNo" placeholder="合同编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号" clearable></el-input>
        </el-form-item>-->
        <el-form-item style="width: 32%">
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
          <el-button v-show="false" v-if="$hasPermission('productionorders:productionorders:save')" type="primary" @click="update()">{{ $t('add') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
          <el-table-column header-align="center" align="center" label="序号" width="60">
              <template slot-scope="scope"> {{scope.$index+1}} </template>
          </el-table-column>
<!--        <el-table-column prop="contractNo" label="合同编号" header-align="center" align="center" show-overflow-tooltip width="180"></el-table-column>
        <el-table-column prop="documentNumber" label="单据编号" header-align="center" align="center" show-overflow-tooltip width="180"></el-table-column>-->
        <el-table-column prop="documentDate" label="单据日期" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="projectName" label="项目名称" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="totalNumber" label="总数量" header-align="center" align="center" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column prop="reviewStatus" label="审核状态" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.reviewStatus === 0" type="danger" size="mini">未提交</el-tag>
            <el-tag v-if="scope.row.reviewStatus === 1" type="success" size="mini">已通过</el-tag>
            <el-tag v-if="scope.row.reviewStatus === 2" type="primary" size="mini">审核中</el-tag>
            <el-tag v-if="scope.row.reviewStatus === 3" type="warning" size="mini">驳回</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pickingStatus" label="领料状态" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pickingStatus === 0" type="danger" size="mini">未领料</el-tag>
            <el-tag v-if="scope.row.pickingStatus === 1" type="success" size="mini">已申请领料</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="preProductionStatus" label="工序设置状态" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.preProductionStatus === 0" type="danger" size="mini">未设置</el-tag>
            <el-tag v-if="scope.row.preProductionStatus === 1" type="success" size="mini">已设置</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="inNumber" label="已入库数量" header-align="center" align="center" show-overflow-tooltip width="110"></el-table-column>
        <el-table-column prop="status" label="入库状态" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.inNumber === 0" type="danger" size="mini">待入库</el-tag>
            <el-tag v-if="scope.row.inNumber < scope.row.totalNumber && scope.row.inNumber !== 0" type="warning" size="mini">入库中</el-tag>
            <el-tag v-if="scope.row.inNumber === scope.row.totalNumber && scope.row.totalNumber !==0" type="success" size="mini">已入库</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="documentDescription" label="单据说明" header-align="center" align="center" show-overflow-tooltip width="300"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('productionorders:productionorders:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('productionorders:productionorders:update') && scope.row.pickingStatus === 0 && (scope.row.reviewStatus === 0 || scope.row.reviewStatus === 3)" type="text" size="small" @click="update(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('productionorders:productionorders:record:page')" type="text" size="small" @click="historyHandle(scope.row.id)">历史修改</el-button>
            <el-button v-if="$hasPermission('productionorders:productionorders:update') && scope.row.pickingStatus === 0 && (scope.row.reviewStatus === 0 || scope.row.reviewStatus === 3)" type="text" size="small" @click="review(scope.row.id)">提交审核</el-button>
            <el-button v-if="$hasPermission('salesRequisition:salesrequisition:save') && scope.row.pickingStatus === 0 && scope.row.reviewStatus === 1" type="text" size="small" @click="produseHandle(scope.row.id)">申请领料</el-button>
            <el-button v-if="scope.row.pickingStatus === 1 && scope.row.reviewStatus === 1" type="text" size="small" @click="procedureHandle(scope.row)">工序设置</el-button>
            <el-button v-if="$hasPermission('productionorders:productionorders:update') && scope.row.preProductionStatus === 1 && scope.row.inNumber !== scope.row.totalNumber && scope.row.reviewStatus === 1" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">入库</el-button>
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
      <!-- 弹窗，生产领料申请 -->
      <produse-add-or-update v-if="produseAddOrUpdateVisible" ref="produseAddOrUpdate" @refreshDataList="getDataList"></produse-add-or-update>
      <!-- 修改数量 -->
      <update v-if="updateVisible" ref="update" @refreshDataList="getDataList"></update>
      <!-- 历史修改 -->
      <history v-if="historyVisible" ref="produseAddOrHistory" @refreshDataList="getDataList"/>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './productionorders-add-or-update'
import ViewInfo from './productionorders-view-info'
import ProduseAddOrUpdate from '../produse/produse-add-or-update'
import Update from './productionorders-update'
import History from './productionorders-history'
import { moduleRoutes } from '@/router'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      produseAddOrUpdateVisible: false,
      updateVisible: false,
      historyVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/productionorders/productionorders/page',
        getDataListIsPage: true,
        exportURL: '/productionorders/productionorders/export',
        deleteURL: '/productionorders/productionorders',
        deleteIsBatch: true
      },
      daterange: null,
      dataForm: {
        id: '',
        contractNo: '',
        documentNumber: '',
        startDate: '',
        endDate: '',
        reviewStatus: ''
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo, ProduseAddOrUpdate, Update, History
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
    historyHandle (id) {
      this.historyVisible = true
      this.$nextTick(() => {
        this.$refs.produseAddOrHistory.dataForm.productionOrdersId = id
        this.$refs.produseAddOrHistory.init()
      })
    },
    produseHandle (id) {
      this.produseAddOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.produseAddOrUpdate.dataForm.productionOrdersId = id
        this.$refs.produseAddOrUpdate.init()
      })
    },
    update (id) {
      this.updateVisible = true
      this.$nextTick(() => {
        this.$refs.update.dataForm.id = id
        this.$refs.update.init()
      })
    },
    review (id) {
      this.$http.post(`/productionorders/productionorders/pass`, {
        id: id,
        reviewStatus: 2
      }).then(({ data: res }) => {
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
    },
    procedureHandle (row) {
      // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
      var routeName = `${this.$route.name}__${row.id}`
      var route = window.SITE_CONFIG['dynamicRoutes'].filter(item => item.name === routeName)[0]
      if (route) {
        return this.$router.push({ name: routeName, params: { 'id': row.id } })
      }
      // 否则: 添加并全局变量保存, 再跳转
      route = {
        path: routeName,
        component: () => import(`@/views/modules/productionorders/productionordersdetail`),
        name: routeName,
        meta: {
          ...window.SITE_CONFIG['contentTabDefault'],
          menuId: this.$route.meta.menuId,
          title: `${this.$route.meta.title} - 工序设置`
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
      this.$router.push({ name: route.name, params: { 'id': row.id } })
    }
  }
}
</script>
