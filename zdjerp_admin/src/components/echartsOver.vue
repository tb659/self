<template>
  <div class="tableOne">
    <div class="title">生产车间</div>
    <el-row  class="elRows">
      <el-col :span="11" :offset="4">车间名称</el-col>
      <el-col :span="9" >完成情况</el-col>
    </el-row>
    <div class="tableOneTitle">
      <div v-for="(item,index) in itemList" :key="index">
        <div class="elRow" v-if="index%2==0">
          <div>
            <span class="span">{{item.content}}</span>
          </div>
          <div>{{item.name}}</div>
          <div>{{item.detail}}</div>
        </div>
        <div class="elRowChild" v-if="index%2==1">
          <div>
            <span class="span">{{item.content}}</span>
          </div>
          <div>{{item.name}}</div>
          <div>{{item.detail}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tableOne',
  data () {
    return {
      itemList: [
        { id: 1, content: 4, name: '车间一', detail: '60%' },
        { id: 2, content: 5, name: '车间二', detail: '80%' },
        { id: 3, content: 6, name: '车间三', detail: '100%' },
        { id: 4, content: 7, name: '车间四', detail: '50%' },
        { id: 5, content: 1, name: '车间五', detail: '92%' },
        { id: 6, content: 8, name: '车间六', detail: '23%' }
      ]
    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .tableOne{
    color:#fff;
    width:100%;
  }
  .tableOneTitle{
    max-height: 262px;
    overflow: auto;
  }
  .title{
    color:#2b94dc;
    font-size: 15px;
    font-weight: bold;
    margin-top:0.5rem;
  }
  .elRows{
    height: 40px;
    line-height: 40px;
    margin-top:0.7rem;
    border:0;
    font-size: 12px;
    padding:0rem 0.5rem ;
    text-align: center;
    background:linear-gradient(to right,rgba(25,199,185,1),rgba(6,94,87,1));
  }
  .elRow{
    border-bottom:1px solid rgba(0,0,0,0.4);
    font-size: 0.6rem;
    text-align: center;
    background:#012136;
    display: flex;
    justify-content: center;
  }
  .elRowChild{
    background:#09293e;
    border-bottom:1px solid rgba(0,0,0,0.4);
    font-size: 0.6rem;
    text-align: center;
    display: flex;
    justify-content: center;
  }
  .elRow div:first-child,.elRowChild div:first-child{
    border:0;
    width:13%;
    margin:0rem 1rem;
  }
  .elRow div:first-child .span,.elRowChild div:first-child .span{
    border:0;
    padding:0.3rem 0.55rem;
    border-radius: 5px;
    background:linear-gradient(to top,rgba(25,199,185,1),rgba(6,94,87,1));
  }
  .elRow div,.elRowChild div{
    border:0;
    width:35%;
    height: 40px;
    line-height: 40px;
    margin:0em 1rem;
    font-size: 12px;
  }
  .elRows:hover{
    cursor:pointer;
  }
  .elRow:hover{
    background:rgba(255,255,255,0.3);
    cursor:pointer;
    color: yellow;
  }
  .elRowChild:hover{
    background:rgba(133,150,259,0.4);
    cursor:pointer;
  }
</style>
