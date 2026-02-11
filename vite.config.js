import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  root: "public",
  publicDir: false,
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "public/index.html"),
        intro: resolve(__dirname, "public/intro.html"),
        setup: resolve(__dirname, "public/setup.html"),
        cocoTimer: resolve(__dirname, "public/coco-timer.html"),
      },
    },
  },
});
