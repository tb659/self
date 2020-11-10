<template>
  <div id="app" v-cloak>
    <div class="header" :style="{position: $route.path=='/'?'absolute':''}">
      <div style="text-align:center;padding-top:20px">
        <img
          style="margin: 0 auto"
          src="https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDgvNDA5ZGI4ZjgzODFlOTMwNTJlMzUzNzNkMTI2ZTMwMzYucG5n.png"
          alt
        />
      </div>
      <div
        style="min-height:80px;border-bottom:1px solid #ccc;padding: 0 10%;line-height:80px;text-align:center"
      >
        <nav_list :nav_list="nav_arr"></nav_list>
      </div>
    </div>
    <div style="min-height:500px;;margin-bottom:50px;padding:">
      <router-view></router-view>
    </div>
    <!--页尾-->
    <div style="margin:0  80px">
      <el-row :gutter="50" style="min-height:150px;padding:80px 0 ; border-top:1px solid #ccc">
        <el-col style="margin-bottom:50px" class="footer" :xs="24" :sm="8" :md="8">
          <h3 style="margin-bottom:30px">品牌生鲜网站</h3>
          <p>地址：苏州市工业园区金鸡湖大道099号大厦</p>
          <p>电话：000-66668888</p>
          <p>手机：12345678911</p>
          <p>传真：000-66668888</p>
          <p>邮箱：website@qq.com</p>
          <div class="qfy-icon">
            <div class="qfy-icon1"></div>
            <div class="qfy-icon2"></div>
            <div class="qfy-icon3"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="16" :md="16">
          <el-row :gutter="20" style="margin-bottom:50px">
            <el-col :span="8">
              <el-input placeholder="姓名" clearable v-model="val1"></el-input>
            </el-col>
            <el-col :span="8">
              <el-input placeholder="电话" clearable v-model="val2"></el-input>
            </el-col>
            <el-col :span="8">
              <el-input placeholder="邮箱" clearable v-model="val3"></el-input>
            </el-col>
          </el-row>
          <div>
            <el-input type="textarea" :rows="2" placeholder="内容" v-model="val4"></el-input>
          </div>
          <div class="submit">提交</div>
        </el-col>
      </el-row>
    </div>
    <top></top>
  </div>
</template>

<script>
import nav_list from "./c/nav.vue";
import top from "./p/top.vue";
export default {
  name: "app",
  components: {
    nav_list,
    top
  },
  data() {
    return {
      val1: "",
      val2: "",
      val3: "",
      val4: "",
      nav_arr: [
        {
          path: "/",
          title: "首页"
        },
        {
          path: "/no2",
          title: "品牌介绍"
        },
        {
          path: "/no3",
          title: "产品中心"
        },
        {
          path: "/no4",
          title: "资讯动态"
        },
        {
          path: "/no5",
          title: "养殖基地"
        },
        {
          path: "/no6",
          title: "联系我们"
        }
      ]
    };
  }
};
</script>

<style>
img {
  display: block;
}
.submit {
  width: 100px;
  text-align: center;
  line-height: 40px;
  background: #ccc;
  margin-top: 30px;
}

.qfy-icon div {
  background-image: url(//fast.qifeiye.com/FeiEditor/images/icon/social_icon_24x24.png);
  background-repeat: no-repeat;
  height: 24px;
  width: 24px;
  display: inline-block;
  background-position: 0 0;
  margin-right: 20px;
  margin-top: 20px;
}

.qfy-icon .qfy-icon1 {
  background-position-y: -96px;
  background-position-x: -48px;
}

.qfy-icon .qfy-icon2 {
  background-position-y: -96px;
}

.qfy-icon .qfy-icon3 {
  background-position-y: -96px;
  background-position-x: -24px;
}

.el-textarea textarea,
.el-input__inner {
  border: none;
  border-bottom: 1px solid #ccc;
  border-radius: 0;
}

.footer {
  font-size: 14px;
  color: #999;
}

.footer p {
  line-height: 30px;
}

.header {
  width: 100%;
  z-index: 10;
  margin-bottom: 40px;
}

[v-cloak] {
  display: none;
}

* {
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
}
</style>