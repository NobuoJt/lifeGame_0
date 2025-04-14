# lifegame_0

ライフゲーム作りました。
viteもdockerもGitHub Actionsも初めてなのでお試し。

![image](https://github.com/user-attachments/assets/4cfa2b0c-8156-410b-bc37-8c9d75214865)

# how to run

dockerを使います。
```sh
docker pull yourdockerhubusername/lifegame_0:latest
docker run -p 3000:3000 yourdockerhubusername/lifegame_0
```

ブラウザで```localhost:3000```にアクセス

# usage

## メイン：ボタンの格子
青：死　黄：生
クリックで反転

## 下部：メニュー

### 黄色：行列数変更
デフォルトは20×20。変更するとマスの内容はリセット。

### 赤：ステップ進行
- next step ステップを1つ進めるボタン
- step: リセットからのカウント
- step time 自動ステップ進行時の時間間隔。単位はミリ秒。
- auto step run 自動ステップ進行を行うためのチェックボックス

### 緑：盤面制御
- death fill リセット
- % random randomize時の誕生確率、デフォルトは50%。
- randomize リセット生成ボタン

### 青：インフォ
- live このステップでの生存数
- barth このステップでの誕生数
- death このステップでの死亡数
# Docker Repository

https://hub.docker.com/r/nobuojt/lifegame_0
