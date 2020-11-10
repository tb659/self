<template>
  <div id="nav">
    <el-row :gutter="20" style="margin: 0">
      <el-col id="line" :xs="8" :sm="4" :md="4" v-for="(i, $i) in arr">
        <a :href="'#'+i.path">{{i.title}}</a>
        <span class="nav_line" :style="{transform:$route.path.slice(0,4)==i.path?'scale(1)':'scale(0)'}"></span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ["nav_list"],
  data() {
    return {
      arr: this.nav_list,
      index: 0
    };
  }
};
</script>

<style>
	.nav_line {
		width: 100%;
		height: 2px;
		background: #000000;
		display: block;
		box-sizing: border-box;
		transition: .35s;
		transform: scale(0);
	}
	.el-col:hover .nav_line {
		transform: scale(1)!important;
	}
#nav .el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
#nav .el-col {
  border-radius: 4px;
}
#nav .bg-purple-dark {
  background: #99a9bf;
}
#nav .bg-purple {
  background: #d3dce6;
}
#nav .bg-purple-light {
  background: #e5e9f2;
}
#nav .grid-content {
  border-radius: 4px;
  min-height: 36px;
}
#nav .row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>