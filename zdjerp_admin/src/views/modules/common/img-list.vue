<template>
  <el-dialog :visible.sync="visible" title="图片列表" :close-on-click-modal="false" :append-to-body="true" width="60%">
    <el-card shadow="never" class="aui-card--fill">
      <div class="mod-oss__oss">
        <el-form :inline="true" :model="dataForm">
          <el-form-item>
            <el-button type="primary" @click="uploadHandle()">{{ $t('oss.upload') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" :disabled="dataListSelections.length != 1" @click="submitHandle()">确定</el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="dataListLoading"
          :data="dataList"
          height="300"
          stripe
          border
          @selection-change="dataListSelectionChangeHandle"
          @cell-dblclick="submitHandle"
          @sort-change="dataListSortChangeHandle"
          style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column header-align="center" align="center" label="序号" width="60"><template slot-scope="scope"> {{scope.$index+1}} </template></el-table-column>
          <el-table-column prop="url" label="图片" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <img :src="scope.row.url" alt="" style="width: 30px;height: 30px">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="图片名称" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
          <el-table-column prop="createDate" :label="$t('oss.createDate')" sortable="custom" header-align="center" align="center" width="180" show-overflow-tooltip ></el-table-column>
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
      <!-- 弹窗, 上传文件 -->
      <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList"></upload>
    </el-card>
  </el-dialog>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import Upload from '../oss/oss-upload'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/oss/page',
        getDataListIsPage: true,
        deleteURL: '/sys/oss',
        deleteIsBatch: true
      },
      visible: false,
      dataForm: {},
      configVisible: false,
      uploadVisible: false
    }
  },
  components: {
    Upload
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getDataList()
      })
    },
    // 上传文件
    uploadHandle () {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.upload.init()
      })
    },
    // 选择的图片信息
    submitHandle (row) {
      var imgInfo = this.dataListSelections.find((item) => {
        console.log(imgInfo)
        return item.id
      })
      this.$message({
        type: 'success',
        message: '操作成功',
        duration: 100,
        onClose: () => {
          this.visible = false
          if (row) {
            this.$emit('getImgInfo', row)
          } else {
            this.$emit('getImgInfo', imgInfo)
          }
        }
      })
    }
  }
}
</script>
