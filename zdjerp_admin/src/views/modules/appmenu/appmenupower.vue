<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item prop="name" :label="$t('role.name')">
        <el-input v-model="dataForm.name" :placeholder="$t('role.name')" readonly></el-input>
      </el-form-item>
      <el-form-item prop="type" label="类型">
        <el-input v-model="dataForm.type" placeholder="类型" readonly></el-input>
      </el-form-item>
      <el-form-item size="mini" :label="$t('role.menuList')">
        <el-tree
          :data="menuList"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          ref="menuListTree"
          accordion
          show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import Upload from '../oss/oss-upload-img'
export default {
  data () {
    return {
      visible: false,
      menuList: [],
      dataForm: {
        roleId: '',
        name: '',
        type: '',
        appMenuIdList: []
      }
    }
  },
  components: {
    Upload
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs.menuListTree.setCheckedKeys([])
        Promise.all([
          this.getMenuList()
        ]).then(() => {
          if (this.dataForm.roleId) {
            this.getInfo()
          }
        })
      })
    },
    getMenuList () {
      return this.$http.get('/appmenu/appmenu/select').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.menuList = res.data
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/appmenu/approlemenu/getInfo/${this.dataForm.roleId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm.appMenuIdList = res.data.appMenuIdList
        this.dataForm.appMenuIdList.forEach(item => this.$refs.menuListTree.setChecked(item, true))
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        const loading = this.$loading({
          lock: true,
          text: '正在保存，请稍等。。。',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.dataForm.appMenuIdList = [
          ...this.$refs.menuListTree.getHalfCheckedKeys(),
          ...this.$refs.menuListTree.getCheckedKeys()
        ]
        this.$http['post']('/appmenu/approlemenu/setAppMenuPower', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              loading.close()
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
