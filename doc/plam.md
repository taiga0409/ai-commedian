# AIネタ帳アプリ 実装計画書

## 1. アプリ概要

### アプリ名（仮）

AIネタ帳

### コンセプト

エピソードトークのネタを、思いついた瞬間に保存し、あとからオチや本番用のセリフを整理できるWebアプリ。

ただのメモ帳ではなく、ネタ作りに必要な項目を分けて管理できるようにする。
将来的にはAIによるオチ生成やAI審査員機能を追加し、ネタ作りを補助する。

### 開発目的

エンジニア就活の個人開発として、以下をアピールする。

* フルスタックWebアプリ開発経験
* Next.js / TypeScript / PostgreSQL の利用経験
* AI APIを活用した機能開発
* 自分の興味から課題設定し、プロダクトに落とし込む創造力
* READMEや設計資料を含めた開発プロセス

---

## 2. 技術スタック

### フロントエンド

* Next.js
* TypeScript
* React
* CSS Modules または Tailwind CSS

### バックエンド

* Next.js Route Handlers / Server Actions

### データベース

* 開発初期：JSONファイルまたはメモリ上の仮データ
* 本実装：PostgreSQL
* ORM：Prisma

### AI機能

* OpenAI API

### 認証

* なし
* まずは自分1人で使う想定

### ソースコード管理

* Git
* GitHub

### デプロイ

* 必須ではない
* まずはGitHubでコードを見せる想定
* 余裕があればVercelなどで公開

---

## 3. Prismaについて

Prismaは、TypeScriptからPostgreSQLなどのDBを扱いやすくするORM。

今回のアプリでは、ネタデータをDBに保存するために使用する。
SQLを直接書く量を減らし、TypeScriptの型と連携して安全にDB操作できるようにする。

例：

* ネタ一覧を取得する
* ネタを新規作成する
* ネタ詳細を取得する
* ネタを編集する
* ネタを削除する
* ステータスで絞り込む

---

## 4. 開発方針

1週間程度でMVPを完成させることを目標にする。

最初からAI機能まで作り込まず、まずは基本的なネタ管理機能を完成させる。
その後、AIオチ生成とAI審査員機能を追加する。

---

## 5. MVPのスコープ

### MVPで作る機能

* トップ画面
* ネタ一覧画面
* ネタ作成画面
* ネタ詳細・編集画面
* ネタ削除機能
* ステータス管理
* ステータスによるフィルター
* シンプルなUI
* PostgreSQL / Prismaによるデータ永続化
* README作成

### MVP後に追加する機能

* AIオチ生成
* AI審査員
* AI生成結果の保存
* OpenAI API設定
* READMEへのAI機能説明追加

---

## 6. 画面構成

## 6.1 トップ画面

### パス

`/`

### 目的

アプリの入口。

### 表示内容

* アプリ名
* 簡単な説明
* 「ネタをチェック」ボタン
* 「ネタを新規追加」ボタン

### 遷移

* 「ネタをチェック」 → `/ideas`
* 「ネタを新規追加」 → `/ideas/new`

---

## 6.2 ネタ一覧画面

### パス

`/ideas`

### 目的

保存したネタを一覧表示する。

### 表示内容

* ネタ一覧
* 各ネタカード

  * タイトル
  * カテゴリー
  * ステータス
  * エピソードの冒頭数十文字
  * 更新日
* 新規作成用の `+` アイコンまたはボタン
* ステータスフィルター

### フィルター

ステータスで絞り込めるようにする。

例：

* すべて
* 素材
* オチ待ち
* 構成中
* 完成
* ボツ

特に「オチ待ち」で絞り込むことで、オチ未完成のネタ一覧を再現する。

### 遷移

* ネタカードをクリック → `/ideas/[id]`
* `+` ボタン → `/ideas/new`

---

## 6.3 ネタ作成画面

### パス

`/ideas/new`

### 目的

新しいネタを作成する。

### 入力項目

* タイトル
* 実際のエピソード
* 本番用のセリフ
* オチ
* カテゴリー
* ステータス
* 備考

### 作成後

作成完了後、ネタ詳細画面またはネタ一覧画面に遷移する。

---

## 6.4 ネタ詳細・編集画面

### パス

`/ideas/[id]`

### 目的

ネタの詳細確認と編集を行う。

### 表示・編集項目

* タイトル
* 実際のエピソード
* 本番用のセリフ
* オチ
* カテゴリー
* ステータス
* 備考
* 作成日
* 更新日

