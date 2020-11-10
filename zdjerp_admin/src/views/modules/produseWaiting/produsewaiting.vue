<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-produseWaiting__produsewaiting}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 200px;">
        <el-input v-model="dataForm.documentNumber" placeholder="单据编号" clearable></el-input>
      </el-form-item>
        <el-form-item style="width: 200px;">
          <el-input v-model="dataForm.realName" placeholder="制单人" clearable></el-input>
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
          <el-button v-if="$hasPermission('produseWaiting:produsewaiting:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
<!--        <el-form-item>
          <el-button v-if="$hasPermission('produseWaiting:produsewaiting:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>-->
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
          <el-table-column header-align="center" align="center" label="序号" width="60">
              <template slot-scope="scope"> {{scope.$index+1}} </template>
          </el-table-column>
        <el-table-column prop="documentNumber" label="单据编号" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="outType" label="出库类型" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.outType === 0">生产领料</div>
            <div v-if="scope.row.outType === 1">其他</div>
          </template>
        </el-table-column>
        <el-table-column prop="materials" label="领料信息" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="realName" label="制单人" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="totalNumber" label="出库数量" show-overflow-tooltip  header-align="center" align="center"></el-table-column>
        <el-table-column prop="status" label="出库状态" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.reviewStatus === 1" size="small" type="success">已完成</el-tag>
            <el-tag v-if="scope.row.reviewStatus === 2" size="small" type="warning">部分完成</el-tag>
            <el-tag v-if="scope.row.reviewStatus === 0" size="small" type="danger">未完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="documentDescription"  show-overflow-tooltip label="单据说明" header-align="center" align="center"></el-table-column>
        <el-table-column prop="documentDate" label="单据日期" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('produseWaiting:produsewaiting:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('produseWaiting:produsewaiting:update') && scope.row.reviewStatus === 0" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button v-if="$hasPermission('produseWaiting:produsewaiting:delete') && scope.row.reviewStatus === 0" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
            <el-button v-if="$hasPermission('produseWaiting:produsewaiting:produsewaitingOut') && scope.row.reviewStatus !== 1" type="text" size="small" @click="produsewaitingOutHandle(scope.row.id)">出库</el-button>
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
      <produsewaiting-out v-if="produsewaitingOutVisible" ref="produsewaitingOut" @refreshDataList="getDataList"></produsewaiting-out>
      <!-- 弹窗, 查看 -->
      <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './produsewaiting-add-or-update'
import ProdusewaitingOut from './produsewaiting-out'
import ViewInfo from './produsewaiting-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      produsewaitingOutVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/produseWaiting/produsewaiting/page',
        getDataListIsPage: true,
        exportURL: '/produseWaiting/produsewaiting/export',
        deleteURL: '/produseWaiting/produsewaiting',
        deleteIsBatch: true
      },
      daterange: null,
      dataForm: {
        id: '',
        startDate: '',
        endDate: '',
        status: 2
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo, ProdusewaitingOut
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
    produsewaitingOutHandle (id) {
      this.produsewaitingOutVisible = true
      this.$nextTick(() => {
        this.$refs.produsewaitingOut.dataForm.id = id
        this.$refs.produsewaitingOut.init()
      })
    }
  }
}
</script>
