import Phaser from 'phaser';

import Constants from '../constants';
import States, { GameLevel } from '../states';
import ItemObject from './item-object';

/** アイテム群を抱えるオブジェクト */
export default class ItemsObject {
  /** アイテム群 */
  public items!: Phaser.GameObjects.Group;
  
  /** シーン */
  private scene!: Phaser.Scene;
  /** アイテムタイマーイベント */
  private itemsTimerEvent?: Phaser.Time.TimerEvent;
  
  /** アイテムを画面右外に配置する際の X 座標値 */
  private readonly screenRightX: number = Constants.width + Constants.itemWidth;
  /** アイテム (敵) を画面左外に配置する際の X 座標値 */
  private readonly screenLeftX: number = -Constants.itemWidth;
  
  /** アイテムを配置する際の画面上端にあたる Y 座標値 */
  private readonly minY: number = Constants.itemHeight / 2;
  /** アイテムを配置する際の画面下端 (ステータスバーまで) にあたる Y 座標値 */
  private readonly maxY: number = Constants.fieldHeight - (Constants.itemHeight / 2);
  
  /** コンストラクタ */
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.items = this.scene.add.group();
  }
  
  /** ゲームスタート時のタイマーを設定する */
  public createTimerEvent(): void {
    // アイテムを空にする
    this.items.clear(true, true);
    
    // 選択されたレベル
    const selectedLevel = States.gameLevel;
    
    // アイテムを追加し始める
    this.itemsTimerEvent = this.scene.time.addEvent({
      loop: true,   // `repeat: 0` で1回だけ実行される
      delay: selectedLevel === GameLevel.HARD ? 500 : selectedLevel === GameLevel.ZARIGANI ? 250 : 800,  // アイテム追加の頻度を決めるループタイミング
      callback: () => {
        // アイテム・敵ごとに出現率を調整して出現させる
        
        // アイテム
        const isAddItem = (() => {
          const value = Phaser.Math.Between(0, 10);
          if(selectedLevel === GameLevel.ZARIGANI) return value > 5;  // `zarigani` モードでは少なめ
          return value > 1;  // `easy`・`hard` 時の割合
        })();
        if(isAddItem) {
          const keyName = Phaser.Math.Between(0, 1) === 0 ? ItemObject.keyNameSora : ItemObject.keyNameEri;  // どちらのキャラを出すか決める
          this.items.add(new ItemObject(this.scene, this.screenRightX, Phaser.Math.Between(this.minY, this.maxY), Phaser.Math.Between(-700, -400), keyName));
        }
        
        // レアアイテム
        const isAddRareItem = Phaser.Math.Between(0, 50) === 0;
        if(isAddRareItem) {
          this.items.add(new ItemObject(this.scene, this.screenRightX, Phaser.Math.Between(this.minY, this.maxY), Phaser.Math.Between(-1400, -1000), ItemObject.keyNameUnknown));
        }
        
        // 敵
        const isAddEnemy = (() => {
          const value = Phaser.Math.Between(0, 10);
          if(selectedLevel === GameLevel.EASY || selectedLevel === GameLevel.HARD) return value > 2;
          return value > 1;  // `zarigani` モードはさらに出やすく
        })();
        if(isAddEnemy) this.items.add(new ItemObject(this.scene, this.screenLeftX, Phaser.Math.Between(this.minY, this.maxY), Phaser.Math.Between(1000, 600), ItemObject.keyNameEnemy));
        
        // 爆弾
        const isAddBomb = Phaser.Math.Between(0, 20) === 0;
        if(isAddBomb) {
          this.items.add(new ItemObject(this.scene, this.screenLeftX, Phaser.Math.Between(this.minY, this.maxY), Phaser.Math.Between(1400, 900), ItemObject.keyNameBomb));
        }
        
        // 画面外に消えたオブジェクトを削除する
        const itemsToRemove: Array<ItemObject> = [];
        this.items.children.iterate(child => {
          const item = child as ItemObject;
          if(item.keyName === ItemObject.keyNameEnemy && item.x > this.screenRightX) itemsToRemove.push(item);  // 敵が右端に消えた場合
          if(item.keyName !== ItemObject.keyNameEnemy && item.x < this.screenLeftX ) itemsToRemove.push(item);  // アイテムが左端に消えた場合
          return true;
        });
        itemsToRemove.forEach(item => this.items.remove(item));
      },
      callbackScope: this
    });
  }
  
  /** ゲームオーバー時にタイマーを止める */
  public removeTimerEvent(): void {
    this.items.children.iterate(child => {
      (child as ItemObject).setVelocityX(0);  // 場にあるアイテムを止める
      return true;
    });
    this.scene.time.removeEvent(this.itemsTimerEvent!);
    this.itemsTimerEvent = undefined;
  }
}
