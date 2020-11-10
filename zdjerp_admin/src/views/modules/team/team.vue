<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-team__team}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.name" placeholder="班组名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.userName" placeholder="班组负责人" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.workshopName" placeholder="车间名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('team:team:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('team:team:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column header-align="center" align="center" label="序号" width="60">
          <template slot-scope="scope"> {{scope.$index+1}} </template>
        </el-table-column>
        <el-table-column prop="name" label="班组名称" header-align="center" align="center" width="220"></el-table-column>
        <el-table-column prop="workshopName" label="所属车间" header-align="center" align="center"  width="220"></el-table-column>
        <el-table-column prop="userName" label="班组负责人" header-align="center" align="center"  width="230"></el-table-column>
        <el-table-column prop="remarks" label="备注" header-align="center" align="center"  width="240"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="190">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('team:team:info')" type="text" size="small" @click="viewInfoHandle(scope.row.id)">查看</el-button>
            <el-button v-if="$hasPermission('team:team:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('team:team:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './team-add-or-update'
import ViewInfo from './team-view-info'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/team/team/page',
        getDataListIsPage: true,
        exportURL: '/team/team/export',
        deleteURL: '/team/team',
        deleteIsBatch: true
      },
      userList: [],
      workshopList: [],
      dataForm: {
        id: '',
        userId: ''
      }
    }
  },
  components: {
    AddOrUpdate, ViewInfo
  },
  created: function () {
    this.getUserList()
    this.getWorkshopList()
  },
  methods: {
    // 获取用户集合
    getUserList: function () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data
      }).catch(() => {
      })
    },
    // 获取工序集合
    getWorkshopList: function () {
      this.$http.get(`/workshop/workshop/workshopList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.workshopList = res.data
      }).catch(() => {
      })
    }
  }
}
</script>
