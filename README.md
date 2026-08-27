# lifegame_0

ライフゲーム作りました。
[https://lifegame-0.pages.dev/](https://lifegame-0.pages.dev/)

![image](https://github.com/user-attachments/assets/37838507-9e0f-4a23-92bd-051a07e8cbef)

## 使用技術

### 開発

- Docker(初) 実行環境として
  - ファイルシステムはホストコンピュータから割当て
- Vite(初) 開発サーバー
- React(初) TSX

### CI・デプロイ

- GitHub Actions(初) Dockerコンポーズ
- Vite ビルド
- Cloudflare Pages(初) ホスティング

## ドキュメント

[ライセンス(自)](LICENSE)
[ライセンス(他)](licenses/)
[開発メモ](startup_memo.md)

## 既知のバグ

- なし

## 遊び方

[実装先](https://lifegame-0.pages.dev/) で実行できます。

### 画面の説明

- 上部90%：メイン画面
　- モードにより変化  
- 下部10%：メニュー画面
  - 紫🟣　モード選択
  - 赤🔴　動作の操作
  - 緑🟢　初期化の操作
  - 青🔵　簡易情報
  - 黄🟡　盤面設定

![image](https://github.com/user-attachments/assets/47fa7083-5031-45e2-b071-dcf82e271a83)

#### メイン：盤面

青🟦：死  
黄🟨：生  
クリックで反転

#### 紫🟣　モード選択

![image](https://github.com/user-attachments/assets/429158a6-fffd-49ec-8feb-8103ec31ec57)

- Button
  - クリックで変更可能なボタン盤面。
  - セル数が多いと全体は映らない。
- None
  - なにもない。動作最速。
- Tile
  - 変更不可能な盤面。
  - 全体が映る。
- Ex/Import
  - データを文字列として入出力可能。
  - 🔵JSON E/I 現在のすべての状態
  - ⚫️JSON at Reset 動かし始める前のすべての状態。
  - 🔴Table CSV 盤面の生死のみ。
  - 🟢Stat Log 全ステップの概略情報
- Option
  - バージョン情報。
  - ライセンス、著作権情報。
  - 生死カラー設定  
- Graph
  - 生存数、生死数のグラフ。
  - Button、Tileより軽い。

#### 赤🔴：動作

![image](https://github.com/user-attachments/assets/598052f7-20d4-44d3-968c-ca5b7dd67550)

- next step ステップを1つ進めるボタン
- step: リセットからのカウント
- Opposite loop
  - チェックオン 下端と上端、右端と左端はつながっている。
  - チェックオフ　端に生存セルがある場合、自動拡張。
- step time 自動ステップ進行時の時間間隔。単位はミリ秒。
- auto step run
  - チェックオン　自動ステップ進行を行う。

#### 緑🟢：初期化

![image](https://github.com/user-attachments/assets/6d21e5fb-c485-471e-872d-eaf648daf33c)

- Kill ALL リセット
- % random randomize時の誕生確率、デフォルトは50%。
- randomize リセット生成ボタン。

#### 青🔵：簡易情報

![image](https://github.com/user-attachments/assets/a55e2af5-bef8-4386-8e3d-3a662f278b4c)

- live このステップでの生存数
- barth このステップでの誕生数
- death このステップでの死亡数

#### 黄🟡：盤面変更

![image](https://github.com/user-attachments/assets/9615e1c2-bd69-408b-bf25-076aea81e70a)

- Col/Row
  - デフォルトは20×20。変更するとセルの内容はリセット。
- EXtend
  - セル内容維持しながら拡幅。

## About 開発

### Docker実行環境を使用する

```sh
docker pull nobuojt/lifegame_0:latest
docker run -p 3000:3000 nobuojt/lifegame_0
```

ブラウザで```localhost:3000```にアクセス

#### Docker Repository

[https://hub.docker.com/r/nobuojt/lifegame_0](https://hub.docker.com/r/nobuojt/lifegame_0)
