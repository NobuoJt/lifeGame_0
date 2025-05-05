2025/04/12

[参考リンク](https://qiita.com/shoki-y/items/1be906c372c8a9a993a3)
[ChatGPT](https://chatgpt.com/share/67fa8485-f038-8009-886e-bd046dc4d614)

# project init config

## 1 viteプロジェクト作成
```npm create vite```
(select and edit)

## 2 install depend
```npm install```

## 3 vite.config.js define
- vite.config.js
- Dev: server Port
- Build: Relative link default
    ( / [=root] → ./ [=__dirname] )
- reload 3000ms
- JS file size Chunk divide

```js
// https://vitejs.dev/config/
import { splitVendorChunkPlugin,defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
export default defineConfig({
  plugins: [react(),splitVendorChunkPlugin()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    watch: {
      usePolling: true,
      interval: 3000
    },
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/vendor/[hash].js',
        entryFileNames: 'assets/js/[name].js',
      },
    },
  },
  base:'./',
});
```

## 4 server trial 
```npm run dev```

## 5 スペルチェッカーでの固有名詞ignore
- /vscode/settings.json  
ADD 
```"cSpell.ignorePaths":["**/node_modules/**","licenses/**"],```

## 6 docker define

- dockerfile
  - コンテナ内にホストのボリュームをアタッチして開発する場合←
    - あとからホストのpackage.jsonがアタッチされてしまう
  - コンテナ内に入って開発する場合
  - 本番用
    - ボリュームアタッチは使わない。```COPY → RUN npm install```

```dockerfile
### コンテナ内にホストのボリュームをアタッチして開発する場合
###                                 (<->コンテナ内完結開発)

## ビルド時実行
FROM node:23-slim

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package.json package-lock.json ./

## 起動時実行
# モジュールインストール & 開発用サーバの起動
CMD ["sh", "-c", "npm install && npm run dev"]
```

- compose.yaml
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
```

## 7 license-checker で確認
GPLはライセンス汚染するので注意

```npx license-checker --summary```

## 8 依存ライセンスをまとめ、掲載する

- licenses/generate-licenses.js   

[ソース](https://github.com/NobuoJt/lifeGame_0/blob/main/licenses/__generate-licenses.cjs)  
実行。  
そしてメインプログラムの見えるところにライセンス表示と作者表示を表示。  
GitHubのライセンス本文とlicenses/へのリンクを貼る。

# 詰まったところ

## 循環参照
Red Hat Dependency Analyticsが勝手に  
package.jsonの"name":hogehogeから"devDependencies"の下、hogehoge:"file:"に意地でも書こうとしてくるから、  
依存関係の循環参照になって詰まった。  
拡張機能をアンインストールして解決。  

## useState()
```const [v,setFunc]=useState()```での```getFunc(v++)```は非同期的に実行されるため  
関数内の```v```は現在の状態ではないかもしれない。  
```setFunc((now_v)=>{return now_v++})```を使うことで現在の```v```を取得して実行が可能。  
しかし、関わる変数が増えるとネストが増えるので、そういう処理は```useReducer()```を定義するべき。

# docker commands

```sh
#主に初回のコンテナ起動時、すでにあるイメージを使用してコンテナを起動する時
$ docker compose up -d

#Dockerfileやcompose.yamlを編集した時、npm iが必要なとき。
$ docker compose up -d --build

#コンテナに入る時に使用 appはcompose.yamlのservicesの名前
$ docker compose exec app bash

#コンテナを終了
$ docker compose down
```
- 別にGUIから動かしても同じ。

# Build to Html
- dist/* へ  

```npm run build``` = tsc -b && vite build

# 記述規則

- ClassName
- var_name
- funcName
- getValue

# やりたいこと

## グラフ機能
## ライセンス関連
## スマホ対応
## コンパイル
## 自動ステップ自動拡張動作しない？