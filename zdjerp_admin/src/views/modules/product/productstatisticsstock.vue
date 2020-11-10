<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-product__productstock}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.projectName" placeholder="项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="typeId" label="产成品类型" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="type in productTypeList">
              <template v-if="type.id === scope.row.typeId">{{type.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="系统编码" show-overflow-tooltip header-align="center" align="center" width="240px"></el-table-column>
        <el-table-column prop="componentSeries" label="构件系列" show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>
        <el-table-column prop="componentName" label="构件名称" show-overflow-tooltip header-align="center" align="center" width="150px"></el-table-column>
        <el-table-column prop="mnemonicCode" label="助记码" show-overflow-tooltip header-align="center" align="center" width="100px"></el-table-column>
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
        <el-table-column prop="quantity" label="数量" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="standardDrawingNo" label="标准图号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="concreteStrengthGrade" label="混凝土强度等级" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="concreteStrengthGradeDict in concreteStrengthGradeDictList">
              <template v-if="concreteStrengthGradeDict.id === scope.row.concreteStrengthGrade">{{concreteStrengthGradeDict.grade}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="batch" label="批次" show-overflow-tooltip header-align="center" align="center" width="100px"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('product:productstock:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
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
import ViewInfo from './productstock-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/product/productstock/page',
        getDataListIsPage: true,
        exportURL: '/product/product/export',
        deleteURL: '/product/product',
        deleteIsBatch: true
      },
      productTypeTreeListVisible: false,
      productTypeTreeList: [],
      productTypeList: [],
      unitList: [],
      useSiteDictList: [],
      concreteStrengthGradeDictList: [],
      qualityInspectionDictList: [],
      visualInspectionDictList: [],
      userList: [],
      dataForm: {
        id: '',
        productTypeName: '',
        productTypeId: '',
        productId: '',
        componentSeries: '',
        leaveFactoryStatus: 0
      }
    }
  },
  created () {
    this.getProductTypeTreeList()
    this.getProductTypeList()
    this.getUnitList()
    this.getUseSiteDictList()
    this.getConcreteStrengthGradeDictList()
    this.getQualityInspectionDictList()
    this.getVisualInspectionDictList()
    this.getUserList()
  },
  components: {
    ViewInfo
  },
  activated () {
    if (this.dataForm.componentSeries === '') {
      this.dataForm.componentSeries = this.$route.params.componentSeries || ''
      if (this.dataForm.componentSeries !== '') {
        this.mixinViewModuleOptions.getDataListURL = '/product/productstock/page'
        this.mixinViewModuleOptions.getDataListIsPage = true
      }
    }
    this.getDataList()
  },
  methods: {
    // 库房
    productTypeListTreeCurrentChangeHandle (data, node) {
      this.dataForm.productTypeId = data.id
      this.dataForm.productTypeName = data.name
      this.productTypeTreeListVisible = false
    },
    productTypeListTreeSetDefaultHandle () {
      this.dataForm.productTypeId = ''
      this.dataForm.productTypeName = ''
    },
    getProductTypeTreeList () {
      this.$http.get(`/product/producttype/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.productTypeTreeList = res.data
      }).catch(() => {
      })
    },
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
    }
  }
}
</script>
