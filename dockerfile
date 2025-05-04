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