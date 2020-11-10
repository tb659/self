<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-product__product}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-popover v-model="productTypeListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
            <el-tree
              :data="productTypeTreeList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="deptListTree"
              :highlight-current="true"
              :expand-on-click-node="false"
              accordion
              @current-change="productTypeListTreeCurrentChangeHandle">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.typeName" v-popover:deptListPopover  placeholder="产成品类型">
            <i
              v-if="dataForm.typeId !== ''"
              slot="suffix"
              @click.stop="productTypeListTreeSetDefaultHandle()"
              class="el-icon-circle-close el-input__icon">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="系列/名称/助记码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('product:productStockStatistics:exportProductStatistics')" type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" show-summary :summary-method="getSummaries" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
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
        <el-table-column prop="componentSeries" label="构件系列" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="componentName" label="构件名称" show-overflow-tooltip header-align="center" align="center" width="200"></el-table-column>
        <el-table-column prop="stockQuantity" label="数量" show-overflow-tooltip header-align="center" align="center" fit></el-table-column>
        <el-table-column prop="unit" label="单位" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <template v-for="unit in unitList">
              <template v-if="unit.id === scope.row.unit">{{unit.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="useSite" label="适用部位" show-overflow-tooltip header-align="center" align="center" width="150">
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
        <el-table-column prop="remark" label="备注" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('product:product:info')" type="text" size="small" @click="childHandle(scope.row)">查看</el-button>
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
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { moduleRoutes } from '@/router'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/product/productStockStatistics/queryProductStatistics',
        getDataListIsPage: true,
        exportURL: '/product/productStockStatistics/exportProductStatistics',
        deleteURL: '/product/product',
        deleteIsBatch: true
      },
      addOrUpdateTypeVisible: false,
      productTypeListVisible: false,
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
        name: '',
        typeId: '',
        typeName: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        pid: 'pid'
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
  methods: {
    getProductTypeTreeList () {
      this.$http.get(`/product/producttype/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.productTypeTreeList = res.data
      }).catch(() => {})
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
    // 适用部位
    getUseSiteDictList () {
      this.$http.get(`applyPosition/applyposition/list`, {
        params: { dictType: 'sybw' }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        console.log(res.data)
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
    getSummaries (param) {
      const { columns, data } = param
      this.sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          this.sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        let num = [4]
        if (num.indexOf(index) > -1) {
          this.sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        }
      })
      return this.sums
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
      }).catch(() => {})
    },
    // 上级类型树, 设置默认值
    productTypeListTreeSetDefaultHandle () {
      this.dataForm.typeId = ''
      this.dataForm.typeName = ''
    },
    // 所属部门树, 选中
    productTypeListTreeCurrentChangeHandle (data, node) {
      this.dataForm.typeId = data.id
      this.dataForm.typeName = data.name
      this.productTypeListVisible = false
    },
    // 子级
    childHandle (row) {
      // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
      var routeName = `${this.$route.name}__${row.id}`
      var route = window.SITE_CONFIG['dynamicRoutes'].filter(item => item.name === routeName)[0]
      if (route) {
        return this.$router.push({ name: routeName, params: { 'componentSeries': row.componentSeries } })
      }
      // 否则: 添加并全局变量保存, 再跳转
      route = {
        path: routeName,
        component: () => import(`@/views/modules/product/productstatisticsstock`),
        name: routeName,
        meta: {
          ...window.SITE_CONFIG['contentTabDefault'],
          menuId: this.$route.meta.menuId,
          title: `${this.$route.meta.title} - ${row.componentName}`
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
      this.$router.push({ name: route.name, params: { 'componentSeries': row.componentSeries } })
    }
  }
}
</script>
