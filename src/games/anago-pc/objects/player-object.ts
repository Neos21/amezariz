import Phaser from 'phaser';

import Constants from '../constants';
import States, { GameState, GameLevel } from '../states';
import ItemObject from './item-object';

/** プレイヤーオブジェクト */
export default class PlayerObject extends Phaser.Physics.Arcade.Sprite {
  /** テクスチャのキー名 */
  public static readonly keyName: string = 'player';
  
  /** ステータスバーに対して Collision が効かないためステータスバーとプレイヤーのサイズからカーソルの最高到達範囲を調節する */
  public static readonly playerMaxY: number = Constants.fieldHeight - (Constants.playerHeight / 2);
  
  /** コンストラクタ */
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, PlayerObject.keyName);
    // Scene の `physics.add.sprite()` 相当の処理を行う
    this.scene.add.existing(this);          // Scene への追加
    this.scene.physics.add.existing(this);  // Physics Manager への追加
    
    this.setCollideWorldBounds(true);  // 画面の枠に対する衝突判定を設ける
    this.setTint(0xe6e6e6);            // デフォルトは少し暗めにしておく
    this.setOffset(9, 1);              // 当たり判定を調整する
    this.setBodySize(Constants.playerWidth, Constants.playerHeight, false);   // 当たり判定を調整する
  }
  
  /** プレイヤーをマウスに追従させる */
  public onPointerMove(pointer: Phaser.Input.Pointer, currentHp: number): void {
    if(States.gameState === GameState.PLAY) {
      if(currentHp <= 0) return;  // HP が 0 になったら Tween を受け付けなくする
      
      this.scene.tweens.add({
        targets: this,
        x: pointer.x,
        y: Math.min(pointer.y, PlayerObject.playerMaxY),
        duration: States.gameLevel === GameLevel.EASY ? 200 : 400,  // カーソルへの追従速度
        ease: 'Sine.easeOut'
      });
    }
    else if(States.gameState === GameState.GAME_OVER) {
      if(this.scene.tweens.getTweens().length > 0) this.scene.tweens.killTweensOf(this);  // Tween の残りを殺すことで即時停止させる
    }
  }
  
  /** プレイヤーがアイテムを獲得した時の処理 */
  public onCollectItem(item: ItemObject): void {
    if([ItemObject.keyNameEnemy, ItemObject.keyNameBomb].includes(item.keyName)) {
      this.setTint(0xff0000);  // 敵・爆弾に当たった場合は赤色にする
    }
    else {
      this.setTint(0xffffff);  // アイテムを取った場合は白色にする
    }
    setTimeout(() => {
      this.setTint(0xe6e6e6);  // 色を元に戻す
    }, 500);
  }
}
