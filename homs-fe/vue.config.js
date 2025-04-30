const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pluginOptions: {
    i18n: {
      locale: 'ko',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true
    }
  },
  configureWebpack: {
    plugins: [
      new (require('webpack')).DefinePlugin({
        'process.env': {
          VUE_APP_I18N_LOCALE: JSON.stringify(process.env.VUE_APP_I18N_LOCALE || 'ko'),
          VUE_APP_I18N_FALLBACK_LOCALE: JSON.stringify(process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'ko'),
        }
      })
    ]
  }
})
