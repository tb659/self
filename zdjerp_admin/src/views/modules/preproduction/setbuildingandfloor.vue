<template>
  <el-dialog :visible.sync="visible" title="批量设置楼层" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '110px'">
      <el-form-item label="楼号" prop="buildingNo">
        <el-input v-model="dataForm.buildingNo" placeholder="楼号" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="层号" prop="floorNo">
        <el-input v-model="dataForm.floorNo" placeholder="层号" maxlength="200"></el-input>
      </el-form-item>
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
      dataForm: {
        ids: [],
        productionUnit: '中电建（洛阳）装配式建筑科技有限公司',
        buildingNo: '',
        floorNo: ''
      }
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http.put('/preproduction/preproductioninformation/setbuildingandfloor', this.dataForm).then(({ data: res }) => {
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
