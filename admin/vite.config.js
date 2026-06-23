import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  base: "/", // 用于生产环境 nginx从这个路径获取静态文件
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 8080,
    strictPort: true,
    proxy: {
      //用于开发环境，vite代理发送请求
      //生产环境中，这部分的代理需要由nginx接手，请在nginx中配置
      "/api_admin/": {
        target: "http://localhost:3030",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api_admin/, ""), // 移除前缀
      },
    },
  },
});
