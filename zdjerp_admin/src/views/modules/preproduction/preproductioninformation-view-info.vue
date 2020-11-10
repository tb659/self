<template>
  <el-dialog :visible.sync="visible" title="查看" :close-on-click-modal="false" :close-on-press-escape="false" width="65%">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
      <el-row>
        <el-col :span="8">
          <el-form-item label="构件类型" prop="componentType">
            <el-select v-model="dataForm.componentType" placeholder="构件类型" style="width: 100%;" disabled>
              <el-option
                v-for="item in componentTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="系统编码" prop="systemCoding">
            <el-input v-model="dataForm.systemCoding" placeholder="系统编码" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="构件系列" prop="componentSeries">
            <el-input v-model="dataForm.componentSeries" placeholder="构件系列" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="构件名称" prop="componentName">
            <el-input v-model="dataForm.componentName" placeholder="构件名称" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="外形尺寸" prop="outlineSize">
            <el-input v-model="dataForm.outlineSize" placeholder="外形尺寸" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生产数量" prop="quantity">
            <el-input-number v-model="dataForm.quantity" controls-position="right" :min="1" placeholder="生产数量" disabled></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="标注图号" prop="standardDrawingNo">
            <el-input v-model="dataForm.standardDrawingNo" placeholder="标注图号" readonly></el-input>
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
          <el-form-item label="重量" prop="amount">
            <el-input v-model="dataForm.amount" placeholder="重量" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目名称" prop="productName">
            <el-input v-model="dataForm.productName" placeholder="项目名称" readonly></el-input>
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
          <el-form-item label="生产日期" prop="productionDate">
            <el-date-picker v-model="dataForm.productionDate" type="date" style="width: 100%" value-format="yyyy-MM-dd" placeholder="生产日期" readonly></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="楼号" prop="buildingNo">
            <el-input v-model="dataForm.buildingNo" placeholder="楼号" maxlength="200" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="层号" prop="floorNo">
            <el-input v-model="dataForm.floorNo" placeholder="层号" maxlength="200" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="制作单位" prop="productionUnit">
        <el-input v-model="dataForm.productionUnit" placeholder="制作单位" readonly></el-input>
      </el-form-item>
    </el-form>
    <el-table :data="stepFirst" border style="width: 100%;">
      <el-table-column label="钢筋制安">
        <el-table-column prop="qualified" header-align="center" align="center" label="是否合格">
          <template slot-scope="scope">
            <template v-if="scope.row.qualified === 0">合格</template>
            <template v-if="scope.row.qualified === 1">不合格</template>
          </template>
        </el-table-column>
        <el-table-column prop="personnel" show-overflow-tooltip label="生产人员" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" show-overflow-tooltip label="时间" header-align="center" align="center"></el-table-column>
      </el-table-column>
    </el-table>
    <el-table :data="stepSecond" border style="width: 100%;">
      <el-table-column label="钢筋终检">
        <el-table-column prop="qualified" header-align="center" align="center" label="是否合格">
          <template slot-scope="scope">
            <template v-if="scope.row.qualified === 0">合格</template>
            <template v-if="scope.row.qualified === 1">不合格</template>
          </template>
        </el-table-column>
        <el-table-column prop="personnel" show-overflow-tooltip label="验收人员" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" show-overflow-tooltip label="时间" header-align="center" align="center"></el-table-column>
      </el-table-column>
    </el-table>
    <el-table :data="stepThird" border style="width: 100%;">
      <el-table-column label="钢筋入模及模板验收">
        <el-table-column prop="qualified" header-align="center" align="center" label="是否合格">
          <template slot-scope="scope">
            <template v-if="scope.row.qualified === 0">合格</template>
            <template v-if="scope.row.qualified === 1">不合格</template>
          </template>
        </el-table-column>
        <el-table-column prop="personnel" show-overflow-tooltip label="验收人员" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" show-overflow-tooltip label="时间" header-align="center" align="center"></el-table-column>
      </el-table-column>
    </el-table>
    <el-table :data="stepFourth" border style="width: 100%;">
      <el-table-column label="埋件验收">
        <el-table-column prop="qualified" header-align="center" align="center" label="是否合格">
          <template slot-scope="scope">
            <template v-if="scope.row.qualified === 0">合格</template>
            <template v-if="scope.row.qualified === 1">不合格</template>
          </template>
        </el-table-column>
        <el-table-column prop="personnel" show-overflow-tooltip label="验收人员" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" show-overflow-tooltip label="时间" header-align="center" align="center"></el-table-column>
      </el-table-column>
    </el-table>
    <el-table :data="stepFifth" border style="width: 100%;">
      <el-table-column label="混凝土浇筑">
        <el-table-column prop="qualified" header-align="center" align="center" label="是否合格">
          <template slot-scope="scope">
            <template v-if="scope.row.qualified === 0">合格</template>
            <template v-if="scope.row.qualified === 1">不合格</template>
          </template>
        </el-table-column>
        <el-table-column prop="personnel" show-overflow-tooltip label="生产人员" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" show-overflow-tooltip label="时间" header-align="center" align="center"></el-table-column>
      </el-table-column>
    </el-table>
    <el-table :data="stepSixth" border style="width: 100%;">
      <el-table-column label="拆模外观验收">
        <el-table-column prop="qualified" header-align="center" align="center" label="是否合格">
          <template slot-scope="scope">
            <template v-if="scope.row.qualified === 0">合格</template>
            <template v-if="scope.row.qualified === 1">不合格</template>
          </template>
        </el-table-column>
        <el-table-column prop="personnel" show-overflow-tooltip label="验收人员" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" show-overflow-tooltip label="时间" header-align="center" align="center"></el-table-column>
      </el-table-column>
    </el-table>
    <el-table :data="stepSeventh" border style="width: 100%;">
      <el-table-column label="成品入库">
        <el-table-column prop="date" header-align="center" align="center" label="入库日期"></el-table-column>
        <el-table-column prop="locationName" show-overflow-tooltip label="入库位置" header-align="center" align="center"></el-table-column>
        <el-table-column prop="personnel" show-overflow-tooltip label="入库人员" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" show-overflow-tooltip label="时间" header-align="center" align="center"></el-table-column>
      </el-table-column>
    </el-table>
    <el-table :data="stepEighth" border style="width: 100%;">
      <el-table-column label="成品出库装车">
        <el-table-column prop="personnel" header-align="center" align="center" label="出库人员"></el-table-column>
        <el-table-column prop="transportPersonnel" show-overflow-tooltip label="运输人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="licensePlate" show-overflow-tooltip label="车牌号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="transportDate" show-overflow-tooltip label="运输时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="location" show-overflow-tooltip label="收货地点" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" show-overflow-tooltip label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" show-overflow-tooltip label="时间" header-align="center" align="center"></el-table-column>
      </el-table-column>
    </el-table>
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
      componentTypeList: [],
      modelList: [],
      specificationList: [],
      useSiteDictList: [],
      concreteStrengthGradeDictList: [],
      dataForm: {
        id: '',
        componentType: '',
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
        stepFirst: {},
        stepSecond: {},
        stepThird: {},
        stepFourth: {},
        stepFifth: {},
        stepSixth: {},
        stepSeventh: {},
        stepEighth: {}
      },
      stepFirst: [],
      stepSecond: [],
      stepThird: [],
      stepFourth: [],
      stepFifth: [],
      stepSixth: [],
      stepSeventh: [],
      stepEighth: []
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.getComponentTypeList()
        this.getModelList()
        this.getSpecificationList()
        this.getUseSiteDictList()
        this.getConcreteStrengthGradeDictList()
        this.$refs['dataForm'].resetFields()
        this.stepFirst = []
        this.stepSecond = []
        this.stepThird = []
        this.stepFourth = []
        this.stepFifth = []
        this.stepSixth = []
        this.stepSeventh = []
        this.stepEighth = []
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
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
        if (res.data.stepFirst) {
          this.stepFirst.push(res.data.stepFirst)
        }
        if (res.data.stepSecond) {
          this.stepSecond.push(res.data.stepSecond)
        }
        if (res.data.stepThird) {
          this.stepThird.push(res.data.stepThird)
        }

        if (res.data.stepFourth) {
          this.stepFourth.push(res.data.stepFourth)
        }

        if (res.data.stepFifth) {
          this.stepFifth.push(res.data.stepFifth)
        }

        if (res.data.stepSixth) {
          this.stepSixth.push(res.data.stepSixth)
        }
        if (res.data.stepSeventh) {
          this.stepSeventh.push(res.data.stepSeventh)
        }
        if (res.data.stepEighth) {
          this.stepEighth.push(res.data.stepEighth)
        }
      }).catch(() => {})
    }
  }
}
</script>
