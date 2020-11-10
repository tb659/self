module.exports = {
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://192.168.1.30:8085',//代理地址，这里设置的地址会代替axios中设置的baseURL
        target: 'http://192.168.0.105:8888',//代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
        //ws: true, // proxy websockets
        //pathRewrite方法重写url
        // pathRewrite: {
        // pathRewrite: {'^/api': '/'} 重写之后url为 http://192.168.1.16:8085/xxxx
        //pathRewrite: {'^/api': '/api'} 重写之后url为 http://192.168.1.16:8085/api/xxxx
        // }
      }
    }
  },
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/styles/_variable.scss";`
      }
    }
  },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      // config
      //   .entry('app')
      //   .clear()
      //   .add('./src/main-prod.js')

      // config.set('externals', {
      //   vue: 'Vue',
      //   'vue-router': 'VueRouter',
      //   axios: 'axios',
      //   echarts: 'echarts',
      //   moment: 'moment',
      //   'element-ui': 'ElementUI',
      //   'vue-quill-editor': 'VueQuillEditor'
      // })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    config.when(process.env.NODE_ENV === 'development', config => {
      // config
      //   .entry('app')
      //   .clear()
      //   .add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  },
  configureWebpack: {
    externals: {
      AMap: 'AMap' // 高德地图配置
    }
  }
}
