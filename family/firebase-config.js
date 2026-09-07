// ============================================================
// Firebase 設定ファイル
// ------------------------------------------------------------
// 18時以降、Firebase コンソールで「ウェブアプリを追加」して表示される
// firebaseConfig の中身を、下の値に置き換えてください。
//
// ここにある apiKey / appId などは「秘密情報」ではありません。
// GitHub に公開しても問題ありません（アクセス制御は Firestore の
// セキュリティルールで行います。firestore.rules を参照）。
//
// 値が「ここに」のままの間は、アプリは自動的に
// 「この端末だけモード（ローカル専用）」で動きます。
// ============================================================
window.FIREBASE_CONFIG = {
  apiKey: "ここに-apiKey",
  authDomain: "ここに.firebaseapp.com",
  projectId: "ここに-projectId",
  storageBucket: "ここに.appspot.com",
  messagingSenderId: "ここに-senderId",
  appId: "ここに-appId"
};
