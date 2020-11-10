<template>
  <div id="no2">
    <div style="overflow:hidden">
      <el-row>
        <el-col :xs="24" :sm="12" :md="12">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="float:left">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>品牌介绍</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12">
          <div class="list" style="float:right">
            <span
              v-for="(i, $i) in arr"
              @click="index=$i"
              :style="{'border-bottom':index==$i? '2px solid #000': ''}"
            >
              <a :href="i.path">{{i.title}}</a>
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--品牌简介-->
    <div>
      <div id="item" style="text-align:center">
        <h2>
          <a name="no2/1">
            <a href="#">品牌简介</a>
          </a>
        </h2>
        <p>ABOUT</p>
        <span></span>
      </div>
    </div>
    <div style="line-height: 28px;color:#aaa">
      <p>我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持打字传图、自由拖拽，不需要专业编写代码，也没有其他建站工具的层叠式烦恼，您可以随心所欲创建区块、添加组件。</p>
      <p>我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持打字传图、自由拖拽，不需要专业编写代码，也没有其他建站工具的层叠式烦恼，您可以随心所欲创建区块、添加组件。我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持打字传图、自由拖拽，不需要专业编写代码，也没有其他建站工具的层叠式烦恼，您可以随心所欲创建区块、添加组件。我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持打字传图、自由拖拽，不需要专业编写代码，也没有其他建站工具的层叠式烦恼，您可以随心所欲创建区块、添加组件…</p>
    </div>
    <!--合作伙伴-->
    <div>
      <div id="item" style="text-align:center">
        <h2>
          <a name="no2/2">
            <a href="#">合作伙伴</a>
          </a>
        </h2>
        <p>ABOUT</p>
        <span></span>
      </div>
      <el-row :gutter="40" style="padding:0 40px">
        <el-col :xs="8" :sm="4" :md="4" v-for="(i, $i) in part" style="padding: 0;overflow:hidden">
          <el-button type="text" @click="dialogVisible = true">
            <img width="100%" :src="i" alt style="transition: .35s" @click="imgClick($i)" />
          </el-button>
        </el-col>
        <el-dialog :visible.sync="dialogVisible" width="100%" :before-close="handleClose">
          <div class="block">
            <span
              @click="type=!type"
              :class="type?'el-icon-video-pause':'el-icon-video-play'"
              style="position:absolute;left:50%;top:10%;transform:translateX(-50%);font-size:30px;z-index:100"
            ></span>
            <el-carousel
              trigger="click"
              height="80vh"
              :autoplay="type"
              :initial-index="currentNum"
              v-if="changeDom"
            >
              <el-carousel-item v-for="item in part">
                <div style="position:raletive;background: rgba(0, 0, 0, 0.5);">
                  <img width="60%" height="100%" id="part_img" :src="item" alt />
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-dialog>
      </el-row>
    </div>
    <!--人才招聘-->
    <div>
      <div id="item" style="text-align:center">
        <h2>
          <a name="no2/3">
            <a href="#">人才招聘</a>
          </a>
        </h2>
        <p>RECRUIT</p>
        <span></span>
      </div>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" style="padding:30px">
          <div id="title">应聘岗位：</div>
          <div class="hr">
            <div>一、资格要求</div>
            <div class="hr_s">1.道德品质良好；</div>
            <div class="hr_s">2.身体健康；</div>
            <div class="hr_s">3.成绩优良，研究生须通过国家英语六级考试，本科生通过国家英语四级考试。</div>
          </div>
          <div class="hr">
            <div>二、招聘安排</div>
            <div class="hr_s">1.即日起接收简历投递，截止日期2016年12月31日；</div>
            <div class="hr_s">2.面试时间另行通知（具体时间以短信形式通知）。</div>
          </div>
          <div class="hr">
            <div>三、应聘方式</div>
            <div class="hr_s">1.登陆企业网站（www.xxx.com.cn），按要求成功投递电子报名表及登记表视为应聘有效，不接收纸质简历应聘</div>
            <div class="hr_s">2.应聘报名表和信息登记表请以同一邮件中两个附件的形式发送至邮箱：邮箱：123@163.com。</div>
            <div class="hr_s">3.人事处联系电话：0000-8888</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" style="padding:30px">
          <img
            width="100%"
            src="https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS81M2IxMDFjZTkxMDRiNzdjMmNiZDU2ZmRhYjQwYjU5NS00NDB4NTE2LnBuZw_p_p100_p_3D_p_p100_p_3D.png"
            alt
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import lunbo from "./../p/lunbo";
export default {
  components: {
    lunbo
  },
  methods: {
    handleClose(done) {
      done();
    },
    imgClick(index) {
      this.currentNum = index;
      this.changeDom = false;
      setTimeout(() => {
        this.changeDom = true;
      }, 0);
    }
  },
  data() {
    return {
      type: true,
      currentNum: 0,
      changeDom: true,
      dialogVisible: false,
      index: 0,
      arr: [
        {
          path: "#no2/1",
          title: "品牌简介"
        },
        {
          path: "#no2/2",
          title: "合作伙伴"
        },
        {
          path: "#no2/3",
          title: "人才招聘"
        }
      ],
      part: [
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDgvNGQ2MDZlYjQyMTQ2MDc3YzI5ZDMyMTQ1ZDU4NzJiYjgucG5n.png",
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDgvOTE0ZjQ0NGM5MmQ0NjdhZDUxODQ2MTk2OTRiYWNmMjMucG5n.png",
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDgvNzBjZDkxOTg3MzJmZGY4ZjNhMjQyZTA0OTM0YjBmM2QucG5n.png",
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDgvYjkyMzBiM2RmMTIxOTliNTRkNGJkNWRmNDkzNWE3ZTYucG5n.png",
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDgvYzZlMDNhZWMzNmQ4ODBiM2VmOGM3MzhmMWVlNTA3MTYucG5n.png",
        "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDgvZGI1OWE2NTUzYzQyYzI3ZTE3MDllYjY0OTg2NGE1ZWIucG5n.png"
      ]
    };
  }
};
</script>

<style>
#no2 .list {
  padding-top: 0;
}
#no2 .list span:hover {
  border-bottom: 2px solid #000;
}
#no2 .list span {
  display: inline-block;
  padding: 0 20px 20px;
}
#no2 a {
  color: #333;
}
#no2 h2 a {
  padding-top: 30px;
  display: block;
}
#no2 .hr .hr_s {
  color: #ccc;
  font-size: 14px;
  line-height: 30px;
}
#no2 .hr {
  padding: 30px;
}
#no2 .hr > div {
  line-height: 35px;
}
#no2 #title {
  font-size: 18px;
  margin-bottom: 20px;
}
#no2 #part_img {
  width: 30%;
  height: 30%;
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translateX(-50%);
}
#no2 .el-carousel {
  height: 100vh;
}
#no2 .el-dialog {
  margin: 0;
}
#no2 .el-dialog__header {
  position: absolute;
  z-index: 100;
  right: 20px;
}
#no2 .el-dialog {
  margin-top: 0 !important;
}
#no2 .el-dialog__body {
  padding: 0;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
  height: 100vh;
  background-color: #333 !important;
}
.el-carousel__item:nth-child(2n),
.el-carousel__item:nth-child(2n+1) {
  background-color: #333 !important;
}
#no2 {
  padding: 0 50px;
}
#no2 #item {
  padding: 30px;
}
#no2 #item h2 {
  font-weight: normal;
  line-height: 60px;
}
#no2 #item p {
  font-weight: normal;
  color: #ccc;
}
#no2 #item span {
  width: 40px;
  height: 2px;
  display: inline-block;
  background: #000;
}
</style>