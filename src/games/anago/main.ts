import Phaser from 'phaser';

import Constants, { fitToNarrowScreen } from './constants';
import MainScene from './scenes/main-scene';
import RankingScene from './scenes/ranking-scene';

// スマホ用にサイズを変更したい場合はココで定数を差し替えてからゲームを起動する (type="module" なので DOMContentLoaded タイミングで実行される)
if(window.innerWidth < 960) {
  fitToNarrowScreen();
  console.log('Main : SP Mode', window.innerWidth, Constants);
}
else {
  console.log('Main : PC Mode', window.innerWidth, Constants);
}

/** ゲーム設定 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,  // デフォルトは WebGL・うまく動作しない場合は Canvas にフォールバックする
  width : Constants.width,
  height: Constants.height,
  parent: 'app',  // 親要素の `id` 属性を指定する
  scale: {
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY  // 画面の左右中央に揃える
  },
  physics: {
    default: 'arcade',  // デフォルトの物理演算システムを指定する
    arcade: {
      gravity: {
        x: 0,  // 横方向の重力はナシのため `0` で良い
        y: 0   // 縦方向の重量はデフォルトでナシにしておく
      },
      debug: false  // `true` にするとデバッグ用の枠が出る
    }
  },
  dom: {
    createContainer: true  // テキストボックス表示のために必要
  },
  scene: [MainScene, RankingScene]
};

// ゲーム開始
new Phaser.Game(config);
