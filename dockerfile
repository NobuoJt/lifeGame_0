### コンテナ内にホストのボリュームをアタッチして開発する場合
###                                 (<->コンテナ内完結開発)

## ビルド時実行
FROM node:23-slim

# pnpm を有効化
RUN corepack enable

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package.json pnpm-lock.yaml ./

## 起動時実行
# モジュールインストール & 開発用サーバの起動
CMD ["sh", "-c", "pnpm install && pnpm run dev"]