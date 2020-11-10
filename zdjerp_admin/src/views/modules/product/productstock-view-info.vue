<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false" width="70%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="产成品类型" prop="typeId">
            <el-input v-model="dataForm.type" :readonly="true" placeholder="物料类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="系统编码" prop="code">
            <el-input v-model="dataForm.code" :readonly="true" placeholder="系统编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="构件系列" prop="componentSeries">
            <el-input v-model="dataForm.componentSeries" :readonly="true" placeholder="构件系列"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="构件名称" prop="componentName">
            <el-input v-model="dataForm.componentName" :readonly="true" placeholder="构件名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位" prop="unit">
            <el-input v-model="dataForm.unit" :readonly="true" placeholder="单位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="重量" prop="weight">
            <el-input v-model="dataForm.weight" :readonly="true" placeholder="重量"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="dataForm.projectName" :readonly="true" placeholder="项目名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="适用部位" prop="useSite">
            <el-select v-model="dataForm.useSite" filterable clearable placeholder="适用部位" style="width: 100%;" disabled>
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
          <el-form-item label="外形尺寸" prop="outlineSize">
            <el-input v-model="dataForm.outlineSize" :readonly="true" placeholder="规格"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="标准图号" prop="standardDrawingNo">
            <el-input v-model="dataForm.standardDrawingNo" placeholder="标准图号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="混凝土强度" prop="concreteStrengthGrade">
            <el-select v-model="dataForm.concreteStrengthGrade" filterable clearable placeholder="混凝土强度等级" style="width: 100%;" disabled>
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
          <el-form-item label="制作单位" prop="productionUnit">
            <el-input v-model="dataForm.productionUnit" :readonly="true" placeholder="制作单位"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="楼号" prop="buildingNo">
            <el-input v-model="dataForm.buildingNo" :readonly="true" placeholder="楼号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="层号" prop="floorNo">
            <el-input v-model="dataForm.floorNo" :readonly="true" placeholder="层号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="批次" prop="batch">
            <el-input v-model="dataForm.batch" :readonly="true" placeholder="批次"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="长" prop="length">
            <el-input v-model="dataForm.length" :readonly="true" placeholder="长"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="宽" prop="width">
            <el-input v-model="dataForm.width" :readonly="true" placeholder="宽"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="高" prop="height">
            <el-input v-model="dataForm.height" :readonly="true" placeholder="高"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="浇筑日期" prop="castingDate">
            <el-input v-model="dataForm.castingDate" :readonly="true" placeholder="浇筑日期"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生产日期" prop="productionDate">
            <el-input v-model="dataForm.productionDate" :readonly="true" placeholder="生产日期"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="质量检验" prop="qualityInspection">
            <el-input v-model="dataForm.qualityInspection" :readonly="true" placeholder="质量检验"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="外观检验" prop="visualInspection">
            <el-input v-model="dataForm.visualInspection" :readonly="true" placeholder="外观检验"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生产负责人" prop="productionManager">
            <el-input v-model="dataForm.productionManager" :readonly="true" placeholder="生产负责人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="质检员" prop="qualityInspector">
            <el-input v-model="dataForm.qualityInspector" :readonly="true" placeholder="质检员"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="实验员" prop="experimenter">
            <el-input v-model="dataForm.experimenter" :readonly="true" placeholder="实验员"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" :readonly="true" placeholder="备注"></el-input>
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
      productTypeList: [],
      unitList: [],
      modelList: [],
      specificationsList: [],
      useSiteDictList: [],
      concreteStrengthGradeDictList: [],
      qualityInspectionDictList: [],
      visualInspectionDictList: [],
      productionManagerList: [],
      qualityInspectorList: [],
      experimenterList: [],
      dataForm: {
        id: '',
        typeId: '',
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
        qualityInspector: '',
        experimenter: '',
        productionUnit: '',
        remark: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        delFlag: ''
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        Promise.all([
          this.getUnitList(),
          this.getUseSiteDictList(),
          this.getConcreteStrengthGradeDictList(),
          this.getQualityInspectionDictList(),
          this.getVisualInspectionDictList(),
          this.getProductTypeList(),
          this.getUserList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
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
        params: { dictType: 'hntqddj' }
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
    // 获取信息
    getInfo () {
      this.$http.get(`/product/productstock/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        // 页面赋值
        this.productTypeList.forEach(item => {
          if (item.id === this.dataForm.typeId) {
            this.dataForm.type = item.name
          }
        })
        this.productionManagerList.forEach(item => {
          if (item.id === this.dataForm.productionManager) {
            this.dataForm.productionManager = item.realName
          }
        })
        this.qualityInspectorList.forEach(item => {
          if (item.id === this.dataForm.qualityInspector) {
            this.dataForm.qualityInspector = item.realName
          }
        })
        this.experimenterList.forEach(item => {
          if (item.id === this.dataForm.experimenter) {
            this.dataForm.experimenter = item.realName
          }
        })
        this.unitList.forEach(item => {
          if (item.id === this.dataForm.unit) {
            this.dataForm.unit = item.name
          }
        })
        this.useSiteDictList.forEach(item => {
          if (item.dictValue === this.dataForm.useSite) {
            this.dataForm.useSite = item.dictName
          }
        })
        this.concreteStrengthGradeDictList.forEach(item => {
          if (item.dictValue === this.dataForm.concreteStrengthGrade) {
            this.dataForm.concreteStrengthGrade = item.dictName
          }
        })
        this.qualityInspectionDictList.forEach(item => {
          if (item.dictValue === this.dataForm.qualityInspection) {
            this.dataForm.qualityInspection = item.dictName
          }
        })
        this.visualInspectionDictList.forEach(item => {
          if (item.dictValue === this.dataForm.visualInspection) {
            this.dataForm.visualInspection = item.dictName
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
