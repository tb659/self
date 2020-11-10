<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-materiel__materieltype}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="$hasPermission('materiel:materieltype:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('product:product:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('materiel:materieltype:export')" type="info" @click="exportHandle()">下载导入模板</el-button>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            :action="importUrl"
            accept='.xlsx,.xls'
            :before-upload="beforeUploadHandle"
            :on-success="successHandle">
            <el-button v-if="$hasPermission('materiel:materieltype:import')" type="primary">导入</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" row-key="id" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" :selectable="checkBoxChecked" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="name" label="物料分类名称" header-align="center" align="left"></el-table-column>
        <el-table-column prop="code" label="物料分类编码" header-align="center" align="left"></el-table-column>
        <el-table-column prop="parentName" label="上级分类" header-align="center" align="center"></el-table-column>
        <el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('materiel:materieltype:update') && scope.row.pid !== '0'" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('materiel:materieltype:delete') && scope.row.pid !== '0'" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './materieltype-add-or-update'
import Cookies from 'js-cookie'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      importUrl: `${window.SITE_CONFIG['apiURL']}/materiel/materieltype/import?token=${Cookies.get('token')}`,
      mixinViewModuleOptions: {
        getDataListURL: '/materiel/materieltype/getList',
        deleteURL: '/materiel/materieltype',
        deleteIsBatch: true,
        exportURL: '/materiel/materieltype/export'
      },
      dataForm: {
        id: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    checkBoxChecked (row, index) {
      if (row.children.length !== 0 || row.pid === '0') {
        return false// 禁用
      } else {
        return true// 不禁用
      }
    },
    // 上传之前
    beforeUploadHandle (file) {
      if (file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$message.error(this.$t('upload.tip', { 'format': 'xlsx、xls' }))
        return false
      }
      this.num++
      this.dataListLoading = true
      this.message = this.$message({
        message: '当前导入Excel数据量过大，时间可能过长，请耐心等候。。。',
        duration: 0
      })
    },
    // 上传成功
    successHandle (res, file, fileList) {
      if (res.code !== 0) {
        return this.$message.error(res.msg)
      }
      this.message.close()
      this.$alert(res.data, '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.dataListLoading = false
          this.getDataList()
        }
      })
    }
  }
}
</script>
