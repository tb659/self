<template>
  <el-tabs v-model="editableTabsValue">
    <el-tab-pane label="未生产" name="tab1">
      <tab-view1></tab-view1>
    </el-tab-pane>
    <el-tab-pane label="钢筋治安" name="tab2">
      <tab-view2></tab-view2>
    </el-tab-pane>
    <el-tab-pane label="钢筋终检" name="tab3">
      <tab-view3></tab-view3>
    </el-tab-pane>
    <el-tab-pane label="钢筋入模及模板验收" name="tab4">
      <tab-view4></tab-view4>
    </el-tab-pane>
    <el-tab-pane label="埋件验收" name="tab5">
      <tab-view5></tab-view5>
    </el-tab-pane>
    <el-tab-pane label="混凝土浇筑" name="tab6">
      <tab-view6></tab-view6>
    </el-tab-pane>
    <el-tab-pane label="拆模外观验收" name="tab7">
      <tab-view7></tab-view7>
    </el-tab-pane>
    <el-tab-pane label="成品入库" name="tab8">
      <tab-view8></tab-view8>
    </el-tab-pane>
    <el-tab-pane label="成品出库装车" name="tab9">
      <tab-view9></tab-view9>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import mixinViewModule from '@/mixins/view-module'
import TabView1 from './preproductioninformation-one'
import TabView2 from './preproductioninformation-two'
import TabView3 from './preproductioninformation-three'
import TabView4 from './preproductioninformation-four'
import TabView5 from './preproductioninformation-five'
import TabView6 from './preproductioninformation-six'
import TabView7 from './preproductioninformation-seven'
import TabView8 from './preproductioninformation-eight'
import TabView9 from './preproductioninformation-nine'
export default {
  // mixins: [mixinViewModule],
  data () {
    return {
      editableTabsValue: 'tab1'
    }
  },
  components: {
    TabView1, TabView2, TabView3, TabView4, TabView5, TabView6, TabView7, TabView8, TabView9
  }
}
</script>
