<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-laboratory__laboratorycalibration}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-date-picker
            v-model="datetime"
            type="daterange"
            range-separator="至"
            start-placeholder="校准开始日期"
            end-placeholder="校准结束日期" value-format="yyyy-MM-dd" @change="handleChange" >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.calibrator" placeholder="校准人" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.laboratoryName" placeholder="设备名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.code" placeholder="校准编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('laboratory:laboratorycalibration:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="index"  label="序号" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="code" label="校准编号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="laboratoryCode" label="设备编码" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="laboratoryName" label="设备名称" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="calibrator" label="校准人" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="handler" label="经手人" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="calibrationDate" label="校准日期" show-overflow-tooltip header-align="center" align="center"></el-table-column>
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
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './laboratorycalibration-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      datetime: [],
      mixinViewModuleOptions: {
        getDataListURL: '/laboratory/laboratorycalibration/page',
        getDataListIsPage: true,
        exportURL: '/laboratory/laboratorycalibration/export',
        deleteURL: '/laboratory/laboratorycalibration',
        deleteIsBatch: true
      },
      dataForm: {
        id: '',
        startTime: '',
        endTime: '',
        calibrator: '',
        laboratoryName: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
  // 绑定开始时间结束时间
    handleChange (value) {
      if (value != null) {
        this.dataForm.startTime = this.datetime[0]
        this.dataForm.endTime = this.datetime[1]
      } else {
        this.dataForm.startTime = ''
        this.dataForm.endTime = ''
      }
    }
  }
}
</script>
