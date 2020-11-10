<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" width="65%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="构件类型" prop="componentType">
            <el-popover v-model="componentTypeTreeListVisible" ref="componentTypeTreeListPopover" placement="bottom-start" trigger="click">
              <el-tree
                :data="componentTypeTreeList"
                :props="{ label: 'name', children: 'children' }"
                node-key="id"
                ref="componentTypeTreeListTree"
                :highlight-current="true"
                :expand-on-click-node="false"
                accordion
                @current-change="componentTypeTreeListTreeCurrentChangeHandle">
              </el-tree>
            </el-popover>
            <el-input v-model="dataForm.componentTypeName" v-popover:componentTypeTreeListPopover :readonly="true" placeholder="构件类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="系统编码" prop="systemCoding">
            <el-input v-model="dataForm.systemCoding" placeholder="系统编码" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="构件系列" prop="componentSeries">
            <el-input v-model="dataForm.componentSeries" placeholder="构件系列" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="构件名称" prop="componentName">
            <el-input v-model="dataForm.componentName" placeholder="构件名称" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="外形尺寸" prop="outlineSize">
            <el-input v-model="dataForm.outlineSize" placeholder="外形尺寸" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标注图号" prop="standardDrawingNo">
            <el-input v-model="dataForm.standardDrawingNo" placeholder="标注图号" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="混凝土强度" prop="concreteStrengthGrade">
            <el-select v-model="dataForm.concreteStrengthGrade" filterable clearable placeholder="混凝土强度等级" style="width: 100%;">
              <el-option
                v-for="item in concreteStrengthGradeDictList"
                :key="item.id"
                :label="item.grade"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="重量" prop="amount">
            <el-input v-model="dataForm.amount" placeholder="重量" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目名称" prop="productName">
            <el-input v-model="dataForm.productName" placeholder="项目名称" maxlength="255"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="适用部位" prop="useSite">
            <el-select v-model="dataForm.useSite" filterable clearable placeholder="适用部位" style="width: 100%;">
              <el-option
                v-for="item in useSiteDictList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生产日期" prop="productionDate">
            <el-date-picker v-model="dataForm.productionDate" type="date" style="width: 100%" value-format="yyyy-MM-dd" placeholder="生产日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生产数量" prop="quantity">
            <el-input-number v-model="dataForm.quantity" controls-position="right" :min="1" placeholder="生产数量"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="楼号" prop="buildingNo">
            <el-input v-model="dataForm.buildingNo" placeholder="楼号" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="层号" prop="floorNo">
            <el-input v-model="dataForm.floorNo" placeholder="层号" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="制作单位" prop="productionUnit">
        <el-input v-model="dataForm.productionUnit" placeholder="制作单位"></el-input>
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
      componentTypeTreeListVisible: false,
      componentTypeTreeList: [],
      componentTypeList: [],
      modelList: [],
      specificationList: [],
      useSiteDictList: [],
      concreteStrengthGradeDictList: [],
      dataForm: {
        id: '',
        componentType: '',
        componentTypeName: '',
        outlineSize: '',
        systemCoding: '',
        componentSeries: '',
        componentName: '',
        specifications: '',
        model: '',
        standardDrawingNo: '',
        concreteStrengthGrade: '',
        amount: '',
        productName: '',
        useSite: '',
        productionUnit: '',
        batch: '',
        qrCode: '',
        status: '',
        productionDate: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        quantity: '',
        buildingNo: '',
        floorNo: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        componentType: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        systemCoding: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        componentSeries: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        componentName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        specifications: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        model: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        standardDrawingNo: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        outlineSize: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        concreteStrengthGrade: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        amount: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        productName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        useSite: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        productionUnit: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        batch: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        qrCode: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        status: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        productionDate: [
          { required: false, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getComponentTypeTreeList()
        this.getModelList()
        this.getSpecificationList()
        this.getComponentTypeList()
        this.getUseSiteDictList()
        this.getConcreteStrengthGradeDictList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 所属类型树, 选中
    componentTypeTreeListTreeCurrentChangeHandle (data, node) {
      this.dataForm.componentType = data.id
      this.dataForm.componentTypeName = data.name
      this.componentTypeTreeListVisible = false
    },
    // 产成品类型树列表
    getComponentTypeTreeList () {
      this.$http.get(`/product/producttype/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.componentTypeTreeList = res.data
      }).catch(() => {})
    },
    // 产成品类型列表
    getComponentTypeList () {
      this.$http.get(`/product/producttype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.componentTypeList = res.data
      }).catch(() => {})
    },
    // 规格列表
    getSpecificationList: function () {
      this.$http.get(`/basis/specification/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.specificationList = res.data
      }).catch(() => {
      })
    },
    // 型号列表
    getModelList: function () {
      this.$http.get(`/basis/model/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.modelList = res.data
      }).catch(() => {
      })
    },
    // 适用部位
    getUseSiteDictList () {
      this.$http.get(`applyPosition/applyposition/list`, {
        params: {}
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.useSiteDictList = res.data
      }).catch(() => {
      })
    },
    // 混凝土强度等级
    getConcreteStrengthGradeDictList () {
      this.$http.get(`concreteStrength/concretestrength/list`, {
        params: {}
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.concreteStrengthGradeDictList = res.data
      }).catch(() => {
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/preproduction/preproductioninformation/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.componentTypeList.forEach(item => {
          if (item.id === this.dataForm.componentType) {
            this.dataForm.componentTypeName = item.name
          }
        })
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/preproduction/preproductioninformation/', this.dataForm).then(({ data: res }) => {
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
