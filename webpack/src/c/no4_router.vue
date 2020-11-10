<template>
  <div id="no41">
    <div style="overflow:hidden;margin-bottom:40px">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="float:left">
        <el-breadcrumb-item :to="{ path: '/no4' }">{{$route.path.split('/')[2]}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$route.path.split('/')[3]}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="50">
      <el-col :xs="24" :sm="18" :md="18">
        <h2>{{$route.path.split('/')[3]}}</h2>
        <div>
          <div v-for="i in list" v-show="$route.path.split('/')[4]==i.uid">
            <div style="padding:20px 0 30px">{{i.date}}</div>
            <div style="line-height:30px">{{i.info}}</div>
          </div>
        </div>

        <div style="padding-top:40px" @click="$router.go(-1)">上一篇</div>
      </el-col>
      <el-col :xs="24" :sm="6" :md="6">
        <div>
          <div v-for="i in list">
            <div
              class="item"
              v-show="$route.path.split('/')[2]==i.type&&$route.path.split('/')[4]!=i.uid"
              style="padding: 20px;border-bottom:1px solid #ccc;line-height:30px"
            >
              <div style="text-overflow:ellipsis ;white-space:nowrap;overflow:hidden">
                <a :href="'#/no41/'+i.type+'/'+i.title+'/'+i.uid">{{i.title}}</a>
              </div>
              <div>{{i.date}}</div>
            </div>
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
      list: [
        {
          uid: 1,
          date: "2018-10-23",
          type: "公司新闻",
          title: "保质保鲜",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS85OWJmZjI0NWJmZWY1YzRmNWUxZmRhNzI1YzY2NGE0My0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        },
        {
          uid: 2,
          date: "2018-10-17",
          type: "公司新闻",
          title: "物美价廉",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS9mZDA4OTQxNDJlNzM0OTM4MDVlNmY3YzA1ZTliNzA3OC0yMDB4MTIzLnBuZw_p_p100_p_3D_p_p100_p_3D.png"
        },
        {
          uid: 3,
          date: "2018-10-17",
          type: "公司新闻",
          title: "火腿很有嚼劲",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS8xZmQ3YjI0NjlkMGJmYzNkODM1NDU2OTJkNzEzNDk2Yy0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        },
        {
          uid: 4,
          date: "2018-10-17",
          type: "公司新闻",
          title: "内质鲜嫩，口感非常好",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS84ZDcyYzkwY2YzMDJkNmYwNmQyNzk2MWNiYjEwOWM5Ny0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        },
        {
          uid: 5,
          date: "2018-10-16",
          type: "公司新闻",
          title: "新疆畜牧业加强推广“四良一规范”",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS85OWJmZjI0NWJmZWY1YzRmNWUxZmRhNzI1YzY2NGE0My0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        },
        {
          uid: 6,
          date: "2018-10-14",
          type: "行业资讯",
          title: "火腿很有嚼劲",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS8xZmQ3YjI0NjlkMGJmYzNkODM1NDU2OTJkNzEzNDk2Yy0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        },
        {
          uid: 7,
          date: "2018-10-14",
          type: "行业资讯",
          title: "内质鲜嫩，口感非常好",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS84ZDcyYzkwY2YzMDJkNmYwNmQyNzk2MWNiYjEwOWM5Ny0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        },
        {
          uid: 8,
          date: "2018-10-04",
          type: "行业资讯",
          title: "新疆畜牧业加强推广“四良一规范”",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS85OWJmZjI0NWJmZWY1YzRmNWUxZmRhNzI1YzY2NGE0My0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        },
        {
          uid: 9,
          date: "2018-10-04",
          type: "行业资讯",
          title: "传统农牧业70年的现代重构",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS9jMmFmMzc5ZGMwNmQwMTA0OTRmYmU1ZmZjNzA0NzhkMS0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
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
#no41 {
  padding: 0 50px;
  text-overflow: ;
}
</style>