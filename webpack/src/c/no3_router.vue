<template>
  <div id="no31">
    <div style="overflow:hidden;margin-bottom:40px">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="float:left">
        <el-breadcrumb-item :to="{ path: '/no3' }">{{$route.path.split("/")[2]}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$route.path.split("/")[3]}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row>
      <el-col :xs="24" :sm="14" :md="14">
        <div class="block">
          <el-carousel height="80vh">
            <el-carousel-item v-for="item in arr">
              <img width="100%" height="100%" :src="item" alt />
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-col>
      <el-col :xs="24" :sm="10" :md="10" style="padding: 50px 80px">
        <h2 style="line-height:  50px">{{$route.path.split("/")[3]}}</h2>
        <div style="color:#666">位于牛的前肩胛部，肉质鲜嫩</div>
        <ul style="padding-top:40px">
          <li>营养价值：</li>
        </ul>
        <div style="color:#666">
          牛肩肉含有优质蛋白，氨基酸种类齐全，肌氨酸比任何食物都高。牛肩肉的脂肪含量很低，是亚油酸来源，还是潜在的抗氧化剂。牛肩肉含矿物质和烟酸，维生素B1和核黄素等。是铁质的最佳来源。牛肩肉还含肉毒碱，能增长肌肉。
          保存方法：
        </div>
        <ul style="padding-top:40px">
          <li>保存方法：</li>
        </ul>
        <div style="color:#666">请存放在10℃以下</div>
      </el-col>
    </el-row>
    <div style="padding:50px 0">相关推荐：</div>
    <el-row :gutter="40">
      <el-col :xs="12" :sm="6" :md="6" v-for="i in list" style="text-align:center">
        <div v-show="i.name!=$route.path.split('/')[3]">
          <img width="100%" :src="i.imgurl" alt />
          <div style="line-height:40px">
            <a :href="'#/no31/'+i.type+'/'+i.name">{{i.name}}</a>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      arr: [
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOC8xMzE4ODlhZTEwYjI5NWFiOGI5ZWNiYzM3ZTczMGNkZS03MDB4NTI0LmpwZw_p_p100_p_3D_p_p100_p_3D.jpg",
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOC9mMjE3MTA0ZTZkYzI0ZTZkNmNjZDA4MzNkZGJmZTY2MS03MDB4NTI0LmpwZw_p_p100_p_3D_p_p100_p_3D.jpg",
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOC8xMzE4ODlhZTEwYjI5NWFiOGI5ZWNiYzM3ZTczMGNkZS03MDB4NTI0LmpwZw_p_p100_p_3D_p_p100_p_3D.jpg",
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOC9mMjE3MTA0ZTZkYzI0ZTZkNmNjZDA4MzNkZGJmZTY2MS03MDB4NTI0LmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
      ],
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
        }
      ]
    };
  },
  mounted() {
    this.$router.afterEach((to, from, next) => {
      window.scrollTo(0, 0);
    });
  }
};
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

#no31 .el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

#no31 .el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

#no31 {
  padding: 0 50px;
}
</style>