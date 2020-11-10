<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-product__productstockStatistics}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width:200px">
          <el-input v-model="dataForm.code" placeholder="编码" clearable></el-input>
        </el-form-item>
        <el-form-item style="width:200px">
          <el-input v-model="dataForm.componentSeries" placeholder="构件系列" clearable></el-input>
        </el-form-item>
        <el-form-item style="width:200px">
          <el-input v-model="dataForm.componentName" placeholder="构件名称" clearable></el-input>
        </el-form-item>
        <el-form-item style="width:200px">
          <el-input v-model="dataForm.mnemonicCode" placeholder="助记码" clearable></el-input>
        </el-form-item>
        <el-form-item style="width:200px">
          <el-select v-model="dataForm.typeId" filterable clearable placeholder="产成品类型" style="width: 100%;">
            <el-option
              v-for="item in productTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width:32%">
          <el-date-picker
            v-model="daterange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="生产开始日期"
            end-placeholder="生产结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width:32%">
          <el-date-picker
            v-model="daterangewarehousing"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="入库开始日期"
            end-placeholder="入库结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" show-summary :summary-method="getSummaries" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <!--<el-table-column prop="code" label="系统编码" show-overflow-tooltip header-align="center" align="center" width="240px"></el-table-column>-->
        <el-table-column prop="componentSeries" label="构件系列" show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>
        <el-table-column prop="componentName" label="构件名称" show-overflow-tooltip header-align="center" align="center"  width="150px"></el-table-column>
        <el-table-column prop="mnemonicCode" label="助记码" show-overflow-tooltip header-align="center" align="center"  width="150px"></el-table-column>
        <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip header-align="center" align="center"  width="150px"></el-table-column>
        <el-table-column prop="stockQuantity" label="数量" show-overflow-tooltip header-align="center" align="center"  width="150px"></el-table-column>
        <el-table-column prop="typeId" label="产成品类型" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="type in productTypeList">
              <template v-if="type.id === scope.row.typeId">{{type.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="standardDrawingNo" label="标准图号" show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>
        <el-table-column prop="unit" label="单位" header-align="center" align="center">
          <template slot-scope="scope">
            <template v-for="unit in unitList">
              <template v-if="unit.id === scope.row.unit">{{unit.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="useSite" label="适用部位" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="useSiteDict in useSiteDictList">
              <template v-if="useSiteDict.id === scope.row.useSite">{{useSiteDict.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="outlineSize" label="外形尺寸" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="concreteStrengthGrade" label="混凝土强度等级" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="concreteStrengthGradeDict in concreteStrengthGradeDictList">
              <template v-if="concreteStrengthGradeDict.id === scope.row.concreteStrengthGrade">{{concreteStrengthGradeDict.grade}}</template>
            </template>
          </template>
        </el-table-column>
        <!--<el-table-column prop="batch" label="批次" show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>-->
        <!--<el-table-column prop="castingDate" label="浇筑日期" show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>-->
        <!--<el-table-column prop="productionDate" label="生产日期" show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>-->
        <!--<el-table-column prop="warehousingDate" label="生产日期" show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>-->
        <!--<el-table-column prop="visualInspection" label="外观检验" show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>-->
        <!--<el-table-column prop="productionManager" label="生产负责人" header-align="center" align="center" width="100">-->
          <!--<template slot-scope="scope">-->
            <!--<template v-for="user in userList">-->
              <!--<template v-if="user.id === scope.row.productionManager">{{user.realName}}</template>-->
            <!--</template>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="qualityInspector" label="质检员" header-align="center" align="center" width="100">-->
          <!--<template slot-scope="scope">-->
            <!--<template v-for="user in userList">-->
              <!--<template v-if="user.id === scope.row.qualityInspector">{{user.realName}}</template>-->
            <!--</template>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="experimenter" label="实验员" header-align="center" align="center" width="100">-->
          <!--<template slot-scope="scope">-->
            <!--<template v-for="user in userList">-->
              <!--<template v-if="user.id === scope.row.experimenter">{{user.realName}}</template>-->
            <!--</template>-->
          <!--</template>-->
        <!--</el-table-column>-->
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
        getDataListURL: '/product/productStockStatistics/page',
        getDataListIsPage: 'true'
      },
      productTypeList: [],
      unitList: [],
      useSiteDictList: [],
      concreteStrengthGradeDictList: [],
      qualityInspectionDictList: [],
      visualInspectionDictList: [],
      userList: [],
      daterange: null,
      daterangewarehousing: null,
      dataForm: {
        id: '',
        startDate: '',
        endDate: '',
        endWarehousingDate: '',
        startWarehousingDate: ''
      }
    }
  },
  created () {
    this.getProductTypeList()
    this.getUnitList()
    this.getUseSiteDictList()
    this.getConcreteStrengthGradeDictList()
    this.getQualityInspectionDictList()
    this.getVisualInspectionDictList()
    this.getUserList()
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
    },
    daterangewarehousing (val) {
      if (val != null) {
        this.dataForm.startWarehousingDate = val[0] + ' 00:00:00'
        this.dataForm.endWarehousingDate = val[1] + ' 23:59:59'
      } else {
        this.dataForm.startWarehousingDate = ''
        this.dataForm.endWarehousingDate = ''
      }
    }
  },
  methods: {
    getProductTypeList () {
      this.$http.get(`/product/producttype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.productTypeList = res.data
      }).catch(() => {
      })
    },
    // 单位列表
    getUnitList () {
      this.$http.get(`/articleUnit/articleunit/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.unitList = res.data
      }).catch(() => {
      })
    },
    // 适用部位
    getUseSiteDictList () {
      this.$http.get(`applyPosition/applyposition/list`, {
        params: { dictType: 'sybw' }
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
        params: { dictType: 'hntqddj' }
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
      }).catch(() => {
      })
    },
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