### 操作

* 編集
* 保存
* 削除
* 一覧へ戻る

### AI機能追加後の表示

* AI生成オチ
* AI審査員の評価
* AI点数
* AI改善コメント

---

## 7. データ設計

## 7.1 Ideaモデル

Prismaで以下のようなモデルを作成する。

```prisma
model Idea {
  id              String   @id @default(cuid())
  title           String
  episode         String
  performanceText String?
  punchline       String?
  category        String?
  status          IdeaStatus @default(MATERIAL)
  note            String?

  aiPunchline     String?
  aiScore         Int?
  aiReview        String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## 7.2 ステータスEnum

```prisma
enum IdeaStatus {
  MATERIAL
  WAITING_PUNCHLINE
  STRUCTURING
  COMPLETED
  REJECTED
}
```

### ステータスの意味

| ステータス             | 表示名  | 意味              |
| ----------------- | ---- | --------------- |
| MATERIAL          | 素材   | まだ素材段階          |
| WAITING_PUNCHLINE | オチ待ち | エピソードはあるがオチが未完成 |
| STRUCTURING       | 構成中  | 本番用に整理中         |
| COMPLETED         | 完成   | ひとまず完成          |
| REJECTED          | ボツ   | 今回は使わない         |

---

## 8. API設計

Next.jsのRoute Handlersを使う。

## 8.1 ネタ一覧取得

### エンドポイント

`GET /api/ideas`

### クエリ

`status`

### 例

`GET /api/ideas?status=WAITING_PUNCHLINE`

### 処理

* statusが指定されていなければ全件取得
* statusが指定されていれば絞り込み
* 更新日時の新しい順で返す

---

## 8.2 ネタ詳細取得

### エンドポイント

`GET /api/ideas/[id]`

### 処理

* 指定IDのネタを取得する

---

## 8.3 ネタ作成

### エンドポイント

`POST /api/ideas`

### リクエスト例

```json
{
  "title": "コンビニで袋を断った話",
  "episode": "コンビニで袋いらないですと言ったら、商品を全部手渡しで積まれた。",
  "performanceText": "",
  "punchline": "",
  "category": "日常",
  "status": "WAITING_PUNCHLINE",
  "note": "もう少しオチを考えたい"
}
```

---

## 8.4 ネタ更新

### エンドポイント

`PUT /api/ideas/[id]`

### 処理

* 指定IDのネタを更新する

---

## 8.5 ネタ削除

### エンドポイント

`DELETE /api/ideas/[id]`

### 処理

* 指定IDのネタを削除する

---

## 9. AI機能設計

AI機能は基本機能完成後に追加する。

---

## 9.1 AIオチ生成

### 目的

保存済みのエピソードをもとに、AIがオチ案を生成する。

### 配置

ネタ詳細画面に「AIでオチを生成」ボタンを設置する。

### エンドポイント

`POST /api/ideas/[id]/generate-punchline`

### 入力

対象ネタの以下の情報を使用する。

* タイトル
* 実際のエピソード
* カテゴリー
* 備考

### 出力

AIが生成したオチ案を `aiPunchline` に保存する。

### プロンプト方針

精度に期待しすぎず、簡単なプロンプトエンジニアリングで実装する。

例：

```text
あなたはお笑いの構成作家です。
以下のエピソードトークに対して、自然で短いオチを3つ提案してください。

条件:
- 日本語で出力してください
- 口に出して言いやすい表現にしてください
- 長すぎる説明は避けてください
- 3案を番号付きで出してください

タイトル:
{title}

エピソード:
{episode}

カテゴリー:
{category}

備考:
{note}
```

---

## 9.2 AI審査員

### 目的

ネタをAIにレビューさせ、100点満点の点数と改善コメントを保存する。

### 配置

ネタ詳細画面に「AI審査員に見せる」ボタンを設置する。

### エンドポイント

`POST /api/ideas/[id]/review`

### 入力

対象ネタの以下の情報を使用する。

* タイトル
* 実際のエピソード
* 本番用のセリフ
* オチ
* カテゴリー
* 備考

### 出力

以下をDBに保存する。

* `aiScore`
* `aiReview`

### プロンプト例

```text
あなたはお笑いライブの審査員です。
以下のエピソードトークを100点満点で評価し、良い点と改善点を短くレビューしてください。

