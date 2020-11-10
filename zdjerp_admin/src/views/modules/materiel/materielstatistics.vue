<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-materiel__materiel}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 180px">
          <el-input v-model="dataForm.code" placeholder="物料编码" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-input v-model="dataForm.name" placeholder="物料名称" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-input v-model="dataForm.specificationType" placeholder="规格型号" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 180px">
          <el-input v-model="dataForm.unitName" placeholder="单位" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('materiel:materielStatistics:exportMaterialStatistics')" type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" border show-summary :summary-method="getSummaries" :data="dataList"  @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
            <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="code" label="物料编码" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="name" label="物料名称" header-align="center" align="center" width="120"></el-table-column>
        <el-table-column prop="unitName" label="单位" header-align="center" align="center"></el-table-column>
        <el-table-column prop="specificationType" label="规格型号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="allQuantity" label="库存数量" header-align="center" show-overflow-tooltip align="center" width="200"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('materiel:materiel:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
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
import ViewInfo from './materielstock-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/materiel/materielStatistics/page',
        getDataListIsPage: true,
        exportURL: '/materiel/materielStatistics/exportMaterialStatistics'
      },
      dataForm: {
        id: ''
      }
    }
  },
  components: {
    ViewInfo
  },
  methods: {
    // 统计
    getSummaries (param) {
      const { columns, data } = param
      this.sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          this.sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        let num = [5]
        if (num.indexOf(index) > -1) {
          this.sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          this.sums[index] = this.sums[index]
        }
      })
      return this.sums
    }
  }
}
</script>
