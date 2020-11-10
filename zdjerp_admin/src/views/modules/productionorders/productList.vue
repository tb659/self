<template>
  <el-dialog :visible.sync="visible" title="产成品列表" :close-on-click-modal="false" :append-to-body="true" width="70%" :close-on-press-escape="false">
    <el-card shadow="never" class="aui-card--fill">
      <div class="mod-laboratory__laboratorystock}">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.name" placeholder="编码/系列/名称/助记码" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">{{ $t('query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="selectHandle()">确定</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="multipleTable" v-loading="dataListLoading" :row-key="getRowKeys" stripe :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50" :reserve-selection="true"></el-table-column>
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
          <el-table-column prop="code" label="系统编码" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="componentSeries" label="系列" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="componentName" label="名称" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="mnemonicCode" label="助记码" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="unit" label="单位" header-align="center" align="center">
            <template slot-scope="scope">
              <template v-for="unit in unitList">
                <template v-if="unit.id === scope.row.unit">{{unit.name}}</template>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" header-align="center" align="center" fit></el-table-column>
          <el-table-column prop="useSite" label="适用部位" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <template v-for="useSiteDict in useSiteDictList">
                <template v-if="useSiteDict.id === scope.row.useSite">{{useSiteDict.name}}</template>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="outlineSize" label="外形尺寸" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="standardDrawingNo" label="标准图号" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="concreteStrengthGrade" label="混凝土强度等级" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <template v-for="concreteStrengthGradeDict in concreteStrengthGradeDictList">
                <template v-if="concreteStrengthGradeDict.id === scope.row.concreteStrengthGrade">{{concreteStrengthGradeDict.grade}}</template>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" header-align="center" align="center" width="150"></el-table-column>
        </el-table>
        <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="limit"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageSizeChangeHandle"
          @current-change="pageCurrentChangeHandle"
          style="margin-top:15px;text-align:right;">
        </el-pagination>
      </div>
    </el-card>
  </el-dialog>
</template>
<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      visible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/product/product/page',
        getDataListIsPage: true,
        exportURL: '/product/product/export',
        deleteURL: '/product/product',
        deleteIsBatch: true
      },
      productTypeList: [],
      unitList: [],
      modelList: [],
      specificationsList: [],
      useSiteDictList: [],
      concreteStrengthGradeDictList: [],
      qualityInspectionDictList: [],
      visualInspectionDictList: [],
      userList: [],
      dataForm: {
        id: '',
        name: '',
        codeList: ''
      },
      productList: []
    }
  },
  created () {
    this.getProductTypeList()
    this.getUnitList()
    this.getModelList()
    this.getSpecificationsList()
    this.getUseSiteDictList()
    this.getConcreteStrengthGradeDictList()
  },
  methods: {
    init () {
      this.visible = true
      // this.getCodeList()
      this.$nextTick(() => {
        this.getDataList()
      })
      this.$refs.multipleTable.clearSelection()
    },
    getProductTypeList () {
      this.$http.get(`/product/producttype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.productTypeList = res.data
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
        params: {}
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
        params: {}
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.concreteStrengthGradeDictList = res.data
      }).catch(() => {
      })
    },
    getCodeList () {
      if (this.productList) {
        var list = []
        for (var i = 0; i < this.productList.length; i++) {
          list.push(this.productList[i].productCoding)
        }
        this.dataForm.codeList = list.toString()
      }
    },
    // 选择的信息
    selectHandle () {
      if (this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('请选择要操作的项！'),
          type: 'warning',
          duration: 500
        })
      }
      this.visible = false
      this.$emit('refreshDataList', this.dataListSelections)
    },
    getRowKeys (row) {
      return row.id
    }
  }
}
</script>
