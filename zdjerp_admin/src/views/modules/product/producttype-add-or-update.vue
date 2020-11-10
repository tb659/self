<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? '新增产成品类型' : '修改产成品类型'" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body="">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '120px'">
      <el-form-item label="产成品分类名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="产成品分类名称"></el-input>
      </el-form-item>
      <el-form-item label="上级分类" prop="parentName">
        <el-popover v-model="productTypeListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
          <el-tree
            :data="productTypeList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            ref="deptListTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="productTypeTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:deptListPopover :readonly="true" placeholder="上级分类">
          <i
            v-if="$store.state.user.superAdmin === 1 && dataForm.pid !== '0'"
            slot="suffix"
            @click.stop="productTypeListTreeSetDefaultHandle()"
            class="el-icon-circle-close el-input__icon">
          </i>
        </el-input>
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
      productTypeList: [],
      productTypeListVisible: false,
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
            this.productTypeListTreeSetDefaultHandle()
          }
        })
      })
    },
    // 获取部门列表
    getMarerielTypeList () {
      return this.$http.get('product/producttype/getList').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.productTypeList = res.data
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/product/producttype/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        if (this.dataForm.pid === '0') {
          return this.productTypeListTreeSetDefaultHandle()
        }
        this.$refs.deptListTree.setCurrentKey(this.dataForm.pid)
      }).catch(() => {})
    },
    // 上级类型树, 设置默认值
    productTypeListTreeSetDefaultHandle () {
      this.$refs.deptListTree.setCurrentKey(this.dataForm.pid)
      this.dataForm.parentName = this.dataForm.pid === this.$refs.deptListTree.getCurrentKey()
        ? this.$refs.deptListTree.getCurrentNode()['name']
        : ''
    },
    // 上级部门树, 选中
    productTypeTreeCurrentChangeHandle (data) {
      this.dataForm.pid = data.id
      this.dataForm.parentName = data.name
      this.productTypeListVisible = false
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/product/producttype/', this.dataForm).then(({ data: res }) => {
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
