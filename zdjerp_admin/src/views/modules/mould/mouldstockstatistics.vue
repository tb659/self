<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-mould__mouldstock}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-popover v-model="mouldTypeTreeListVisible" ref="mouldTypeListPopover" placement="bottom-start" trigger="click">
            <el-tree
              :data="mouldTypeTreeList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="mouldTypeListTree"
              :highlight-current="true"
              :expand-on-click-node="false"
              accordion
              @current-change="mouldTypeListTreeCurrentChangeHandle">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.typeName" v-popover:mouldTypeListPopover  placeholder="模具类型">
            <i
              v-if="dataForm.typeId !== ''"
              slot="suffix"
              @click.stop="mouldTypeListTreeSetDefaultHandle()"
              class="el-icon-circle-close el-input__icon">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="编码/名称/助记码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
          <el-table-column header-align="center" align="center" label="序号" width="60">
              <template slot-scope="scope"> {{scope.$index+1}} </template>
          </el-table-column>
        <el-table-column prop="typeId" label="模具类型" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="type in mouldTypeList">
              <template v-if="type.id === scope.row.typeId">{{type.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="mouldId" label="模具" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="mould in mouldList">
              <template v-if="mould.id === scope.row.mouldId">{{mould.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="系统编码" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="name" label="模具名称" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="mnemonicCode" label="助记码" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="unit" label="单位" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <template v-for="unit in unitList">
              <template v-if="unit.id === scope.row.unit">{{unit.name}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="specifications" label="模具规格" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="applicableComponents" label="模具适用构件" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="entryDate" label="模具进场日期" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="manager" label="负责人" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <template v-for="user in userList">
              <template v-if="user.id === scope.row.manager">{{user.realName}}</template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="productionUnit" label="制作单位" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="unitprice" label="单价" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="amount" label="金额" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="taxrate" label="税率" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="taxunitprice" label="含税单价" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="taxamount" label="含税金额" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="status" label="模具状态" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="success">在库</el-tag>
            <el-tag v-if="scope.row.status === 1" type="danger">领取中</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="170">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('mould:mouldstock:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
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
import ViewInfo from './mouldstock-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mouldTypeTreeListVisible: false,
      mouldTypeTreeList: [],
      mouldTypeList: [],
      mouldList: [],
      unitList: [],
      userList: [],
      dataForm: {
        id: '',
        name: '',
        typeId: '',
        typeName: '',
        mouldId: ''
      }
    }
  },
  components: {
    ViewInfo
  },
  created: function () {
    this.getMouldTypeTreeList()
    this.getMouldTypeList()
    this.getMouldList()
    this.getUnitList()
    this.getUserList()
  },
  activated () {
    if (this.dataForm.mouldId === '') {
      this.dataForm.mouldId = this.$route.params.mouldId || ''
      if (this.dataForm.mouldId !== '') {
        this.mixinViewModuleOptions.getDataListURL = '/mould/mouldstock/page'
        this.mixinViewModuleOptions.getDataListIsPage = true
      }
    }
    this.getDataList()
  },
  methods: {
    // 所属部门树, 选中
    mouldTypeListTreeCurrentChangeHandle (data, node) {
      this.dataForm.typeId = data.id
      this.dataForm.typeName = data.name
      this.mouldTypeTreeListVisible = false
    },
    // 上级类型树, 设置默认值
    mouldTypeListTreeSetDefaultHandle () {
      this.dataForm.typeId = ''
      this.dataForm.typeName = ''
    },
    getMouldTypeTreeList () {
      this.$http.get(`/mould/mouldtype/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.mouldTypeTreeList = res.data
      }).catch(() => {})
    },
    // 模具类型列表
    getMouldTypeList () {
      this.$http.get(`/mould/mouldtype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.mouldTypeList = res.data
      }).catch(() => {})
    },
    getMouldList () {
      this.$http.get(`/mould/mould/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.mouldList = res.data
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
    getUserList () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
      }).catch(() => {})
    }
  }
}
</script>