評価観点:
- 状況が伝わりやすいか
- オチが自然か
- 意外性があるか
- 話し言葉としてテンポが良いか
- 共感しやすいか

必ず以下の形式で出力してください。

点数: 〇〇点
良い点:
改善点:
一言コメント:

タイトル:
{title}

エピソード:
{episode}

本番用のセリフ:
{performanceText}

オチ:
{punchline}

カテゴリー:
{category}

備考:
{note}
```

---

## 10. UI方針

### デザイン

シンプルなUIにする。

### 方針

* 余計な装飾は入れすぎない
* スマホでも使いやすくする
* 入力欄は大きめにする
* ネタ一覧はカード形式にする
* ステータスはバッジで表示する
* 新規作成ボタンは分かりやすく配置する

---

## 11. ディレクトリ構成案

```text
src/
  app/
    page.tsx
    ideas/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
    api/
      ideas/
        route.ts
        [id]/
          route.ts
          generate-punchline/
            route.ts
          review/
            route.ts

  components/
    IdeaCard.tsx
    IdeaForm.tsx
    StatusBadge.tsx
    StatusFilter.tsx
    Header.tsx

  lib/
    prisma.ts
    openai.ts

  types/
    idea.ts

prisma/
  schema.prisma
```

---

## 12. 開発ステップ

## Step 1: プロジェクト作成

* Next.js + TypeScriptのプロジェクトを作成
* ESLintを有効化
* 必要なライブラリをインストール
* GitHubリポジトリを作成

想定コマンド：

```bash
npx create-next-app@latest ai-neta-note
```

選択例：

* TypeScript: Yes
* ESLint: Yes
* App Router: Yes
* src directory: Yes
* Tailwind CSS: 任意
* import alias: Yes

---

## Step 2: 仮データで画面作成

最初はDBを使わず、仮データで画面を作る。

作る画面：

* トップ画面
* ネタ一覧画面
* ネタ詳細画面
* ネタ作成画面

目的：

* アプリ全体の操作感を先に確認する
* DB実装前にUIの方向性を固める

---

## Step 3: フォーム実装

* ネタ作成フォーム
* ネタ編集フォーム
* ステータス選択
* カテゴリー入力
* バリデーション

最低限のバリデーション：

* タイトルは必須
* 実際のエピソードは必須
* ステータスは必須

---

## Step 4: Prisma / PostgreSQL導入

* Prismaをインストール
* PostgreSQLを用意
* `.env` に `DATABASE_URL` を設定
* `schema.prisma` を作成
* migrationを実行
* Prisma Clientを生成

想定コマンド：

```bash
npm install prisma @prisma/client
npx prisma init
npx prisma migrate dev --name init
```

---

## Step 5: API実装

以下のAPIを実装する。

* `GET /api/ideas`
* `POST /api/ideas`
* `GET /api/ideas/[id]`
* `PUT /api/ideas/[id]`
* `DELETE /api/ideas/[id]`

---

## Step 6: 画面とAPI接続

* ネタ一覧画面でAPIからデータ取得
* ネタ作成フォームからPOST
* ネタ詳細画面でGET
* 編集保存でPUT
* 削除でDELETE
* ステータスフィルターでクエリを変更

---

## Step 7: AIオチ生成機能

* OpenAI APIキーを `.env` に設定
* `lib/openai.ts` を作成
* `POST /api/ideas/[id]/generate-punchline` を実装
* ネタ詳細画面にボタンを設置
* 結果を `aiPunchline` に保存
* 画面にAI生成結果を表示

---

## Step 8: AI審査員機能

* `POST /api/ideas/[id]/review` を実装
* ネタ詳細画面にボタンを設置
* 結果を `aiScore` と `aiReview` に保存
* 画面に点数とレビューを表示

---

## Step 9: README作成

READMEには以下を書く。

* アプリ概要
* 作成背景
* 使用技術
* 機能一覧
* 画面構成
* DB設計
* AI機能の説明
* 工夫した点
* 今後の改善案
* セットアップ方法

---

## 13. READMEに書く内容案

### 作成背景

お笑いのエピソードトークを考える中で、思いついた素材を普通のメモ帳に保存しても、あとからオチや本番用のセリフに育てにくいと感じた。
そこで、エピソード、オチ、本番用セリフ、ステータスなどを分けて管理できるネタ帳アプリを作成した。

### 工夫した点

* エピソードとオチを分けて保存できる
* オチ待ちのネタだけをステータスで絞り込める
* 本番用のセリフを別項目として管理できる
* AIによるオチ生成とレビュー機能を追加予定
* シンプルなUIで、思いついたときにすぐ入力できるようにした

### 今後の改善案

* 音声入力
* タグ機能
* ネタの披露履歴
* ライブ後の反応メモ
* AIによる話し言葉変換
* AIによるフリ・オチ分解
* Vercelへのデプロイ
* 認証機能追加

---

## 14. GitHub Copilot Chatへの指示方針

Copilotには、この計画書をもとに段階的に実装させる。

一度に全部作らせず、以下のように小さく依頼する。

### 依頼例1

```text
この実装計画書に沿って、まずNext.js + TypeScriptのプロジェクト構成を確認し、必要なディレクトリと初期ページを作成してください。
まだDBやAI機能は実装しないでください。
```

### 依頼例2

```text
次に、仮データを使ってトップ画面、ネタ一覧画面、ネタ詳細画面、ネタ作成画面を実装してください。
UIはシンプルにし、スマホでも見やすいレイアウトにしてください。
```

### 依頼例3

```text
次に、Idea型とステータス定義を作成し、IdeaCard、IdeaForm、StatusBadge、StatusFilterコンポーネントを実装してください。
```

### 依頼例4

```text
次に、PrismaとPostgreSQLを導入してください。
schema.prismaにIdeaモデルとIdeaStatus enumを定義し、migration手順も説明してください。
```

### 依頼例5

```text
次に、/api/ideas のCRUD APIを実装してください。
GET, POST, GET by id, PUT, DELETEに対応してください。
```

### 依頼例6

```text
次に、画面側をAPIに接続してください。
一覧取得、詳細取得、作成、編集、削除、ステータスフィルターが動くようにしてください。
```

### 依頼例7

```text
次に、OpenAI APIを使ったAIオチ生成機能を実装してください。
生成結果はIdeaのaiPunchlineフィールドに保存してください。
```

### 依頼例8

```text
次に、AI審査員機能を実装してください。
100点満点の点数とレビューを生成し、aiScoreとaiReviewに保存してください。
```

### 依頼例9

```text
最後に、READMEを作成してください。
アプリ概要、作成背景、使用技術、機能一覧、DB設計、AI機能、工夫した点、今後の改善案、セットアップ方法を含めてください。
```

---

## 15. 1週間のスケジュール案

### Day 1

* プロジェクト作成
* GitHubリポジトリ作成
* トップ画面作成
* 仮データでネタ一覧画面作成

### Day 2

* ネタ詳細画面作成
* ネタ作成画面作成
* 共通コンポーネント作成

### Day 3

* Prisma / PostgreSQL導入
* DB設計
* migration実行

### Day 4

* CRUD API実装
* 画面とAPI接続

### Day 5

* ステータスフィルター実装
* 編集・削除機能の調整
* UI改善

### Day 6

* OpenAI API導入
* AIオチ生成機能
* AI審査員機能

### Day 7

* README作成
* コード整理
* 動作確認
* GitHubに整理してpush

---

## 16. 完成条件

最低限、以下ができていればMVP完成とする。

* トップ画面からネタ一覧・新規作成に遷移できる
* ネタを作成できる
* ネタ一覧を表示できる
* ネタ詳細を確認できる
* ネタを編集できる
* ネタを削除できる
* ステータスで絞り込める
* PostgreSQLにデータが保存される
* READMEにアプリ概要と技術構成が書かれている

余裕があれば以下も完成させる。

* AIオチ生成
* AI審査員
* AI結果のDB保存
* UIの微調整
* セットアップ手順の整備

---

## 17. 優先順位

### 最優先

* ネタのCRUD
* ステータス管理
* PostgreSQL保存
* シンプルなUI

### 次点

* AIオチ生成
* AI審査員
* README整備

### 後回し

* 認証
* デプロイ
* 音声入力
* タグ機能
* 共有機能
* 披露履歴
* 複数ユーザー対応

---

## 18. 注意点

* 最初から完璧な設計にしすぎない
* 1週間で完成させるため、機能を増やしすぎない
* AI機能よりも、まず基本のネタ管理を完成させる
* Copilotには一度に大きなタスクを依頼せず、小さい単位で依頼する
* エラーが出たら、そのエラー文をそのままCopilot Chatに貼って修正させる
* READMEは最後ではなく、開発しながら少しずつ書く
