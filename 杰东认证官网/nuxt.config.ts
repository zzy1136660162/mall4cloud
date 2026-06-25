export default defineNuxtConfig({
  ssr: true,
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN'
      }
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  devtools: {
    enabled: false
  }
});
