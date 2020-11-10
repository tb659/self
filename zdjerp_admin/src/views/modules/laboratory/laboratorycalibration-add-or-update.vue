<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="校准日期" prop="calibrationDate">
            <el-date-picker
              v-model="dataForm.calibrationDate"
              type="date"
              placeholder="校准日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="校准编号" prop="code">
            <el-input v-model="dataForm.code" placeholder="校准编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="校准人" prop="calibrator">
            <el-input v-model="dataForm.calibrator" placeholder="校准人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经手人" prop="handler">
            <el-input v-model="dataForm.handler" placeholder="经手人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
    <template>
      <div class="tableDate">
        <div class="table">
          <el-button type="primary" size="small" @click.prevent="addRow()">添加</el-button>
          <el-form label-position="right" :model="tableForm" :inline="true" ref="tableForm">
          <el-table
            :data="tableForm.tableData"
            ref="table"
            tooltip-effect="dark"
            border
            stripe
            style="width: 100%">
            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
            <el-table-column  label="设备编码" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.code" placeholder="设备编码" maxlength="50" readonly></el-input>
              </template>
            </el-table-column>
            <el-table-column label="设备名称" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" placeholder="设备名称" maxlength="50" @focus="showLaboratoryStock(scope.$index)"></el-input>
              </template>
            </el-table-column>
            <el-table-column  label="备注" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark"  placeholder="备注" maxlength="200" readonly></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="100">
              <template slot-scope="scope">
                <el-button v-if="tableForm.tableData.length > 1" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          </el-form>
        </div>
      </div>
    </template>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <laboratoryStock-list v-if="listVisible" ref="laboratoryStockList" @refreshDataList="handleInsert"></laboratoryStock-list>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import laboratoryStockList from '../common/laboratoryStockList'
export default {
  data () {
    return {
      visible: false,
      listVisible: false,
      dataForm: {
        id: '',
        calibrationDate: '',
        code: '',
        calibrator: '',
        handler: '',
        laboratoryId: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        laboratoryStockList: []
      },
      tableForm: {
        tableData: []
      },
      modifyIndex: ''
    }
  },
  computed: {
    dataRule () {
      return {
        calibrationDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        calibrator: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        handler: [
          { required: false, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        laboratoryId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updater: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updateDate: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        delFlag: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    laboratoryStockList
  },
  methods: {
    init () {
      this.visible = true
      this.tableForm.tableData = []
      this.tableForm.tableData.push({
        code: '',
        name: '',
        remark: '',
        laboratoryId: ''
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs['tableForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/laboratory/laboratorycalibration/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    // 增加行
    addRow () {
      var list = {
        code: '',
        name: '',
        remark: '',
        laboratoryId: ''
      }
      this.tableForm.tableData.unshift(list)
    },
    handleDelete (index) { // 删除行数
      this.tableForm.tableData.splice(index, 1)
    },
    showLaboratoryStock (index) {
      this.modifyIndex = index
      this.listVisible = true
      this.$nextTick(() => {
        this.$refs.laboratoryStockList.laboratoryStockList = this.tableForm.tableData
        this.$refs.laboratoryStockList.init()
      })
    },
    handleInsert (res) {
      this.tableForm.tableData = res
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        console.log(this.dataForm)
        let obj = this.tableForm.tableData
        for (let i = 0; i < obj.length; i++) {
          console.log(obj[i])
          if (obj[i].code === '') {
            this.$message({
              message: '第' + (i + 1) + '行设备编码参数不能为空！',
              type: 'error',
              duration: 2000
            })
            return false
          }
          if (!obj[i].name) {
            this.$message({
              message: '第' + (i + 1) + '行设备名称参数不能为空！',
              type: 'error',
              duration: 2000
            })
            return false
          }
        }
        this.dataForm.laboratoryStockList = this.tableForm.tableData
        this.$http[!this.dataForm.id ? 'post' : 'put']('/laboratory/laboratorycalibration/', this.dataForm).then(({ data: res }) => {
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
