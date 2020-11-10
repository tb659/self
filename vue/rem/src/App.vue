<template>
  <div id="app">
    <div class="title">品种库</div>
    <header>
      <input type="text" placeholder="请输入品种名" />
      <div class="tab">
        <div class="one" v-for="(item, index) in tab" :key="index">
          <div :class="['info', index == currentTab ? 'fw' : '']">{{ item }}</div>
          <div :class="index == currentTab ? 'bd' : ''"></div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      currentTab: 0,
      tab: ['主推品种', '专家推荐']
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.title {
  font-size: 66px;
  font-weight: bold;
  text-align: center;
  line-height: 162px;
}
header {
  height: 400px;
  background-color: #9dc02e;
  padding: 40px 65px;
  box-sizing: border-box;
}
input {
  width: 100%;
  height: 150px;
  background-color: #fff;
  border-radius: 15px;
  padding-left: 65px;
  box-sizing: border-box;
  font-size: 50px;
  line-height: 150px;
  border: none;
  outline: none;
}
.tab {
  padding: 60px 250px 0;
  display: flex;
  justify-content: space-between;
}
.tab .info {
  color: #fff;
  line-height: 140px;
  font-size: 60px;
}
.tab .info.fw {
  font-weight: bold;
}
.one .bd {
  height: 16px;
  background-color: #fff;
  border-radius: 15px;
}
</style>
