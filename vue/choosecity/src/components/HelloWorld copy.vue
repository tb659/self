<template>
  <div class="hello">
    <el-button type="primary" @click="showDialog">添加数据</el-button>
    <Tinymce />

    <div v-for="(item, itemIndex) in chooseList" :key="itemIndex">
      <div class="inline-bolck" v-for="privence in item" :key="privence.id">
        <span v-if="!Array.isArray(privence)">{{ privence.name }}</span>
        <span v-else>
          <b v-for="(city, cityIndex) in privence" :key="city.id">
            <i v-if="cityIndex === 0">{{ city.name }}(</i>
            <i v-if="cityIndex !== privence.length - 1 && cityIndex !== 0" class="gray">{{ city.name }}、</i>
            <i v-if="cityIndex === privence.length - 1" class="gray">{{ city.name }}</i>
          </b>
          <b>)</b>
        </span>
      </div>
      <span class="fn_btn" @click="edit(item)">编辑</span>
      <span class="fn_btn" @click="remove(item)">删除</span>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
      <div>
        <div class="privence" v-for="(privence, privenceIndex) in list" :key="privence.id" v-hover>
          <!-- <div class="privence" v-for="(privence, privenceIndex) in list" :key="privence.id" @mouseenter="curIndex = privenceIndex" @mouseleave="curIndex = -1"> -->
          <el-checkbox :indeterminate="privence.isIndeterminate" v-model="privence.checkAll" @change="privenceChange(privenceIndex)"> {{ privence.name }}</el-checkbox>
          <div class="city_cont">
            <div v-for="(city, cityIndex) in privence.children" :key="city.id">
              <el-checkbox v-model="city.isChecked" @change="cityChange(privenceIndex, cityIndex)"> {{ city.name }} </el-checkbox>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import list from '../city'
import Tinymce from '../components/Tinymce'
export default {
  components: { Tinymce },
  data() {
    return {
      dialogVisible: false,
      list: [],
      chooseList: []
    }
  },
  directives: {
    hover: {
      bind(el) {
        el.onmouseenter = function() {
          el.children[1].style.display = 'block'
        }
        el.onmouseleave = function() {
          el.children[1].style.display = 'none'
        }
      }
    }
  },

  methods: {
    edit(item) {
      this.dialogVisible = true
      console.log(item.data)
      debugger
      let tepArr = JSON.parse(JSON.stringify(this.chooseList))
      this.list = Object.assign(this.list, tepArr)
    },

    remove(item) {},

    handleChange() {
      let privences = []
      this.list.map((privence, privenceIndex) => {
        if (privence.checkAll) {
          privences.push(privence)
        }
        if (privence.isIndeterminate) {
          let cities = []
          privence.children.map(city => {
            if (city.isChecked) {
              cities.push(city)
            }
          })
          cities.unshift(privence)
          privences.push(cities)
        }
      })
      console.log(privences)
      this.chooseList.push(privences)
      this.dialogVisible = false
    },

    privenceChange(privenceIndex) {
      let privence = this.list[privenceIndex]
      privence.children.map(cities => {
        if (privence.checkAll) {
          // cities.isChecked = true
          this.$set(cities, 'isChecked', true)
        } else {
          // cities.isChecked = false
          this.$set(cities, 'isChecked', false)
        }
      })
    },

    cityChange(privenceIndex, cityIndex) {
      let privence = this.list[privenceIndex]
      let cities = privence.children
      let city = cities.filter(city => city.isChecked)
      if (city.length) {
        if (city.length !== cities.length) {
          this.$set(privence, 'isIndeterminate', true)
        } else {
          this.$set(privence, 'isIndeterminate', false)
          this.$set(privence, 'checkAll', true)
        }
      } else {
        this.$set(privence, 'isIndeterminate', false)
        this.$set(privence, 'checkAll', false)
      }
    },

    showDialog() {
      this.filterItem(this.list)
      this.dialogVisible = true
    },
    filterItem(list) {
      list.map((p, i) => {
        if (p.checkAll) {
          list.splice(i, 1)
          this.filterItem(list)
        } else if (p.isIndeterminate) {
          p.children.map((c, j) => {
            if (c.isChecked) {
              p.children.splice(j, 1)
              this.filterItem(list)
            } else {
              delete p.isIndeterminate
            }
          })
        }
      })
    }
  },
  mounted() {
    this.list = list.data[0]
    console.log(this.list)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
i,
b {
  font-weight: normal;
  font-style: normal;
}
.privence {
  display: inline-block;
  width: 120px;
  padding: 20px;
  position: relative;
}
.city_cont {
  width: 260px;
  position: absolute;
  padding: 20px;
  background-color: #fff;
  z-index: 2;
  border: 1px solid #000;
  border-radius: 10px;
  display: none;
}
.city_cont div {
  padding: 4px;
  display: inline-block;
}
.inline-bolck {
  display: inline-block;
  padding: 0 4px;
}
.gray {
  color: #999;
}
.fn_btn {
  display: inline-block;
  padding-left: 20px;
  cursor: pointer;
}
</style>
