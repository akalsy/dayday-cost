import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import styleImport from "vite-plugin-style-import";
import reactRefersh from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    styleImport({
      libs: [
        {
          libraryName: "zarm",
          esModule: true,
          resolveStyle: (name) => {
            return `zarm/es/${name}/style/css`;
          },
        },
      ],
    }),
  ],
  css: {
    modules: {
      localsConvention: "dashesOnly",
    },
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // src 路径
      utils: path.resolve(__dirname, "utils"), // src 路径
    },
  },
  server: {
    proxy: {
      "/api": {
        // 当遇到 /api 路径时，将其转换成 target 的值
        target: "http://127.0.0.1:7001/api",
        changeOrigin: true,
        ws: true,
        // rewrite: {
        //   "^/api": "",
        // },
        rewrite: (path) => path.replace(/^\/api/, ""), // 将 /api 重写为空
      },
    },
  },
});
