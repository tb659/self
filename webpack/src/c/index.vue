<template>
  <div id="index">
    <banner class="banner"></banner>
    <!--产品种类-->
    <el-row style="padding: 80px;">
      <el-col :xs="24" :sm="5" :md="5">
        <div
          style="font-family:宋体;font-size:24px;font-weight:normal;font-style:normal;color:#555555;padding:0 0 3px 0;display:block;padding:0 0 3px 0;vertical-align:bottom;"
        >产品分类</div>
        <div
          style="font-family:georgia;font-size:15px;font-weight:normal;font-style:normal;color:#aaaaaa;display:block;padding:2px;vertical-align:bottom;"
        >Food types</div>
        <div style="margin-top: 40px;">
          <div style="padding:20px" v-for="i in arr" @click="btn(i)">{{i}}</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="19" :md="19">
        <el-row :gutter="20" v-loading="loading">
          <el-col :xs="24" :sm="12" :md="12" v-for="i in list">
            <list_arr :list_arr="i" v-show="i.type==type"></list_arr>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!--品牌简介-->
    <el-row>
      <el-col class="item_l" :xs="24" :sm="12" :md="12">
        <div
          style="font-family:宋体;font-size:24px;font-weight:normal;font-style:normal;color:#555555;padding:0 0 3px 0;display:block;padding:0 0 3px 0;vertical-align:bottom;"
        >品牌简介</div>
        <div
          style="font-family:georgia;font-size:15px;font-weight:normal;font-style:normal;color:#aaaaaa;display:block;padding:2px;vertical-align:bottom;"
        >About us</div>
        <div style="padding: 30px 0;">
          <span
            style="font-size: 14px; color: rgb(153, 153, 153);"
          >当今最领先的响应式自助建站平台，我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。无论您是普通互联网用户， 还是专业网站制作人员，都能使用起飞页设计出最具专业水准的网站…</span>
        </div>
        <div>
          <a style="color: #999;text-decoration: none;" href="javascript:;">more ></a>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12">
        <img
          style="width:100%;height:100%"
          src="https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDkvNTllNzZkZmVhZTkyYTRkOWZkOTZmNzVkMjY0MGZlMWMuanBn.jpg"
          alt
        />
      </el-col>
    </el-row>
    <!--食品产业链-->
    <div>
      <el-row>
        <el-col style="padding: 60px 50px;">
          <div
            style="font-family:宋体;font-size:24px;font-weight:normal;font-style:normal;color:#555555;padding:0 0 3px 0;display:block;padding:0 0 3px 0;vertical-align:bottom;"
          >食品产业链</div>
          <div
            style="font-family:georgia;font-size:15px;font-weight:normal;font-style:normal;color:#aaaaaa;display:block;padding:2px;vertical-align:bottom;"
          >Industry chain</div>
        </el-col>
      </el-row>
      <el-row :gutter="50" style="padding: 0 100px;margin: 0">
        <el-col :xs="8" :sm="4" :md="4" v-for="i in logo" style="text-align: center;">
          <img style="width: 100%;height: 100%;margin-bottom: 20px;" :src="i.img" alt />
          <span style="padding: 10px 20px;background: #ccc;display: inline-block;">{{i.title}}</span>
        </el-col>
      </el-row>
    </div>
    <!--制作方法-->
    <div>
      <el-row>
        <el-col style="padding: 80px 50px;">
          <a href="#/no2?uid=1">
            <div
              style="font-family:宋体;font-size:24px;font-weight:normal;font-style:normal;color:#555555;padding:0 0 3px 0;display:block;padding:0 0 3px 0;vertical-align:bottom;"
            >制作方法</div>
            <div
              style="font-family:georgia;font-size:15px;font-weight:normal;font-style:normal;color:#aaaaaa;display:block;padding:2px;vertical-align:bottom;"
            >Cooking</div>
          </a>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12">
          <img
            style="width:100%;height:100%"
            src="https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDkvYTQ5MzMxNTA0ZGMyOTFlOGZhNzcwMWMwNTNmOGY4ZTEuanBn.jpg"
            alt
          />
        </el-col>
        <el-col class="item_l" :xs="24" :sm="12" :md="12">
          <div
            style="font-family:宋体;font-size:24px;font-weight:normal;font-style:normal;color:#555555;padding:0 0 3px 0;display:block;padding:0 0 3px 0;vertical-align:bottom;"
          >白切牛肉</div>
          <div
            style="font-family:georgia;font-size:15px;font-weight:normal;font-style:normal;color:#aaaaaa;display:block;padding:2px;vertical-align:bottom;"
          >原汁原味，酥烂香鲜</div>
          <div style="padding: 30px 0;">
            <span
              style="font-size: 14px; color: rgb(153, 153, 153);"
            >将牛腱子肉洗净，漂去血水，用沸水烫—次，放锅中，加清水淹没，置旺火上烧沸，撇去浮沫，加黄酒、八角、姜块(拍松)、葱段、精盐，盖严盖，移至小火上煮至酥烂，以筷子可以戳穿为好，端下锅晾凉，取出牛。将牛肉切成薄片，整齐地排在平盘中，将白酱油、味精、香油同放碗中调匀，浇在牛肉片上，撒上香菜段、红辣椒丝、蒜蓉，即可上桌。</span>
          </div>
          <div>
            <a style="color: #999;text-decoration: none;" href="javascript:;">more ></a>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--新闻资讯-->
    <div style="margin: 0 auto;width: 90%;">
      <el-row>
        <el-col style="padding: 80px 0px;">
          <div
            style="font-family:宋体;font-size:24px;font-weight:normal;font-style:normal;color:#555555;padding:0 0 3px 0;display:block;padding:0 0 3px 0;vertical-align:bottom;"
          >新闻资讯</div>
          <div
            style="font-family:georgia;font-size:15px;font-weight:normal;font-style:normal;color:#aaaaaa;display:block;padding:2px;vertical-align:bottom;"
          >News</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12">
          <news style="background:#eee;padding:50px 40px">
            <img
              slot="img"
              style="width: 100%;"
              src="https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDkvOTliZmYyNDViZmVmNWM0ZjVlMWZkYTcyNWM2NjRhNDMtNjAweDM3MC5qcGc_p_p100_p_3D.jpg"
              alt
            />
            <div slot="new1">全国粮改饲技术创新与推广...</div>
            <div slot="new2">我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。无论您是普...</div>
          </news>
        </el-col>

        <el-col id="dong_arr" :xs="24" :sm="12" :md="12" style="padding: 0 60px;">
          <news v-for="i in dong_arr">
            <div slot="new1">{{i.title}}</div>
            <div slot="new2">{{i.cont}}</div>
          </news>
        </el-col>
      </el-row>
    </div>
    <!--客户评价-->
    <div style="padding:0 80px;margin-bottom:50px">
      <el-row>
        <el-col style="padding: 80px 0px;">
          <div
            style="font-family:宋体;font-size:24px;font-weight:normal;font-style:normal;color:#555555;padding:0 0 3px 0;display:block;padding:0 0 3px 0;vertical-align:bottom;"
          >客户评价</div>
          <div
            style="font-family:georgia;font-size:15px;font-weight:normal;font-style:normal;color:#aaaaaa;display:block;padding:2px;vertical-align:bottom;"
          >Customer comments</div>
        </el-col>
      </el-row>

      <el-row :gutter="40">
        <el-col :xs="24" :sm="12" :md="12" v-for="i in list_arr" style="margin: 20px 0">
          <guide>
            <img v-hover width="100%" slot="img" :src="i.img" alt />
            <div slot="title">{{i.title}}</div>
            <div slot="cont">{{i.cont}}</div>
          </guide>
        </el-col>
      </el-row>
    </div>
    <!--合作伙伴-->
    <div style="padding: 0 50px;margin-bottom:100px">
      <el-row :gutter="40">
        <el-col :span="4" v-for="i in part" style="padding: 0 20px ;overflow:hidden">
          <img v-hover :src="i" alt style="width:100%;transition: .35s" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import banner from "./banner";
