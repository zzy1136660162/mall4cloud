// vite.config.js
import { defineConfig } from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-multishop/node_modules/.pnpm/vite@4.3.9_@types+node@25.5.2_sass@1.62.1_stylus@0.57.0/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-multishop/node_modules/.pnpm/@vitejs+plugin-vue@4.1.0_vi_53b85e12f9400beeb7aa30dd778d6bb3/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import AutoImport from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-multishop/node_modules/.pnpm/unplugin-auto-import@0.16.2_6f5570734ed99c871a2767bf0086204c/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-multishop/node_modules/.pnpm/unplugin-vue-components@0.2_7111bc8c12f42c9a5bb29a58ba3ebed2/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-multishop/node_modules/.pnpm/unplugin-vue-components@0.2_7111bc8c12f42c9a5bb29a58ba3ebed2/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import { createSvgIconsPlugin } from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-multishop/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_c8aafb366699752981502f027548b27b/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import viteCompression from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-multishop/node_modules/.pnpm/vite-plugin-compression@0.5_c4069a377fd7688f0d4ecdbe50514ba6/node_modules/vite-plugin-compression/dist/index.mjs";
import eslintPlugin from "file:///E:/ZZY_PROJECT/%E9%80%9A%E7%94%A8%E5%95%86%E5%9F%8E%E6%A8%A1%E6%9D%BF/common-mall/mall4cloud/front-end/mall4cloud-multishop/node_modules/.pnpm/vite-plugin-eslint@1.8.1_es_36065c25fdc1f671318de85594577ee6/node_modules/vite-plugin-eslint/dist/index.mjs";
var __vite_injected_original_dirname = "E:\\ZZY_PROJECT\\\u901A\u7528\u5546\u57CE\u6A21\u677F\\common-mall\\mall4cloud\\front-end\\mall4cloud-multishop";
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
          "vue-router"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxaWllfUFJPSkVDVFxcXFxcdTkwMUFcdTc1MjhcdTU1NDZcdTU3Q0VcdTZBMjFcdTY3N0ZcXFxcY29tbW9uLW1hbGxcXFxcbWFsbDRjbG91ZFxcXFxmcm9udC1lbmRcXFxcbWFsbDRjbG91ZC1tdWx0aXNob3BcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFpaWV9QUk9KRUNUXFxcXFx1OTAxQVx1NzUyOFx1NTU0Nlx1NTdDRVx1NkEyMVx1Njc3RlxcXFxjb21tb24tbWFsbFxcXFxtYWxsNGNsb3VkXFxcXGZyb250LWVuZFxcXFxtYWxsNGNsb3VkLW11bHRpc2hvcFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovWlpZX1BST0pFQ1QvJUU5JTgwJTlBJUU3JTk0JUE4JUU1JTk1JTg2JUU1JTlGJThFJUU2JUE4JUExJUU2JTlEJUJGL2NvbW1vbi1tYWxsL21hbGw0Y2xvdWQvZnJvbnQtZW5kL21hbGw0Y2xvdWQtbXVsdGlzaG9wL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXHJcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3ZnLWljb25zJ1xyXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJ1xyXG5cclxuLy8gZXNsaW50XHJcbmltcG9ydCBlc2xpbnRQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tZXNsaW50J1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQgfSkgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHZ1ZSgpLFxyXG4gICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAgICAgaWNvbkRpcnM6IFtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NyYy9pY29ucy9zdmcnKV0sXHJcbiAgICAgICAgc3ltYm9sSWQ6ICdpY29uLVtkaXJdLVtuYW1lXSdcclxuICAgICAgfSksXHJcbiAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUYxNVx1NTE2NVx1NTE4NVx1NUJCOVxyXG4gICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgICAndnVlJyxcclxuICAgICAgICAgICd2dWUtcm91dGVyJ1xyXG4gICAgICAgIF0sXHJcbiAgICAgICAgZGlyczogW1xyXG4gICAgICAgICAgJ3NyYy9ob29rcy8qKicsXHJcbiAgICAgICAgICAnc3JjL3N0b3Jlcy8qKicsXHJcbiAgICAgICAgICAnc3JjL3V0aWxzLyoqJ1xyXG4gICAgICAgIF0sXHJcbiAgICAgICAgcmVzb2x2ZXJzOiBjb21tYW5kID09PSAnYnVpbGQnID8gW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0gOiBbXSxcclxuICAgICAgICBkdHM6ICdzcmMvYXV0by1pbXBvcnQvaW1wb3J0cy5kLnRzJyxcclxuICAgICAgICBlc2xpbnRyYzoge1xyXG4gICAgICAgICAgZW5hYmxlZDogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH0pLFxyXG4gICAgICAvLyBcdTgxRUFcdTUyQThcdTVGMTVcdTUxNjVcdTdFQzRcdTRFRjZcclxuICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgZGlyczogW1xyXG4gICAgICAgICAgJ3NyYy9jb21wb25lbnRzJ1xyXG4gICAgICAgIF0sXHJcbiAgICAgICAgcmVzb2x2ZXJzOiBjb21tYW5kID09PSAnYnVpbGQnID8gW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0gOiBbXSxcclxuICAgICAgICBkdHM6ICdzcmMvYXV0by1pbXBvcnQvY29tcG9uZW50cy5kLnRzJ1xyXG4gICAgICB9KSxcclxuICAgICAgLy8gZXNsaW50XHJcbiAgICAgIGVzbGludFBsdWdpbih7XHJcbiAgICAgICAgaW5jbHVkZTogWydzcmMvKiovKi5qcycsICdzcmMvKiovKi52dWUnLCAnc3JjLyouanMnLCAnc3JjLyoudnVlJ11cclxuICAgICAgfSksXHJcbiAgICAgIC8vIFx1NUJGOVx1NTkyN1x1NEU4RSAxayBcdTc2ODRcdTY1ODdcdTRFRjZcdThGREJcdTg4NENcdTUzOEJcdTdGMjlcclxuICAgICAgdml0ZUNvbXByZXNzaW9uKHtcclxuICAgICAgICB0aHJlc2hvbGQ6IDEwMDAsXHJcbiAgICAgIH0pXHJcbiAgICBdLFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIGhvc3Q6IHRydWUsXHJcbiAgICAgIHBvcnQ6IDk1MjcsXHJcbiAgICAgIG9wZW46IHRydWVcclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXHJcbiAgICAgICAgJ3Z1ZS1pMThuJzogJ3Z1ZS1pMThuL2Rpc3QvdnVlLWkxOG4uY2pzLmpzJ1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgYmFzZTogJy4vJyxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIC8vIFx1OTc1OVx1NjAwMVx1OEQ0NFx1NkU5MFx1NTIwNlx1N0M3Qlx1NjI1M1x1NTMwNVxyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdzdGF0aWMvanMvW25hbWVdLVtoYXNoXS5qcycsXHJcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ3N0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnc3RhdGljL1tleHRdL1tuYW1lXS1baGFzaF0uW2V4dF0nLFxyXG4gICAgICAgICAgLy8gXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU1MjA2XHU2MkM2XHU2MjUzXHU1MzA1XHJcbiAgICAgICAgICBtYW51YWxDaHVua3MgKGlkKSB7XHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcclxuICAgICAgICAgICAgICBpZiAoaWQudG9TdHJpbmcoKS5pbmRleE9mKCcucG5wbS8nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpZC50b1N0cmluZygpLnNwbGl0KCcucG5wbS8nKVsxXS5zcGxpdCgnLycpWzBdLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChpZC50b1N0cmluZygpLmluZGV4T2YoJ25vZGVfbW9kdWxlcy8nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpZC50b1N0cmluZygpLnNwbGl0KCdub2RlX21vZHVsZXMvJylbMV0uc3BsaXQoJy8nKVswXS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgc291cmNlbWFwOiBmYWxzZSxcclxuICAgICAgdGFyZ2V0OiAnZXMyMDE1JyxcclxuICAgICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IGZhbHNlXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlkLFNBQVMsb0JBQW9CO0FBQzllLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFDcEMsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyxxQkFBcUI7QUFHNUIsT0FBTyxrQkFBa0I7QUFWekIsSUFBTSxtQ0FBbUM7QUFhekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxRQUFRLE1BQU07QUFDM0MsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0oscUJBQXFCO0FBQUEsUUFDbkIsVUFBVSxDQUFDLEtBQUssUUFBUSxRQUFRLElBQUksR0FBRyxlQUFlLENBQUM7QUFBQSxRQUN2RCxVQUFVO0FBQUEsTUFDWixDQUFDO0FBQUE7QUFBQSxNQUVELFdBQVc7QUFBQSxRQUNULFNBQVM7QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFBQSxRQUNBLE1BQU07QUFBQSxVQUNKO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxRQUNGO0FBQUEsUUFDQSxXQUFXLFlBQVksVUFBVSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQztBQUFBLFFBQzVELEtBQUs7QUFBQSxRQUNMLFVBQVU7QUFBQSxVQUNSLFNBQVM7QUFBQSxRQUNYO0FBQUEsTUFDRixDQUFDO0FBQUE7QUFBQSxNQUVELFdBQVc7QUFBQSxRQUNULE1BQU07QUFBQSxVQUNKO0FBQUEsUUFDRjtBQUFBLFFBQ0EsV0FBVyxZQUFZLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7QUFBQSxRQUM1RCxLQUFLO0FBQUEsTUFDUCxDQUFDO0FBQUE7QUFBQSxNQUVELGFBQWE7QUFBQSxRQUNYLFNBQVMsQ0FBQyxlQUFlLGdCQUFnQixZQUFZLFdBQVc7QUFBQSxNQUNsRSxDQUFDO0FBQUE7QUFBQSxNQUVELGdCQUFnQjtBQUFBLFFBQ2QsV0FBVztBQUFBLE1BQ2IsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsUUFDbEMsWUFBWTtBQUFBLE1BQ2Q7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxNQUFNO0FBQUEsTUFDTixlQUFlO0FBQUE7QUFBQSxRQUViLFFBQVE7QUFBQSxVQUNOLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBO0FBQUEsVUFFaEIsYUFBYyxJQUFJO0FBQ2hCLGdCQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0Isa0JBQUksR0FBRyxTQUFTLEVBQUUsUUFBUSxRQUFRLE1BQU0sSUFBSTtBQUMxQyx1QkFBTyxHQUFHLFNBQVMsRUFBRSxNQUFNLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLFNBQVM7QUFBQSxjQUNqRSxXQUFXLEdBQUcsU0FBUyxFQUFFLFFBQVEsZUFBZSxNQUFNLElBQUk7QUFDeEQsdUJBQU8sR0FBRyxTQUFTLEVBQUUsTUFBTSxlQUFlLEVBQUUsQ0FBQyxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRSxTQUFTO0FBQUEsY0FDeEU7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxXQUFXO0FBQUEsTUFDWCxRQUFRO0FBQUEsTUFDUixzQkFBc0I7QUFBQSxJQUN4QjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
