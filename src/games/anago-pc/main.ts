import Phaser from 'phaser';

import Constants from './constants';
import MainScene from './scenes/main-scene';
import RankingScene from './scenes/ranking-scene';

// TODO: スマホ用にサイズなどを変更したい場合はココで定数を差し替えてからゲームを起動する (type="module" なので DOMContentLoaded タイミングで実行される)
//if(window.innerWidth < 600) Constants.width = 300;

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
  scene: [MainScene, RankingScene]
};

// ゲーム開始
new Phaser.Game(config);
