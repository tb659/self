<template>
  <div class="aui-wrapper aui-page__login container">
    <div class="aui-content__wrapper">
      <main class="aui-content">
        <div class="login-header">
           <img src="./../../assets/img/LOGO1.png" alt="">
        </div>
        <div class="login-body">
          <div class="login-left">
              <img src="./../../assets/img/left_login.png" alt="">
          </div>
          <!-- 登录盒子 -->
          <div class="login-right">
            <div class="login-logo">
              <img src="./../../assets/img/logo.png" alt="">
            </div>
            <h2 class="login-title">{{ $t('brand.lg') }}</h2>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" status-icon>
            <!-- <el-form-item>
                <el-select v-model="$i18n.locale" class="w-percent-100">
                  <el-option v-for="(val, key) in i18nMessages" :key="key" :label="val._lang" :value="key"></el-option>
                </el-select>
              </el-form-item>-->
              <el-form-item prop="username">
                <el-input v-model="dataForm.username" :placeholder="$t('login.username')">
                  <img  slot="prefix" class="el-input__icon" src="./../../assets/img/username.png" alt="" >
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="dataForm.password" type="password" :placeholder="$t('login.password')">
                  <img  slot="prefix" class="el-input__icon" src="./../../assets/img/password.png" alt="" >
                </el-input>
              </el-form-item>
              <el-form-item prop="captcha">
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-input v-model="dataForm.captcha" :placeholder="$t('login.captcha')">
                      <img  slot="prefix" class="el-input__icon" src="./../../assets/img/captcha.png" alt="" >
                    </el-input>
                  </el-col>
                  <el-col :span="10" class="login-captcha">
                    <img :src="captchaPath" @click="getCaptcha()">
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="dataFormSubmitHandle()" class="w-percent-100">{{ $t('login.title') }}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="login-footer">
          <p>{{ $t('login.copyright') }} 2019 - {{ new Date().getFullYear()}} © V5.0</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import debounce from 'lodash/debounce'
import { messages } from '@/i18n'
import { getUUID } from '@/utils'
export default {
  data () {
    return {
      i18nMessages: messages,
      captchaPath: '',
      dataForm: {
        username: '',
        password: '',
        uuid: '',
        captcha: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        username: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCaptcha()
  },
  methods: {
    // 获取验证码
    getCaptcha () {
      this.dataForm.uuid = getUUID()
      this.captchaPath = `${window.SITE_CONFIG['apiURL']}/captcha?uuid=${this.dataForm.uuid}`
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http.post('/login', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            this.getCaptcha()
            return this.$message.error(res.msg)
          }
          Cookies.set('token', res.data.token)
          this.$router.replace({ name: 'home' })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
