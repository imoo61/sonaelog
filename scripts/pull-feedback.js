/**
 * feedback コレクションをローカルに書き出すツール。
 *
 *   node scripts/pull-feedback.js
 *
 * 出力: scripts/feedback-dump.json（git 管理外）
 *
 * 事前準備は scripts/README.md を参照。
 * サービスアカウント鍵は scripts/serviceAccountKey.json に置くか、
 * 環境変数 GOOGLE_APPLICATION_CREDENTIALS でパスを指定する。
 */
const fs = require('fs');
const path = require('path');

const KEY_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(KEY_PATH)) {
  console.error('サービスアカウント鍵が見つかりません: ' + KEY_PATH);
  console.error('scripts/README.md の手順で鍵を取得し、scripts/serviceAccountKey.json に置いてください。');
  process.exit(1);
}

let admin;
try {
  admin = require('firebase-admin');
} catch (e) {
  console.error('firebase-admin が未インストールです。プロジェクト直下で `npm install` を実行してください。');
  process.exit(1);
}

admin.initializeApp({ credential: admin.cert(require(KEY_PATH)) });

(async () => {
  const snap = await admin
    .firestore()
    .collection('feedback')
    .orderBy('createdAt', 'asc')
    .get();

  const rows = snap.docs.map((d) => {
    const x = d.data() || {};
    const ts = x.createdAt && x.createdAt.toDate ? x.createdAt.toDate().toISOString() : null;
    return { id: d.id, createdAt: ts, appVersion: x.appVersion || null, text: x.text || '' };
  });

  const outPath = path.join(__dirname, 'feedback-dump.json');
  fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), 'utf8');

  console.log(rows.length + ' 件を書き出しました → ' + outPath);
  rows.slice(-5).forEach((r) => {
    console.log('  [' + (r.createdAt || '?') + '] (' + (r.appVersion || '?') + ') ' + r.text.replace(/\s+/g, ' ').slice(0, 60));
  });
  process.exit(0);
})().catch((e) => {
  console.error('取得に失敗しました:', e && e.message ? e.message : e);
  process.exit(1);
});
