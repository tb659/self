<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-costom__custominfo}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item style="width: 190px;">
          <el-input v-model="dataForm.name" placeholder="客户名称" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-select v-model="dataForm.levelId" placeholder="客户级别" clearable filterable style="width: 100%">
            <el-option
              v-for="item in levelList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-select v-model="dataForm.originId" placeholder="客户来源" clearable filterable style="width: 100%">
            <el-option
              v-for="item in originList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-input v-model="dataForm.phone" placeholder="公司电话" clearable></el-input>
        </el-form-item>
        <el-form-item style="width: 190px;">
          <el-input v-model="dataForm.contactPhone" placeholder="联系人手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item >
          <el-button v-if="$hasPermission('costom:custominfo:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('costom:custominfo:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column type="index"  label="序号" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="name" label="客户名称" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="levelId" label="客户级别" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <div v-for="item in  levelList" :key="item.id" v-if="item.id === scope.row.levelId">
              {{ item.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="公司电话" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="contactPhone" label="联系人手机号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column prop="originId" label="客户来源" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
            <div v-for="item in  originList" :key="item.id" v-if="item.id === scope.row.originId">
              {{ item.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" show-overflow-tooltip header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('costom:custominfo:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('costom:custominfo:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('costom:custominfo:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <!-- 弹窗, 查看 -->
      <view-info v-if="viewInfoVisible" ref="viewInfo"></view-info>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './custominfo-add-or-update'
import ViewInfo from './custominfo-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      levelList: [],
      originList: [],
      mixinViewModuleOptions: {
        getDataListURL: '/costom/custominfo/page',
        getDataListIsPage: true,
        exportURL: '/costom/custominfo/export',
        deleteURL: '/costom/custominfo',
        deleteIsBatch: true
      },
      dataForm: {
        id: ''
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo
  }, // 实例创建完成后被立即调用
  created () {
    this.getLevelList()
    this.getOriginList()
  },
  methods: {
    // 获取等级集合
    getLevelList: function () {
      this.$http.get(`/costom/customlevel/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.levelList = res.data
      }).catch(() => {
      })
    }, // 获取来源集合
    getOriginList: function () {
      this.$http.get(`/costom/customorigin/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.originList = res.data
      }).catch(() => {
      })
    }
  }
}
</script>
