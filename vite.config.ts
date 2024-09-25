import path from 'node:path';  // `@types/node` で型定義を読み込む

import { defineConfig } from 'vite';

export default defineConfig({
  root     : path.resolve(__dirname, 'src'),  // `./` ではなく `./src/` 配下をルートにする
  publicDir: path.resolve(__dirname, 'public'),  // デフォルト値どおりに定義する
  build: {
    outDir : path.resolve(__dirname, 'dist'),  // デフォルト値どおりに定義する (`root` の書き換えにより `./src/dist/` と出力されないようにするため必要)
    emptyOutDir: true,  // `root` と `build.outDir` の定義による警告文を出さないようにする
    assetsInlineLimit: 0,  // Base64 としてインライン化されないようにする : https://ja.vitejs.dev/config/build-options.html#build-assetsinlinelimit
    chunkSizeWarningLimit: Number.POSITIVE_INFINITY,  // ↑ によるインライン化を推奨する警告文を出さないようにする
    target: 'esnext',  // Top-Level await を許可する
    rollupOptions: {  // エントリポイント別に HTML ファイルを指定する
      input: {
        'games/anago-pc': path.resolve(__dirname, 'src/games/anago-pc/index.html')
      }
    }
  }
});
