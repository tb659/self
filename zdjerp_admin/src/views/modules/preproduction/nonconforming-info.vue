<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false" width="65%">
     <el-form ref="dataForm" :model="dataForm" label-width="100px">
        <el-form-item :label="type=='报废' ? '见证人员' : '修补人员'">
            <el-input disabled v-model="dataForm.serviceman" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="提交日期">
            <el-input disabled v-model="dataForm.chooseTime" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item v-if="type=='报废'" label="报废原因">
            <el-input type="textarea" autosize disabled v-model="dataForm.scrapReason" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item v-if="type=='报废'" label="图片补充">
            <img v-for="url in dataForm.pictures" :key="url" @click="pictures(url)" :src="url" width="100px" height="100px" style="margin:0 14px 14px 0"/>
        </el-form-item>
     </el-form>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
      },
      type: '',
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    pictures (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
      this.$emit('pictures', url)
    },
    init () {
      this.visible = true
      console.log(this.dataForm.id)
      this.$nextTick(() => {
        this.dataForm = {
          id: this.dataForm.id
        }
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/preproduction/nonconforming/getInfo/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        console.log(res)
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    }
  }
}
</script>
