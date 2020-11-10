<template>
  <el-dialog :visible.sync="visible" title="历史记录" :close-on-click-modal="false" :close-on-press-escape="false" width="80%">
      <template v-if="dataList.length">
          <el-collapse accordion>
            <el-collapse-item v-for="item in dataList" :key="item.createDate">
                <template slot="title">
                    <div class="header">
                        <div :span="6">操作人：<span>{{item.realName}}</span></div>
                        <div :span="6">操作日期：<span>{{item.createDate}}</span></div>
                    </div>
                </template>
                <el-table  show-summary :summary-method="getSummaries" :data="item.productionOrdersDetailRecordDTOList" border style="width: 100%;padding-bottom:0">
                    <el-table-column header-align="center" align="center" label="序号" width="60">
                        <template slot-scope="scope"> {{scope.$index+1}} </template>
                    </el-table-column>
                    <el-table-column prop="productCoding" show-overflow-tooltip label="编码" min-width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="productName" show-overflow-tooltip label="名称" min-width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="productSeries" show-overflow-tooltip label="构件系列" min-width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="outlineSize" show-overflow-tooltip label="外形尺寸" min-width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="deptId" show-overflow-tooltip label="单位" min-width="150" header-align="center" align="center">
                        <template slot-scope="scope">
                        <template v-for="item in deptList">
                            <template v-if="item.id === scope.row.deptId">{{item.name}}</template>
                        </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="quantity" show-overflow-tooltip label="数量" width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="remark" show-overflow-tooltip label="备注" width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="buildingNo" show-overflow-tooltip label="楼号" width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="floorNo" show-overflow-tooltip label="层号" width="150" header-align="center" align="center"></el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
        <el-pagination
        v-if="total"
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
        </el-pagination>
    </template>
    <template v-else>
        <div style="text-align:center">
            暂无历史修改
        </div>
    </template>
    <template slot="footer">
        <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      deptList: [],
      dataForm: {
        productionOrdersId: ''
      },
      limit: 10,
      page: 1,
      dataList: [],
      total: 1
    }
  },
  methods: {
    // 分页, 每页条数
    pageSizeChangeHandle (val) {
      this.page = 1
      this.limit = val
      this.getInfo()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.page = val
      this.getInfo()
    },
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getDeptList()
        if (this.dataForm.productionOrdersId) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get('/productionorders/productionorders/record/page', {
        params: {
          page: this.page,
          limit: this.limit,
          productionOrdersId: this.dataForm.productionOrdersId
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.total = 0
          this.dataList = []
          return this.$message.error(res.msg)
        }

        this.dataList = res.data.list
        this.total = res.data.total
      }).catch(() => {})
    },
    // 单位列表
    getDeptList () {
      this.$http.get(`/articleUnit/articleunit/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data
      }).catch(() => {})
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
        let num = [6]
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

<style scoped>
.el-collapse .el-collapse-item .el-collapse-item__content{
    padding-bottom: 0 !important;
}
.header{
    display: inline-block;
    align-items: center;
    font-size:14px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(38,38,38,1);
    padding-left: 30px;
}
.header span{
    padding-left: 20px;
    font-size:14px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(102,102,102,1);
}
.header div{
    display: inline-block;
    padding-right: 50px;
}
</style>