import list_arr from "./../p/list.vue";
import news from "./../p/news";
import guide from "./../p/guide.vue";

export default {
  components: {
    banner,
    list_arr,
    news,
    guide
  },
  directives: {
    hover(a) {
      a.style.transition = ".35s";
      (a.onmouseenter = function() {
        this.style.transform = "scale(1.2)";
      }),
        (a.onmouseleave = function() {
          this.style.transform = "scale(1)";
        });
    }
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
      ],
      logo: [
        {
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS8wYzJmZWY4NmNlZGNkZjI1NjE3YzFmZTE3M2NiM2Y5MTEtMzAweDMwMC5wbmc_p_p100_p_3D.png",
          title: "农场养殖"
        },
        {
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS8wYzJmZWY4NmNlZGNkZjI1NjE3YzFmZTE3M2NiM2Y5MTItMzAweDMwMC5wbmc_p_p100_p_3D.png",
          title: "饲料加工"
        },
        {
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS82ZWU5NmE5NjJkZDQ5ZThiMGQ3NDlkNjM2ODdjYzAyNC0zMDB4MzAwLnBuZw_p_p100_p_3D_p_p100_p_3D.png",
          title: "屠宰分割"
        },
        {
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS8wYzJmZWY4NmNlZGNkZjI1NjE3YzFmZTE3M2NiM2Y5MTUtMzAweDMwMC5wbmc_p_p100_p_3D.png",
          title: "质量检验"
        },
        {
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS8wYzJmZWY4NmNlZGNkZjI1NjE3YzFmZTE3M2NiM2Y5MS0zMDB4MzAwLnBuZw_p_p100_p_3D_p_p100_p_3D.png",
          title: "加工包装"
        },
        {
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cDovLzViOTczMmY5OTQzYzcudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxOC8wOS8wYzJmZWY4NmNlZGNkZjI1NjE3YzFmZTE3M2NiM2Y5MTQtMzAweDMwMC5wbmc_p_p100_p_3D.png",
          title: "物流配送"
        }
      ],
      dong_arr: [
        {
          cont:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。无论您是普...",
          title: "畜牧养牛产业全面覆盖助力...",
          uid: 1
        },
        {
          cont:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。无论您是普...",
          title: "发展生态畜牧业,是对草原...",
          uid: 2
        },
        {
          cont:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。无论您是普...",
          title: "2017全国绿色养殖发展...",
          uid: 3
        }
      ],
      list_arr: [
        {
          cont:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。无论您是普...",
          title: "肉质鲜嫩，口感很不错",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDkvYThhOGZlNzU3YzRlOTlmYzgyMzJkMjA4N2MwZTc0ZGQucG5n.png"
        },
        {
          cont:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。无论您是普...",
          title: "肉质鲜嫩，口感很不错",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDkvNmVlMDc4ZTZkNWM2ZjRkZGI3OGY4OTNkNTlmNzI0YWQucG5n.png"
        },
        {
          cont:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。无论您是普...",
          title: "肉质鲜嫩，口感很不错",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDkvODYxNWY0NjAzODhmMWUxYzdkNDUwOWFmNDk0M2I0ZTMucG5n.png"
        },
        {
          cont:
            "我们的流线式网页布局设计方案和可视化图文内容编辑模式让网站制作和维护成为一件轻松惬意的事。无论您是普...",
          title: "肉质鲜嫩，口感很不错",
          img:
            "https://ccdn.goodq.top/caches/bb156c34ab1478d4698faf5d9b1fed10/aHR0cHM6Ly81Yjk3MzJmOTk0M2M3LnQ3My5xaWZlaXllLmNvbS9xZnktY29udGVudC91cGxvYWRzLzIwMTgvMDkvZmQwODk0MTQyZTczNDkzODA1ZTZmN2MwNWU5YjcwNzgucG5n.png"
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
#ping {
  margin-bottom: 20px;
}

#index .year {
  border-bottom: 1px solid #333;
  padding-bottom: 5px;
  display: inline-block;
  margin-bottom: 5px;
}

.item_l {
  padding: 100px;
  background: #eee;
}
</style>