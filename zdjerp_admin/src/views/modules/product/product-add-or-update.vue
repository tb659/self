<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
      <el-row>
        <el-col :span="7">
          <el-form-item label="产成品类型" prop="typeId">
            <el-popover v-model="productTypeTreeListVisible" ref="productTypeTreeListPopover" placement="bottom-start" trigger="click">
              <div style="height: 300px;">
                <el-scrollbar style="height: 100%;">
                  <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
                  <el-tree
                    class="filter-tree"
                    :data="productTypeTreeList"
                    :props="{ label: 'name', children: 'children' }"
                    node-key="id"
                    ref="productTypeTreeListTree"
                    :highlight-current="true"
                    :expand-on-click-node="false"
                    accordion
                    @current-change="productTypeTreeListTreeCurrentChangeHandle"
                    :filter-node-method="filterNode">
                  </el-tree>
                </el-scrollbar>
              </div>
            </el-popover>
            <el-input v-model="dataForm.typeName" v-popover:productTypeTreeListPopover :readonly="true" placeholder="产成品类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-button circle type="primary" v-if="$hasPermission('product:product:save')" size="mini" icon="el-icon-plus" @click="addTypeHandle()" style="margin-top: 4px; margin-left: 4px;"></el-button>
        </el-col>
        <el-col :span="8">
          <el-form-item label="系统编码" prop="code">
            <el-input v-model="dataForm.code" placeholder="系统编码"  maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="构件系列" prop="componentSeries">
            <el-input v-model="dataForm.componentSeries" placeholder="构件系列"  maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="构件名称" prop="componentName">
            <el-input v-model="dataForm.componentName" placeholder="构件名称"  maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位" prop="unit">
            <el-select v-model="dataForm.unit" filterable clearable placeholder="单位" style="width: 100%;">
              <el-option
                v-for="item in unitList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="外形尺寸" prop="outlineSize">
            <el-input v-model="dataForm.outlineSize" placeholder="外形尺寸" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="dataForm.projectName" placeholder="项目名称"  maxlength="50"></el-input>
          </el-form-item>
        </el-col>
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
          <el-form-item label="标准图号" prop="standardDrawingNo">
            <el-input v-model="dataForm.standardDrawingNo" placeholder="标准图号"  maxlength="50"></el-input>
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
          <el-form-item label="重量" prop="weight">
            <el-input v-model="dataForm.weight" placeholder="重量"  maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" placeholder="备注"  maxlength="255"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <!-- 类型添加 -->
    <add-or-update-type v-if="addOrUpdateTypeVisible" ref="addOrUpdateType" @refreshDataList="getProductTypeTreeList"></add-or-update-type>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import AddOrUpdateType from './producttype-add-or-update'
