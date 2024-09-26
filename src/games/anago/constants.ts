const Constants = {
  // ゲーム領域のサイズ
  width : 960,
  height: 570,
  
  // フィールド領域の高さ (下 70px はステータスバー)
  fieldHeight: 500,
  
  // ステータスバーに置くテキストの表示 Y 座標 (上下に良い感じの余白が付く位置)
  statusBarTextY: 518,
  
  // プレイヤーのサイズ
  playerWidth : 50,
  playerHeight: 50,
  
  // アイテム・敵のサイズ
  itemWidth : 50,
  itemHeight: 50,
  
  // スマホモードか否か
  isSpMode: false
};

/** 画面幅が小さい時用の Constants に変更する */
export function fitToNarrowScreen() {
  Constants.width  = 700;
  Constants.height = 340;
  Constants.fieldHeight    = 290;
  Constants.statusBarTextY = 298;
  Constants.isSpMode = true;
}

export default Constants;
