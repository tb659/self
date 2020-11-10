<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-salesWaiting__salesoutstatistics}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.materialName" placeholder="构件名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.materialSeries" placeholder="构件系列" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.projectName" placeholder="项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="daterange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="出库开始日期"
            end-placeholder="出库结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="materialName" label="构件名称" header-align="center" align="center" show-overflow-tooltip width="180px"></el-table-column>
        <el-table-column prop="materialSeries" label="构件系列" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="specificationType" label="规格型号" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="projectName" label="项目名称" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="quantity" label="数量" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
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
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/salesReceipt/salesreceiptstatistics/page',
        getDataListIsPage: true
      },
      daterange: null,
      dataForm: {
        id: '',
        startDate: '',
        endDate: ''
      },
      customInfoList: []
    }
  },
  created () {
    this.getCustomInfoList()
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
  }
}
</script>
