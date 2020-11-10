<template>
  <div>
    <div class="list">
      <div style="width: 100%;height: 233px;overflow: hidden;">
        <a :href="'#/no31/'+list.type+'/'+list.name">
          <img v-hover style="width:100%;height:100%;transition: .35s;" :src="list.imgurl" alt />
        </a>
      </div>
      <div>{{list.name}}</div>
      <div>{{list.info}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["list_arr"],
  directives: {
    hover(a) {
      (a.onmouseenter = function() {
        this.style.transform = "scale(1.2)";
      }),
        (a.onmouseleave = function() {
          this.style.transform = "scale(1)";
        });
    }
  },
  data() {
    return {
      list: this.list_arr
    };
  }
};
</script>

<style>
.list {
  padding-top: 30px;
}

.list div {
  line-height: 40px;
}
</style>