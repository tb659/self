<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-form-item label="库房名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="库房名称" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="parentName" label="上级名称" class="dept-list">
        <el-popover v-model="deptListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
          <el-tree
            :data="deptList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            ref="deptListTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="deptListTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:deptListPopover :readonly="true" placeholder="上级名称">
          <i
            v-if="$store.state.user.superAdmin === 1 && dataForm.pid!== '0'"
            slot="suffix"
            @click.stop="deptListTreeSetDefaultHandle()"
            class="el-icon-circle-close el-input__icon">
          </i>
        </el-input>
      </el-form-item>
      <el-form-item label="存储类型" prop="type">
        <el-select v-model="dataForm.type" style="width: 100%;" :disabled="dataForm.id !== ''">
          <el-option :value="1" label="原材料"></el-option>
          <el-option :value="2" label="成品"></el-option>
          <el-option :value="3" label="一般设备"></el-option>
          <el-option :value="4" label="实验室工具"></el-option>
          <el-option :value="5" label="模具"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓储位置" prop="position">
        <el-input v-model="dataForm.position" placeholder="仓储位置" maxlength="100"></el-input>
      </el-form-item>
      <el-row>
<!--        <el-col :span="12">-->
<!--          <el-form-item label="库房存储" size="mini" prop="full">-->
<!--            <el-radio-group v-model="dataForm.full">-->
<!--              <el-radio :label="0">已满</el-radio>-->
<!--              <el-radio :label="1">未满</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="12">
          <el-form-item label="状态" size="mini" prop="status">
            <el-radio-group v-model="dataForm.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">正常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="dataForm.sort" :min="0" controls-position="right" label="排序"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="附件" prop="enclosureUrl">
            <el-input v-model="dataForm.enclosureUrl" placeholder="附件" @focus="getEnclosureUrl"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <!--附件上传-->
    <enclosure-file v-if="enclosureUrlVisible" ref="enclosureFile" @setEnclosureInfo="setEnclosureUrl"></enclosure-file>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import EnclosureFile from './storeroom-upload'
export default {
  data () {
    return {
      visible: false,
      enclosureUrlVisible: false,
      deptList: [],
      deptListVisible: false,
      dataForm: {
        id: '',
        name: '',
        type: '',
        position: '',
        full: 1,
        status: 1,
        sort: '',
        enclosureUrl: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        parentId: '',
        parentName: ''
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
        ],
        type: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ]
      }
    }
  },
  components: {
    EnclosureFile
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.getDeptList().then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          } else if (this.$store.state.user.superAdmin === 1) {
            this.deptListTreeSetDefaultHandle()
          }
        })
      })
    },
    // 获取文件的信息
    setEnclosureUrl (url) {
      this.dataForm.enclosureUrl = url
    },
    // 初始化弹框
    getEnclosureUrl () {
      this.enclosureUrlVisible = true
      this.$nextTick(() => {
        this.$refs.enclosureFile.init()
      })
    },
    // 上级树, 设置默认值
    deptListTreeSetDefaultHandle () {
      this.dataForm.pid = '0'
      this.dataForm.parentName = '一级'
    },
    // 上级树, 选中
    deptListTreeCurrentChangeHandle (data) {
      this.dataForm.pid = data.id
      this.dataForm.parentName = data.name
      this.deptListVisible = false
      this.$http.get(`/basis/storeroom/${data.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm.type = res.data.type
      }).catch(() => {})
    },
    // 获取部门列表
    getDeptList () {
      return this.$http.get('/basis/storeroom/list').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/basis/storeroom/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        if (this.dataForm.pid === '0') {
          return this.deptListTreeSetDefaultHandle()
        }
        this.$refs.deptListTree.setCurrentKey(this.dataForm.pid)
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/basis/storeroom/', this.dataForm).then(({ data: res }) => {
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
