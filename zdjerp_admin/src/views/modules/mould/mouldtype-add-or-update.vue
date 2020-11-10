<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? '新增模具分类' : '修改模具分类'" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body="">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
      <el-form-item label="模具分类名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="模具分类名称"></el-input>
      </el-form-item>
      <el-form-item label="上级分类" prop="parentName">
        <el-popover v-model="mouldTypeListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
          <el-tree
            :data="mouldTypeList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            ref="deptListTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="mouldTypeTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:deptListPopover :readonly="true" placeholder="上级分类"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序"></el-input-number>
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
export default {
  data () {
    return {
      visible: false,
      mouldTypeList: [],
      mouldTypeListVisible: false,
      dataForm: {
        id: '',
        name: '',
        pid: '',
        parentName: '',
        sort: 0
      }
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.getMarerielTypeList().then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          } else if (this.$store.state.user.superAdmin === 1) {
            this.mouldTypeListTreeSetDefaultHandle()
          }
        })
      })
    },
    // 获取部门列表
    getMarerielTypeList () {
      return this.$http.get('mould/mouldtype/getList').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.mouldTypeList = res.data
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/mould/mouldtype/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        if (this.dataForm.pid === '0') {
          return this.mouldTypeListTreeSetDefaultHandle()
        }
        this.$refs.deptListTree.setCurrentKey(this.dataForm.pid)
      }).catch(() => {})
    },
    // 上级类型树, 设置默认值
    mouldTypeListTreeSetDefaultHandle () {
      this.$refs.deptListTree.setCurrentKey(this.dataForm.pid)
      this.dataForm.parentName = this.dataForm.pid === this.$refs.deptListTree.getCurrentKey()
        ? this.$refs.deptListTree.getCurrentNode()['name']
        : ''
    },
    // 上级部门树, 选中
    mouldTypeTreeCurrentChangeHandle (data) {
      this.dataForm.pid = data.id
      this.dataForm.parentName = data.name
      this.mouldTypeListVisible = false
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/mould/mouldtype/', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
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
