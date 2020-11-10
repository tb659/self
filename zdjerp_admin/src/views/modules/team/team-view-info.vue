<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="所属车间" prop="workshopId">
          <el-input v-model="dataForm.workshopName" readonly></el-input>
      </el-form-item>
          <el-form-item label="班组名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="班组名称" readonly></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="typeId">
        <el-select v-model="dataForm.userName"  filterable clearable style="width: 100%" disabled>
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.username"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
          <el-form-item label="备注" prop="remarks">
          <el-input v-model="dataForm.remarks" placeholder="备注" readonly></el-input>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" disabled></el-input-number>
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
      userList: [],
      dataForm: {
        id: '',
        workshopId: '',
        name: '',
        userId: '',
        remarks: '',
        sort: '',
        userName: ''
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
    // 获取信息
    getInfo () {
      this.$http.get(`/team/team/${this.dataForm.id}`).then(({ data: res }) => {
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
