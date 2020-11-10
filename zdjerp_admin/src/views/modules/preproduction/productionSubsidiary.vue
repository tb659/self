<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-preproduction__preproductioninformation}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 190px">
          <el-popover v-model="componentTypeListVisible" ref="componentTypeListPopover" placement="bottom-start" trigger="click">
            <el-tree
              :data="componentTypeTreeList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="componentTypeListTree"
              :highlight-current="true"
              :expand-on-click-node="false"
              accordion
              @current-change="componentTypeListTreeCurrentChangeHandle">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.typeName" v-popover:componentTypeListPopover  placeholder="构件类型">
            <i
              v-if="dataForm.componentType !== ''"
              slot="suffix"
              @click.stop="componentTypeListTreeSetDefaultHandle()"
              class="el-icon-circle-close el-input__icon">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-input v-model="dataForm.systemCoding" placeholder="系统编码" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-input v-model="dataForm.componentSeries" placeholder="构件系列" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-input v-model="dataForm.componentName" placeholder="构件名称" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-input v-model="dataForm.productName" placeholder="项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-select v-model="dataForm.concreteStrengthGrade" filterable clearable placeholder="混凝土强度等级" style="width: 100%;">
            <el-option
              v-for="item in concreteStrengthGradeDictList"
              :key="item.id"
              :label="item.grade"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 190px">
          <el-select v-model="dataForm.useSite" filterable clearable placeholder="适用部位" style="width: 100%;">
            <el-option
              v-for="item in useSiteDictList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
       <el-table v-loading="dataListLoading" :data="dataList"  border  style="width: 100%;">
            <el-table-column prop="productName" label="项目名称" header-align="center" align="center" show-overflow-tooltip min-width="150">

            </el-table-column>
            <el-table-column prop="unproducedNum" label="未生产" header-align="center" align="center" show-overflow-tooltip >
                <template slot-scope="scope">
                    <el-button v-if="$hasPermission('preproduction:productionSubsidiary:page')"
                    type="text" size="small"
                    @click="tabSubsidiary({
                        row: scope.row,
                        title: '未生产',
                        tab: 0
                    })">
                            {{scope.row.unproducedNum}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="rebarSecurityNum" label="钢筋治安" header-align="center" align="center" show-overflow-tooltip >
                <template slot-scope="scope">
                    <el-button v-if="$hasPermission('preproduction:productionSubsidiary:page')"
                    type="text" size="small"
                    @click="tabSubsidiary({
                        row: scope.row,
                        title: '钢筋治安',
                        tab: 1
                    })">
                            {{scope.row.rebarSecurityNum}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="rebarFinalInspectionNum" label="钢筋终检" header-align="center" align="center" show-overflow-tooltip >
                <template slot-scope="scope">
                    <el-button v-if="$hasPermission('preproduction:productionSubsidiary:page')"
                    type="text" size="small"
                    @click="tabSubsidiary({
                        row: scope.row,
                        title: '钢筋终检',
                        tab: 2
                    })">
                            {{scope.row.rebarFinalInspectionNum}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="rebarDieInAndModuleAcceptanceNum" label="钢筋入模及模板验收" header-align="center" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button v-if="$hasPermission('preproduction:productionSubsidiary:page')"
                    type="text" size="small"
                    @click="tabSubsidiary({
                        row: scope.row,
                        title: '钢筋入模及模板验收',
                        tab: 3
                    })">
                            {{scope.row.rebarDieInAndModuleAcceptanceNum}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="builtInPartsAcceptanceNum" label="埋件验收" header-align="center" align="center" show-overflow-tooltip >
                <template slot-scope="scope">
                    <el-button v-if="$hasPermission('preproduction:productionSubsidiary:page')"
                    type="text" size="small"
                    @click="tabSubsidiary({
                        row: scope.row,
                        title: '埋件验收',
                        tab: 4
                    })">
                            {{scope.row.builtInPartsAcceptanceNum}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="concretePouringNum" label="混凝土浇筑" header-align="center" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button v-if="$hasPermission('preproduction:productionSubsidiary:page')"
                    type="text" size="small"
                    @click="tabSubsidiary({
                        row: scope.row,
                        title: '混凝土浇筑',
                        tab: 5
                    })">
                            {{scope.row.concretePouringNum}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="appearanceAcceptanceNum" label="拆模外观验收" header-align="center" align="center" show-overflow-tooltip >
                <template slot-scope="scope">
                    <el-button v-if="$hasPermission('preproduction:productionSubsidiary:page')"
                    type="text" size="small"
                    @click="tabSubsidiary({
                        row: scope.row,
                        title: '拆模外观验收',
                        tab: 6
                    })">
                            {{scope.row.appearanceAcceptanceNum}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="productPutStockNum" label="成品入库" header-align="center" align="center" show-overflow-tooltip >
                <template slot-scope="scope">
                    <el-button v-if="$hasPermission('preproduction:productionSubsidiary:page')"
                    type="text" size="small"
                    @click="tabSubsidiary({
                        row: scope.row,
                        title: '成品入库',
                        tab: 7
                    })">
                            {{scope.row.productPutStockNum}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="productOutStockNum" label="成品出库装车" header-align="center" align="center" show-overflow-tooltip >
                <template slot-scope="scope">
                    <el-button v-if="$hasPermission('preproduction:productionSubsidiary:page')"
                    type="text" size="small"
                    @click="tabSubsidiary({
                        row: scope.row,
                        title: '成品出库装车',
                        tab: 8
                    })">
                            {{scope.row.productOutStockNum}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="productTotal" label="总计" header-align="center" align="center" show-overflow-tooltip></el-table-column>
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

      <el-dialog
      :title="title"
        :visible.sync="dialogVisible"
        width="80%">
        <template>
            <el-table v-loading="dataListLoading" :data="formationdataList"  border  style="width: 100%;">
                <el-table-column header-align="center" align="center" label="序号" width="60">
                    <template slot-scope="scope"> {{scope.$index+1}} </template>
                </el-table-column>
                <el-table-column prop="componentType" label="构件类型" header-align="center" align="center" show-overflow-tooltip min-width="150">
                <template slot-scope="scope">
                    <template v-for="type in componentTypeList">
                    <template v-if="type.id === scope.row.componentType">{{type.name}}</template>
                    </template>
                </template>
                </el-table-column>
                <el-table-column prop="systemCoding" label="系统编码" header-align="center" align="center" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="componentSeries" label="构件系列" header-align="center" align="center" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="componentName" label="构件名称" header-align="center" align="center" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="status" label="工序" header-align="center" align="center" show-overflow-tooltip min-width="150">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 0">未生产</el-tag>
                    <el-tag v-if="scope.row.status === 1">钢筋制安</el-tag>
                    <el-tag v-if="scope.row.status === 2">钢筋终检</el-tag>
                    <el-tag v-if="scope.row.status === 3">钢筋入模及模板验收</el-tag>
                    <el-tag v-if="scope.row.status === 4">埋件验收</el-tag>
                    <el-tag v-if="scope.row.status === 5">混凝土浇筑</el-tag>
                    <el-tag v-if="scope.row.status === 6">拆模外观验收</el-tag>
                    <el-tag v-if="scope.row.status === 7">成品入库</el-tag>
                    <el-tag v-if="scope.row.status === 8">成品出库装车</el-tag>
                </template>
                </el-table-column>
                <el-table-column prop="outlineSize" label=" 外形尺寸" header-align="center" align="center" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="standardDrawingNo" label="标注图号" header-align="center" align="center" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="productName" label="项目名称" header-align="center" align="center" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="concreteStrengthGrade" label="混凝土强度等级" header-align="center" align="center" show-overflow-tooltip min-width="150">
                <template slot-scope="scope">
                    <template v-for="concreteStrengthGradeDict in concreteStrengthGradeDictList">
                    <template v-if="concreteStrengthGradeDict.id === scope.row.concreteStrengthGrade">{{concreteStrengthGradeDict.grade}}</template>
                    </template>
                </template>
                </el-table-column>
                <el-table-column prop="amount" label="重量" header-align="center" align="center" show-overflow-tooltip min-width="150"></el-table-column>

                <el-table-column prop="useSite" label="适用部位" header-align="center" align="center" show-overflow-tooltip min-width="150">
                <template slot-scope="scope">
                    <template v-for="useSiteDict in useSiteDictList">
                    <template v-if="useSiteDict.id === scope.row.useSite">{{useSiteDict.name}}</template>
                    </template>
                </template>
                </el-table-column>
                <el-table-column prop="buildingNo" label="楼号" header-align="center" align="center" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="floorNo" label="层号" header-align="center" align="center" show-overflow-tooltip min-width="100"></el-table-column>
            </el-table>
            <div class="bottom">
                <div>合计:</div>
                <div>{{totalT}}</div>
            </div>
        </template>
            <el-pagination
            :current-page="queryInfo.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="queryInfo.limit"
            :total="totalT"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="pageSizeChangeHandleT"
            @current-change="pageCurrentChangeHandleT">
        </el-pagination>
        <template slot="footer">
            <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        </template>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      setBuildingAndFloorVisible: false,
      mixinViewModuleOptions: {
        getDataListURL: '/preproduction/productionSubsidiary/page',
        getDataListIsPage: true
      },
      componentTypeListVisible: false,
      componentTypeTreeList: [],
      componentTypeList: [],
      unitList: [],
      concreteStrengthGradeDictList: [],
      useSiteDictList: [],
      userList: [],
      qualityInspectionDictList: [],
      visualInspectionDictList: [],
      dataForm: {
        id: '',
        componentType: '',
        typeName: '',
        startDate: '',
        endDate: '',
        useSite: '',
        concreteStrengthGrade: '',
        productName: '',
        systemCoding: '',
        componentSeries: '',
        componentName: ''
      },
      printType: '',
      dialogVisible: false,
      dialogForm: {},
      formationdataList: [],
      title: '',
      queryInfo: {
        page: 1,
        limit: 10
      },
      totalT: 1
    }
  },
  created () {
    this.getComponentTypeTreeList()
    this.getComponentTypeList()
    // this.getUnitList()
    // this.getModelList()
    // this.getSpecificationsList()
    this.getUseSiteDictList()
    this.getConcreteStrengthGradeDictList()
    // this.getQualityInspectionDictList()
    // this.getVisualInspectionDictList()
    // this.getUserList()
  },
  methods: {
    // 分页, 每页条数
    pageSizeChangeHandleT (val) {
      this.queryInfo.page = 1
      this.queryInfo.limit = val
      this.formationList()
    },
    // 分页, 当前页
    pageCurrentChangeHandleT (val) {
      this.queryInfo.page = val
      this.formationList()
    },
    formationList () {
      this.dataListLoading = true
      this.$http.get('/preproduction/preproductioninformation/page', { params: { ...this.dialogForm, ...this.queryInfo } }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.formationdataList = []
          this.totalT = 0
          return this.$message.error(res.msg)
        }
        this.formationdataList = res.data.list
        this.totalT = res.data.total
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 查看
    tabSubsidiary (data) {
      this.dialogForm.status = data.tab
      this.dialogForm.productNameAccurateSearch = data.row.productName
      this.queryInfo.page = 1
      this.title = data.title
      this.dialogVisible = true
      this.formationList()
    },
    getComponentTypeTreeList () {
      this.$http.get(`/product/producttype/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.componentTypeTreeList = res.data
      }).catch(() => {})
    },
    getComponentTypeList () {
      this.$http.get(`/product/producttype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.componentTypeList = res.data
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
        params: { }
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
        params: { }
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
      }).catch(() => {})
    },
    // 上级类型树, 设置默认值
    componentTypeListTreeSetDefaultHandle () {
      this.dataForm.componentType = ''
      this.dataForm.typeName = ''
    },
    // 所属部门树, 选中
    componentTypeListTreeCurrentChangeHandle (data, node) {
      this.dataForm.componentType = data.id
      this.dataForm.typeName = data.name
      this.componentTypeListVisible = false
    },
    getRowKeys (row) {
      return row.id
    }
  }
}
</script>

<style scoped>

.bottom{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #EBEEF5;
    font-size:14px;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(0,0,0,1);
    height: 40px;
    padding:17px;
}

</style>
