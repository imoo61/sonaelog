# scripts/

アプリ本体（`../index.html` / `../family/`）はビルド不要の静的ファイル。
このフォルダは運用ツール専用。

## pull-feedback.js — 要望の取得

アプリの「設定 → ご意見・要望」から送られた投稿（Firestore の `feedback` コレクション）を
ローカルに書き出す。書き出した内容をチャットに渡して「要望レビュー」でトリアージする。

### 初回だけの準備

1. 依存パッケージを入れる（プロジェクト直下で）
   ```
   npm install
   ```
2. サービスアカウント鍵を取得する
   - Firebase コンソール → プロジェクト設定（歯車）→ **サービス アカウント**
   - 「**新しい秘密鍵を生成**」→ ダウンロードした JSON を
     `scripts/serviceAccountKey.json` として保存
   - この鍵は **プロジェクト管理者権限の秘密**。`.gitignore` 済みだが、
     絶対にコミット・共有しない。漏れたらコンソールで鍵を失効させる

### 使い方

```
npm run pull-feedback
# または
node scripts/pull-feedback.js
```

- 出力: `scripts/feedback-dump.json`（git 管理外）
- 末尾5件の要約が標準出力に出る

### トラブル

| 症状 | 対処 |
|---|---|
| `サービスアカウント鍵が見つかりません` | 鍵を `scripts/serviceAccountKey.json` に置く。別の場所なら環境変数 `GOOGLE_APPLICATION_CREDENTIALS` にパスを指定 |
| `firebase-admin が未インストールです` | プロジェクト直下で `npm install` |
| `取得に失敗しました: ... PERMISSION_DENIED` | 鍵が別プロジェクトのもの。`sonaelog-share` の鍵か確認 |
