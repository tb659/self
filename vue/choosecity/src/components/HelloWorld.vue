<template>
  <div>
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="breadcrumb_item" :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>标准管理</el-breadcrumb-item>
        <el-breadcrumb-item>题录库文件上传</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
      <el-form label-width="120px">
        <el-form-item label="题录库文件">
          <el-upload class="upload-demo" :action="uploadAction()" :on-success="uploadSuccessMdb" :beforeUpload="beforeExcelUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text"><i class="el-icon-upload2"></i> 上传</div>
          </el-upload>
          <div>
            <span>请上传题录库mdb文件</span>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mdbFileName: '',
      mdbFileUrl: '',
      fileName: '',
      fileUrl: ''
    }
  },

  methods: {
    uploadAction() {
      // return this.$ExcelUpload
      return 'http://localhost:8888/api/img'
    },

    uploadSuccessMdb(res, file, fileList) {
      console.log(res, file, fileList)
      this.mdbFileName = res
    },

    beforeExcelUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 100MB!',
          type: 'warning'
        })
      }
      return isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
.tips2 {
  display: flex;
  .el-form-item__content {
    line-height: 20px;
  }
}
/deep/.upload-demo {
  width: 60px;
  height: 32px;
  margin-bottom: 10px;
  .el-upload-list {
    width: 486px;
  }
}
/deep/.el-upload--text {
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 32px;
  border: 1px dashed #ddd;
  border-radius: 4px;
  .el-upload__text {
    font-size: 12px;
  }
  .el-icon-upload {
    display: none;
  }
}
</style>
