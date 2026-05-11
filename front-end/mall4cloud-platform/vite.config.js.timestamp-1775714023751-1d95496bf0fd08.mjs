// vite.config.js
import { defineConfig } from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-platform/node_modules/.pnpm/vite@4.3.9_@types+node@25.5.2_sass@1.62.1_stylus@0.57.0/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-platform/node_modules/.pnpm/@vitejs+plugin-vue@4.1.0_vi_53b85e12f9400beeb7aa30dd778d6bb3/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import AutoImport from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-platform/node_modules/.pnpm/unplugin-auto-import@0.16.2_6f5570734ed99c871a2767bf0086204c/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-platform/node_modules/.pnpm/unplugin-vue-components@0.2_7111bc8c12f42c9a5bb29a58ba3ebed2/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-platform/node_modules/.pnpm/unplugin-vue-components@0.2_7111bc8c12f42c9a5bb29a58ba3ebed2/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import { createSvgIconsPlugin } from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-platform/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_c8aafb366699752981502f027548b27b/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import viteCompression from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-platform/node_modules/.pnpm/vite-plugin-compression@0.5_c4069a377fd7688f0d4ecdbe50514ba6/node_modules/vite-plugin-compression/dist/index.mjs";
import eslintPlugin from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-platform/node_modules/.pnpm/vite-plugin-eslint@1.8.1_es_36065c25fdc1f671318de85594577ee6/node_modules/vite-plugin-eslint/dist/index.mjs";
var __vite_injected_original_dirname = "E:\\ZZY_PROJECT\\\u901A\u7528\u5546\u57CE\u6A21\u677F\\common-mall\\mall4cloud\\front-end\\mall4cloud-platform";
var vite_config_default = defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
        symbolId: "icon-[dir]-[name]"
      }),
      // 自动引入内容
      AutoImport({
        imports: [
          "vue",
          "vue-router",
          {
            "element-plus": [
              ["ElMessage", "ElMessage"],
              ["ElMessageBox", "ElMessageBox"]
            ]
          }
        ],
        dirs: [
          "src/hooks/**",
          "src/stores/**",
          "src/utils/**"
        ],
        resolvers: command === "build" ? [ElementPlusResolver()] : [],
        dts: "src/auto-import/imports.d.ts",
        eslintrc: {
          enabled: false
        }
      }),
      // 自动引入组件
      Components({
        dirs: [
          "src/components"
        ],
        resolvers: command === "build" ? [ElementPlusResolver()] : [],
        dts: "src/auto-import/components.d.ts"
      }),
      // eslint
      eslintPlugin({
        include: ["src/**/*.js", "src/**/*.vue", "src/*.js", "src/*.vue"]
      }),
      // 对大于 1k 的文件进行压缩
      viteCompression({
        threshold: 1e3
      })
    ],
    server: {
      host: true,
      port: 9527,
      open: true
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "src"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
      }
    },
    build: {
      base: "./",
      rollupOptions: {
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
          // 静态资源分拆打包
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.toString().indexOf(".pnpm/") !== -1) {
                return id.toString().split(".pnpm/")[1].split("/")[0].toString();
              } else if (id.toString().indexOf("node_modules/") !== -1) {
                return id.toString().split("node_modules/")[1].split("/")[0].toString();
              }
            }
          }
        }
      },
      sourcemap: false,
      target: "es2015",
      reportCompressedSize: false
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxaWllfUFJPSkVDVFxcXFxcdTkwMUFcdTc1MjhcdTU1NDZcdTU3Q0VcdTZBMjFcdTY3N0ZcXFxcY29tbW9uLW1hbGxcXFxcbWFsbDRjbG91ZFxcXFxmcm9udC1lbmRcXFxcbWFsbDRjbG91ZC1wbGF0Zm9ybVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcWlpZX1BST0pFQ1RcXFxcXHU5MDFBXHU3NTI4XHU1NTQ2XHU1N0NFXHU2QTIxXHU2NzdGXFxcXGNvbW1vbi1tYWxsXFxcXG1hbGw0Y2xvdWRcXFxcZnJvbnQtZW5kXFxcXG1hbGw0Y2xvdWQtcGxhdGZvcm1cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1paWV9QUk9KRUNULyVFOSU4MCU5QSVFNyU5NCVBOCVFNSU5NSU4NiVFNSU5RiU4RSVFNiVBOCVBMSVFNiU5RCVCRi9jb21tb24tbWFsbC9tYWxsNGNsb3VkL2Zyb250LWVuZC9tYWxsNGNsb3VkLXBsYXRmb3JtL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXHJcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3ZnLWljb25zJ1xyXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJ1xyXG5cclxuLy8gZXNsaW50XHJcbmltcG9ydCBlc2xpbnRQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tZXNsaW50J1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQgfSkgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHZ1ZSgpLFxyXG4gICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAgICAgaWNvbkRpcnM6IFtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NyYy9pY29ucy9zdmcnKV0sXHJcbiAgICAgICAgc3ltYm9sSWQ6ICdpY29uLVtkaXJdLVtuYW1lXSdcclxuICAgICAgfSksXHJcbiAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUYxNVx1NTE2NVx1NTE4NVx1NUJCOVxyXG4gICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgICAndnVlJyxcclxuICAgICAgICAgICd2dWUtcm91dGVyJyxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgJ2VsZW1lbnQtcGx1cyc6W1xyXG4gICAgICAgICAgICAgIFsnRWxNZXNzYWdlJywgJ0VsTWVzc2FnZSddLFxyXG4gICAgICAgICAgICAgIFsnRWxNZXNzYWdlQm94JywgJ0VsTWVzc2FnZUJveCddLFxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBkaXJzOiBbXHJcbiAgICAgICAgICAnc3JjL2hvb2tzLyoqJyxcclxuICAgICAgICAgICdzcmMvc3RvcmVzLyoqJyxcclxuICAgICAgICAgICdzcmMvdXRpbHMvKionXHJcbiAgICAgICAgXSxcclxuICAgICAgICByZXNvbHZlcnM6IGNvbW1hbmQgPT09ICdidWlsZCcgPyBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSA6IFtdLFxyXG4gICAgICAgIGR0czogJ3NyYy9hdXRvLWltcG9ydC9pbXBvcnRzLmQudHMnLFxyXG4gICAgICAgIGVzbGludHJjOiB7XHJcbiAgICAgICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfSksXHJcbiAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUYxNVx1NTE2NVx1N0VDNFx1NEVGNlxyXG4gICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICBkaXJzOiBbXHJcbiAgICAgICAgICAnc3JjL2NvbXBvbmVudHMnXHJcbiAgICAgICAgXSxcclxuICAgICAgICByZXNvbHZlcnM6IGNvbW1hbmQgPT09ICdidWlsZCcgPyBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSA6IFtdLFxyXG4gICAgICAgIGR0czogJ3NyYy9hdXRvLWltcG9ydC9jb21wb25lbnRzLmQudHMnXHJcbiAgICAgIH0pLFxyXG4gICAgICAvLyBlc2xpbnRcclxuICAgICAgZXNsaW50UGx1Z2luKHtcclxuICAgICAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLmpzJywgJ3NyYy8qKi8qLnZ1ZScsICdzcmMvKi5qcycsICdzcmMvKi52dWUnXVxyXG4gICAgICB9KSxcclxuICAgICAgLy8gXHU1QkY5XHU1OTI3XHU0RThFIDFrIFx1NzY4NFx1NjU4N1x1NEVGNlx1OEZEQlx1ODg0Q1x1NTM4Qlx1N0YyOVxyXG4gICAgICB2aXRlQ29tcHJlc3Npb24oe1xyXG4gICAgICAgIHRocmVzaG9sZDogMTAwMCxcclxuICAgICAgfSlcclxuICAgIF0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgaG9zdDogdHJ1ZSxcclxuICAgICAgcG9ydDogOTUyNyxcclxuICAgICAgb3BlbjogdHJ1ZVxyXG4gICAgfSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuICAgICAgICAndnVlLWkxOG4nOiAndnVlLWkxOG4vZGlzdC92dWUtaTE4bi5janMuanMnXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBiYXNlOiAnLi8nLFxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgLy8gXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU1MjA2XHU3QzdCXHU2MjUzXHU1MzA1XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogJ3N0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnc3RhdGljL2pzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdzdGF0aWMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XScsXHJcbiAgICAgICAgICAvLyBcdTk3NTlcdTYwMDFcdThENDRcdTZFOTBcdTUyMDZcdTYyQzZcdTYyNTNcdTUzMDVcclxuICAgICAgICAgIG1hbnVhbENodW5rcyAoaWQpIHtcclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgICAgIGlmIChpZC50b1N0cmluZygpLmluZGV4T2YoJy5wbnBtLycpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkLnRvU3RyaW5nKCkuc3BsaXQoJy5wbnBtLycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlkLnRvU3RyaW5nKCkuaW5kZXhPZignbm9kZV9tb2R1bGVzLycpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkLnRvU3RyaW5nKCkuc3BsaXQoJ25vZGVfbW9kdWxlcy8nKVsxXS5zcGxpdCgnLycpWzBdLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzb3VyY2VtYXA6IGZhbHNlLFxyXG4gICAgICB0YXJnZXQ6ICdlczIwMTUnLFxyXG4gICAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogZmFsc2VcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOGMsU0FBUyxvQkFBb0I7QUFDM2UsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDJCQUEyQjtBQUNwQyxTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLHFCQUFxQjtBQUc1QixPQUFPLGtCQUFrQjtBQVZ6QixJQUFNLG1DQUFtQztBQWF6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFFBQVEsTUFBTTtBQUMzQyxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSixxQkFBcUI7QUFBQSxRQUNuQixVQUFVLENBQUMsS0FBSyxRQUFRLFFBQVEsSUFBSSxHQUFHLGVBQWUsQ0FBQztBQUFBLFFBQ3ZELFVBQVU7QUFBQSxNQUNaLENBQUM7QUFBQTtBQUFBLE1BRUQsV0FBVztBQUFBLFFBQ1QsU0FBUztBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFlBQ0UsZ0JBQWU7QUFBQSxjQUNiLENBQUMsYUFBYSxXQUFXO0FBQUEsY0FDekIsQ0FBQyxnQkFBZ0IsY0FBYztBQUFBLFlBQ2pDO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxRQUNBLE1BQU07QUFBQSxVQUNKO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxRQUNGO0FBQUEsUUFDQSxXQUFXLFlBQVksVUFBVSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQztBQUFBLFFBQzVELEtBQUs7QUFBQSxRQUNMLFVBQVU7QUFBQSxVQUNSLFNBQVM7QUFBQSxRQUNYO0FBQUEsTUFDRixDQUFDO0FBQUE7QUFBQSxNQUVELFdBQVc7QUFBQSxRQUNULE1BQU07QUFBQSxVQUNKO0FBQUEsUUFDRjtBQUFBLFFBQ0EsV0FBVyxZQUFZLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7QUFBQSxRQUM1RCxLQUFLO0FBQUEsTUFDUCxDQUFDO0FBQUE7QUFBQSxNQUVELGFBQWE7QUFBQSxRQUNYLFNBQVMsQ0FBQyxlQUFlLGdCQUFnQixZQUFZLFdBQVc7QUFBQSxNQUNsRSxDQUFDO0FBQUE7QUFBQSxNQUVELGdCQUFnQjtBQUFBLFFBQ2QsV0FBVztBQUFBLE1BQ2IsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsUUFDbEMsWUFBWTtBQUFBLE1BQ2Q7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxNQUFNO0FBQUEsTUFDTixlQUFlO0FBQUE7QUFBQSxRQUViLFFBQVE7QUFBQSxVQUNOLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBO0FBQUEsVUFFaEIsYUFBYyxJQUFJO0FBQ2hCLGdCQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0Isa0JBQUksR0FBRyxTQUFTLEVBQUUsUUFBUSxRQUFRLE1BQU0sSUFBSTtBQUMxQyx1QkFBTyxHQUFHLFNBQVMsRUFBRSxNQUFNLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLFNBQVM7QUFBQSxjQUNqRSxXQUFXLEdBQUcsU0FBUyxFQUFFLFFBQVEsZUFBZSxNQUFNLElBQUk7QUFDeEQsdUJBQU8sR0FBRyxTQUFTLEVBQUUsTUFBTSxlQUFlLEVBQUUsQ0FBQyxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRSxTQUFTO0FBQUEsY0FDeEU7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxXQUFXO0FBQUEsTUFDWCxRQUFRO0FBQUEsTUFDUixzQkFBc0I7QUFBQSxJQUN4QjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
