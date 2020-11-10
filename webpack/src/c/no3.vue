<template>
  <div id="no3">
    <div style="overflow:hidden;">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="float:left">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>产品中心</el-breadcrumb-item>
      </el-breadcrumb>
      <div style="float:right">
        <span style="padding: 0 20px" v-for="i in arr" @click="btn(i)">{{i}}</span>
      </div>
    </div>
    <el-row :gutter="20" v-loading="loading" margin:0>
      <el-col :xs="24" :sm="8" :md="8" v-for="i in list">
        <list_arr :list_arr="i" v-show="i.type==type"></list_arr>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import list_arr from "./../p/list.vue";
export default {
	components: {
		list_arr
	},
	methods: {
		btn(i) {
			this.loading = true;
			setTimeout(() => {
				this.type = i;
				this.loading = false;
			}, 1000);
		}
	},
	data() {
		return {
			loading: false,
			arr: ["冷冻生鲜", "加工产品", "农副产品"],
      type: "冷冻生鲜",
      list: [
        {
          type: "冷冻生鲜",
          imgurl:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDgvZjhiNTc2MDJkYzBiOTU5NWUxMzQzZWY4OWM4NDM2MTAtNDAweDIzMC5qcGc_p_p100_p_3D.jpg",
          name: "火腿",
          info: "可以对产品做一个简单介绍..."
        },
        {
          type: "冷冻生鲜",
          imgurl:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDgvZjIxNzEwNGU2ZGMyNGU2ZDZjY2QwODMzZGRiZmU2NjEtNDAweDIzMC5qcGc_p_p100_p_3D.jpg",
          name: "牛肩肉",
          info: "可以对产品做一个简单介绍..."
        },
        {
          type: "冷冻生鲜",
          imgurl:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDgvYzEzMTY1YmIzN2YwNWQxNjE0ODM1M2Q3NzJiNTNkYmYtNDAweDIzMC5qcGc_p_p100_p_3D.jpg",
          name: "牛百叶",
          info: "可以对产品做一个简单介绍..."
        },
        {
          type: "加工产品",
          imgurl:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDgvNzM1ZmQwM2VmZmFjYzRiMDZhODAxNGU3NzY2MmVmODItNDAweDIzMC5qcGc_p_p100_p_3D.jpg",
          name: "牛板筋",
          info: "可以对产品做一个简单介绍..."
        },
        {
          type: "农副产品",
          imgurl:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDgvOTFlY2U3MzRmMTVmZmVmNTY2NGJmOWE0YzAwZDUzMGYtNDAweDIzMC5qcGc_p_p100_p_3D.jpg",
          name: "牛棒骨",
          info: "可以对产品做一个简单介绍..."
        },
        {
          type: "农副产品",
          imgurl:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDgvZjIxNzEwNGU2ZGMyNGU2ZDZjY2QwODMzZGRiZmU2NjEtNDAweDIzMC5qcGc_p_p100_p_3D.jpg",
          name: "干巴肉",
          info: "可以对产品做一个简单介绍..."
        }
      ]
    };
  }
};
</script>

<style>
#no3 {
  padding: 0 50px;
}
</style>