export default {
  data () {
    return {
      visible: false,
      addOrUpdateTypeVisible: false,
      loading: false,
      options: [],
      productTypeTreeListVisible: false,
      productionManagerListVisible: false,
      qualityInspectorListVisible: false,
      experimenterListVisible: false,
      productTypeTreeList: [],
      productTypeList: [],
      unitList: [],
      modelList: [],
      specificationList: [],
      useSiteDictList: [],
      concreteStrengthGradeDictList: [],
      qualityInspectionDictList: [],
      visualInspectionDictList: [],
      productionManagerTreeList: [],
      qualityInspectorTreeList: [],
      experimenterTreeList: [],
      productionManagerList: [],
      qualityInspectorList: [],
      experimenterList: [],
      preproductionList: [],
      filterText: '',
      dataForm: {
        id: '',
        typeId: '',
        typeName: '',
        preproductionId: '',
        code: '',
        componentSeries: '',
        componentName: '',
        mnemonicCode: '',
        unit: '',
        quantity: '',
        projectName: '',
        useSite: '',
        specifications: '',
        model: '',
        outlineSize: '',
        standardDrawingNo: '',
        concreteStrengthGrade: '',
        batch: '',
        castingDate: '',
        productionDate: '',
        length: '',
        width: '',
        height: '',
        qualityInspection: '',
        visualInspection: '',
        productionManager: '',
        productionManagerName: '',
        qualityInspector: '',
        qualityInspectorName: '',
        experimenter: '',
        experimenterName: '',
        productionUnit: '',
        remark: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: '',
        weight: ''
      }
    }
  },
  computed: {
    dataRule () {
      let checkCodeUnique = (rule, value, callback) => {
        this.checkCodeUnique(rule, value, callback)
      }
      return {
        typeId: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        code: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: checkCodeUnique, trigger: 'blur' }
        ],
        componentSeries: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        componentName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        weight: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.productTypeTreeListTree.filter(val)
    }
  },
  components: {
    AddOrUpdateType
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getProductTypeTreeList()
        this.getUnitList()
        this.getModelList()
        this.getSpecificationList()
        this.getUseSiteDictList()
        this.getConcreteStrengthGradeDictList()
        this.getQualityInspectionDictList()
        this.getVisualInspectionDictList()
        this.getDeptUserTreeList()
        this.getPreproductionList()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getProductTypeList()
          this.getUserList()
          this.getInfo()
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    checkCodeUnique (rule, value, callback) {
      this.$http.get(`/product/product/checkCodeUnique`, {
        params: {
          'code': value,
          'id': this.dataForm.id
        }
      }).then(({ data }) => {
        if (data.code === 0) {
          if (data.data.length > 0) {
            callback(new Error('该设备编码已经存在,请重新输入'))
          } else {
            callback()
          }
        } else {
          callback(new Error('发生异常'))
        }
      })
    },
    addTypeHandle (id) {
      this.addOrUpdateTypeVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdateType.init()
      })
    },
    // 所属部门树, 选中
    productTypeTreeListTreeCurrentChangeHandle (data, node) {
      this.dataForm.typeId = data.id
      this.dataForm.typeName = data.name
      this.productTypeTreeListVisible = false
    },
    productionManagerListTreeCurrentChangeHandle (data, node) {
      this.dataForm.productionManager = data.id
      this.dataForm.productionManagerName = data.name
      this.productionManagerListVisible = false
    },
    qualityInspectorListTreeCurrentChangeHandle (data, node) {
      this.dataForm.qualityInspector = data.id
      this.dataForm.qualityInspectorName = data.name
      this.qualityInspectorListVisible = false
    },
    experimenterListTreeCurrentChangeHandle (data, node) {
      this.dataForm.experimenter = data.id
      this.dataForm.experimenterName = data.name
      this.experimenterListVisible = false
    },
    // 产成品类型列表
    getProductTypeTreeList () {
      this.$http.get(`/product/producttype/getList`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.productTypeTreeList = res.data
      }).catch(() => {})
    },
    // 产成品类型列表
    getProductTypeList () {
      this.$http.get(`/product/producttype/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.productTypeList = res.data
      }).catch(() => {})
    },
    // 单位列表
    getUnitList: function () {
      this.$http.get(`/articleUnit/articleunit/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.unitList = res.data
      }).catch(() => {
      })
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
        params: { dictType: 'sybw' }
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
    // 质量检验
    getQualityInspectionDictList () {
      this.$http.get(`sys/dict/dictList`, {
        params: { dictType: 'zljy' }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.qualityInspectionDictList = res.data
      }).catch(() => {
      })
    },
    // 外观检验
    getVisualInspectionDictList () {
      this.$http.get(`sys/dict/dictList`, {
        params: { dictType: 'wgjy' }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.visualInspectionDictList = res.data
      }).catch(() => {
      })
    },
    // 部门用户树型结构
    getDeptUserTreeList () {
      this.$http.get(`/sys/dept/listDeptAndUser`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.productionManagerTreeList = res.data
        this.qualityInspectorTreeList = res.data
        this.experimenterTreeList = res.data
      }).catch(() => {})
    },
    // 用户列表
    getUserList () {
      this.$http.get(`/sys/user/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.productionManagerList = res.data
        this.qualityInspectorList = res.data
        this.experimenterList = res.data
      }).catch(() => {})
    },
    // 远程搜索
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.preproductionList.filter(item => {
            return item.componentName.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/product/product/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.options = this.preproductionList
        this.productTypeList.forEach(item => {
          if (item.id === this.dataForm.typeId) {
            this.dataForm.typeName = item.name
          }
        })
        this.productionManagerList.forEach(item => {
          if (item.id === this.dataForm.productionManager) {
            this.dataForm.productionManagerName = item.realName
          }
        })
        this.qualityInspectorList.forEach(item => {
          if (item.id === this.dataForm.qualityInspector) {
            this.dataForm.qualityInspectorName = item.realName
          }
        })
        this.experimenterList.forEach(item => {
          if (item.id === this.dataForm.experimenter) {
            this.dataForm.experimenterName = item.realName
          }
        })
      }).catch(() => {})
    },
    getPreproductionList () {
      this.$http.get(`/preproduction/preproductioninformation/list`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.preproductionList = res.data
      }).catch(() => {
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/product/product/', this.dataForm).then(({ data: res }) => {
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
<style>
  .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view{
    white-space: nowrap;
  }
  .el-scrollbar .el-scrollbar__wrap{overflow-x: hidden;}
</style>
