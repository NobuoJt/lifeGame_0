2025/04/12

[参考リンク](https://qiita.com/shoki-y/items/1be906c372c8a9a993a3)
[ChatGPT](https://chatgpt.com/share/67fa8485-f038-8009-886e-bd046dc4d614)

# project init config

## 1 viteプロジェクト作成
```npm create vite```
(select and edit)

## 2 install depend
```npm install```

## 3 server trial 
```npm run dev```

## 4 docker define

- dockerfile
- compose.yaml

```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
CMD ["npm", "run", "dev"]
```

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

## 5 vite.config.js port define

```js
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
```

## 6 git環境構築

# 詰まったところ

Red Hat Dependency Analyticsが勝手に
package.jsonの"name":hogehogeから"devDependencies"の下、hogehoge:"file:"に意地でも書こうとしてくるから、
依存関係の循環参照になって詰まった。
拡張機能をアンインストールして解決。

# docker commands

```sh
#主に初回のコンテナ起動時、すでにあるイメージを使用してコンテナを起動する時
$ docker compose up -d

#Dockerfileやcompose.yamlを編集した時
$ docker compose up -d --build

#コンテナに入る時に使用 appはcompose.yamlのservicesの名前
$ docker compose exec app bash

#コンテナを終了
$ docker compose down
```

#記述規則

- ClassName
- var_name
- funcName
- getValue