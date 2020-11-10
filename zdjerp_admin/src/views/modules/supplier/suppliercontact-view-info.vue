<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="主表id" prop="supplierId">
          <el-input v-model="dataForm.supplierId" placeholder="主表id"></el-input>
      </el-form-item>
          <el-form-item label="联系人姓名" prop="name">
          <el-input v-model="dataForm.name" placeholder="联系人姓名"></el-input>
      </el-form-item>
          <el-form-item label="联系人电话" prop="phoneNum">
          <el-input v-model="dataForm.phoneNum" placeholder="联系人电话"></el-input>
      </el-form-item>
          <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
          <el-form-item label="QQ" prop="qq">
          <el-input v-model="dataForm.qq" placeholder="QQ"></el-input>
      </el-form-item>
          <el-form-item label="微信" prop="weixin">
          <el-input v-model="dataForm.weixin" placeholder="微信"></el-input>
      </el-form-item>
          <el-form-item label="创建者" prop="creator">
          <el-input v-model="dataForm.creator" placeholder="创建者"></el-input>
      </el-form-item>
          <el-form-item label="创建时间" prop="createDate">
          <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
      </el-form-item>
          <el-form-item label="更新者" prop="updater">
          <el-input v-model="dataForm.updater" placeholder="更新者"></el-input>
      </el-form-item>
          <el-form-item label="更新时间" prop="updateDate">
          <el-input v-model="dataForm.updateDate" placeholder="更新时间"></el-input>
      </el-form-item>
          <el-form-item label="备注" prop="remarks">
          <el-input v-model="dataForm.remarks" placeholder="备注"></el-input>
      </el-form-item>
          <el-form-item label="删除标识 0正常 1删除" prop="delFlag">
          <el-input v-model="dataForm.delFlag" placeholder="删除标识 0正常 1删除"></el-input>
      </el-form-item>
      </el-form>
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
      dataForm: {
        id: '',
        supplierId: '',
        name: '',
        phoneNum: '',
        email: '',
        qq: '',
        weixin: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        remarks: '',
        delFlag: ''
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/supplier/suppliercontact/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    }
  }
}
</script>
