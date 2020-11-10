<template>
  <div id="no4">
    <div style="overflow:hidden;">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="float:left">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资讯动态</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="list" style="float:right">
        <span
           v-for="i in arr"
          @click="btn(i)"
          :style="{ 'border-bottom': i == type ? '2px solid #000' : '' }"
        >
          {{ i }}
        </span>
      </div>
    </div>
    <el-row style="padding:30px" v-loading="loading">
      <no4_msg v-for="i in page" v-hover>
        <div slot="title">
          <a :href="'#/no41/' + i.type + '/' + i.title + '/' + i.uid">{{
            i.title
          }}</a>
        </div>
        <div slot="info">{{ i.info }}</div>
        <img slot="img" :src="i.img" width="100%" alt />
      </no4_msg>
    </el-row>
    <div class="page">
      <li @click="prev">上一页</li>
      <li
        v-for="(i, $i) in num"
        @click="index = $i"
        :style="{ color: index == $i ? 'red' : '' }"
      >
        {{ i }}
      </li>
      <li @click="next">下一页</li>
    </div>
  </div>
</template>

<script>
import no4_msg from "./../p/no4_msg.vue";
export default {
  components: {
    no4_msg
  },
  computed: {
    num() {
      this.news.splice(0);
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].type == this.type) {
          this.news.push(this.list[i]);
        }
      }
      var num = Math.ceil(this.news.length / 2);
      return num;
    },
    page() {
      var a = this.news.slice(this.index * 2, this.index * 2 + 2);
      return a;
    }
  },
  watch: {
    type(a) {
      this.index = 0;
    }
  },
  methods: {
    prev() {
      this.index--;
      if (this.index <= 0) {
        this.index = 0;
      }
    },
    next() {
      this.index++;
      if (this.index >= this.num - 1) {
        this.index = this.num - 1;
      }
    },
    btn(i) {
      this.loading = true;
      setTimeout(() => {
        this.type = i;
        this.loading = false;
      }, 1000);
    }
  },
  directives: {
    hover(a) {
      var img = a.querySelector("img");
      var item = a.querySelector(".item");
      img.style.transition = ".5s";
      item.style.transition = ".5s";
      (a.onmouseenter = function() {
        img.style.transform = "scale(1.2)";
        item.style.left = "20px";
      }),
        (a.onmouseleave = function() {
          img.style.transform = "scale(1)";
          item.style.left = "0";
        });
    }
  },
  data() {
    return {
      news: [],
      loading: false,
      index: 0,
      type: "公司新闻",
      arr: ["公司新闻", "行业资讯"],
      list: [
        {
          uid: 1,
          type: "公司新闻",
          title: "保质保鲜",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS85OWJmZjI0NWJmZWY1YzRmNWUxZmRhNzI1YzY2NGE0My0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        },
        {
          uid: 2,
          type: "公司新闻",
          title: "物美价廉",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS9mZDA4OTQxNDJlNzM0OTM4MDVlNmY3YzA1ZTliNzA3OC0yMDB4MTIzLnBuZw_p_p100_p_3D_p_p100_p_3D.png"
        },
        {
          uid: 3,
          type: "公司新闻",
          title: "火腿很有嚼劲",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS8xZmQ3YjI0NjlkMGJmYzNkODM1NDU2OTJkNzEzNDk2Yy0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        },
        {
          uid: 4,
          type: "公司新闻",
          title: "内质鲜嫩，口感非常好",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS84ZDcyYzkwY2YzMDJkNmYwNmQyNzk2MWNiYjEwOWM5Ny0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        },
        {
          uid: 5,
          type: "公司新闻",
          title: "新疆畜牧业加强推广“四良一规范”",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS85OWJmZjI0NWJmZWY1YzRmNWUxZmRhNzI1YzY2NGE0My0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        },
        {
          uid: 6,
          type: "行业资讯",
          title: "火腿很有嚼劲",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS8xZmQ3YjI0NjlkMGJmYzNkODM1NDU2OTJkNzEzNDk2Yy0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        },
        {
          uid: 7,
          type: "行业资讯",
          title: "内质鲜嫩，口感非常好",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS84ZDcyYzkwY2YzMDJkNmYwNmQyNzk2MWNiYjEwOWM5Ny0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        },
        {
          uid: 8,
          type: "行业资讯",
          title: "新疆畜牧业加强推广“四良一规范”",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS85OWJmZjI0NWJmZWY1YzRmNWUxZmRhNzI1YzY2NGE0My0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        },
        {
          uid: 9,
          type: "行业资讯",
          title: "传统农牧业70年的现代重构",
          info:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。起飞页提供了海量精美网站模板和成品网站，起飞页的核心竞争力来自于它集流线式布局方案与可视化内容编辑于一体，支持...",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS9jMmFmMzc5ZGMwNmQwMTA0OTRmYmU1ZmZjNzA0NzhkMS0yMDB4MTIzLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg"
        }
      ]
    };
  }
};
</script>

<style>
#no4 .page li {
  padding: 5px 10px;
  float: left;
  border: 1px solid #000;
  margin: 0 5px;
}
#no4 .page {
  overflow: hidden;
  list-style: none;
}
#no4 .list {
  padding-top: 0;
}
#no4 .list span:hover {
  border-bottom: 2px solid #000;
}
#no4 .list span {
  display: inline-block;
  padding: 0 20px 20px;
}
#no4 {
  padding: 0 50px;
}
</style>
