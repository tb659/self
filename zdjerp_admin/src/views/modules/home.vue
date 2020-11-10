<template>
  <div class="container" ref="container">
    <div :style="marginStyle">
      <div style="position: relative;">
        <img  style="width: 1006px;height: 97px;" :style="transformStyle" class="logo" src="../../../public/img/home/login_logo1.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { getComputedStyle } from '../../utils/index'
export default {
  data () {
    return {
      scaleX: '',
      scaleY: '',
      marginHorizontal: ''
    }
  },
  computed: {
    transformStyle: function () {
      return {
        transform: `scale(${this.scaleX}, ${this.scaleY})`
      }
    },
    marginStyle: function () {
      return {
        margin: `0px ${this.marginHorizontal}px`
      }
    }
  },
  mounted () {
    this.init()
  },
  activated () {
    this.init()
  },
  deactivated () {
    console.log('销毁')
    window.removeEventListener('resize', this.initScale, false)
  },
  destroyed () {
    console.log('销毁')
    window.removeEventListener('resize', this.initScale, false)
  },
  methods: {
    init () {
      this.listenResize()
    },
    // 适应屏幕 缩放
    initScale () {
      // let $container = document.querySelector('.container')
      let $container = this.$refs.container
      let containerWidth = getComputedStyle($container, 'width').replace(
        'px',
        ''
      )
      let containerHeight = getComputedStyle($container, 'height').replace(
        'px',
        ''
      )
      containerWidth = Number(containerWidth)
      containerHeight = Number(containerHeight)
      containerWidth = isNaN(containerWidth) ? 0 : containerWidth
      containerHeight = isNaN(containerHeight) ? 0 : containerHeight
      let defaultHeight = 1080
      let defaultWidth = 1690
      // sacle 缩放比例。
      let scale = 1
      if (containerHeight < defaultHeight) {
        scale = containerHeight / defaultHeight
      }
      this.scaleX = scale
      this.scaleY = scale
      let marginWidth = defaultWidth * scale
      //
      this.marginHorizontal = 0
      if (containerWidth > marginWidth) {
        marginWidth = (containerWidth - marginWidth) / 2
        this.marginHorizontal = marginWidth
      }
    },
    // 监听屏幕变化
    listenResize () {
      this.initScale()
      window.addEventListener(
        'resize',
        debounce(() => {
          this.initScale()
        }, 300)
      )
    }
  }
}
</script>

<style scoped>
.container{
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.container .logo{
  width: 1006px;
  height: 97px;
}

</style>
