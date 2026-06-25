import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue',
    './data/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: '#12313b',
          deep: '#0d3b4a',
          primary: '#13836f',
          accent: '#20b694',
          soft: '#e7f5f2',
          mist: '#f5fbfa',
          line: '#d7e8e4'
        }
      },
      boxShadow: {
        soft: '0 24px 70px rgba(14, 78, 91, 0.12)',
        card: '0 18px 50px rgba(15, 73, 85, 0.10)'
      }
    }
  }
};
