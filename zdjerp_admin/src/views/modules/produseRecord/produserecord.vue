<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-produseRecord__produserecord}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.documentNumber" placeholder="单据编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.realName" placeholder="制单人" clearable></el-input>
        </el-form-item>
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
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
          <el-table-column header-align="center" align="center" label="序号" width="60">
              <template slot-scope="scope"> {{scope.$index+1}} </template>
          </el-table-column>
        <el-table-column prop="documentNumber" label="单据编号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="materials" label="领料物品" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="quantity" label="数量" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="realName" label="制单人" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="documentDescription" label="单据说明" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="documentDate" label="单据日期" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column fixed="right" :label="$t('handle')" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('produseRecord:produserecord:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
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
import AddOrUpdate from './produserecord-add-or-update'
import ViewInfo from './produserecord-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/produseRecord/produserecord/page',
        getDataListIsPage: true,
        exportURL: '/produseRecord/produserecord/export',
        deleteURL: '/produseRecord/produserecord',
        deleteIsBatch: true
      },
      daterange: null,
      dataForm: {
        id: ''
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo
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
  }
}
</script>
