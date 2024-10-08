import Phaser from 'phaser';

import Constants from '../constants';

/** HP オブジェクト */
export default class HpObject {
  /** HP デフォルト値 */
  private readonly defaultHp: number = 500;
  /** 共用するテキストスタイル */
  private readonly textStyle: Phaser.Types.GameObjects.Text.TextStyle = { color: '#fff', fontSize: 30, fontFamily: 'sans-serif' };
  
  /** HP */
  public hp!: number;
  
  /** シーン */
  private scene!: Phaser.Scene;
  /** HP テキスト */
  private hpText!: Phaser.GameObjects.Text;
  /** HP タイマーイベント */
  private hpTimerEvent?: Phaser.Time.TimerEvent;
  
  /** コンストラクタ */
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    // 「HP :」の固定文言・一度書いたら二度と動かさない
    this.scene.add.text(Constants.width - 200, Constants.statusBarTextY, 'HP :', this.textStyle).depth = 2500;  // ステータスバーの重なり度より上げる
    // 初期値を与える
    this.hp = 0;
    // HP 表示
    this.hpText = this.scene.add.text(Constants.width - 40, Constants.statusBarTextY, String(this.hp), this.textStyle).setOrigin(1, 0);  // 右揃え
    this.hpText.depth = 2500;
  }
  
  /** ゲームスタート時のタイマーを設定する */
  public createTimerEvent(): void {
    this.updateHp(this.defaultHp);  // ゲームスタート時のデフォルト値を与える
    this.hpTimerEvent = this.scene.time.addEvent({
      loop: true,  // 停止するまで永遠にループする
      delay: 500,  // 処理間隔
      callback: () => this.updateHp(Math.max(this.hp - 10, 0)),  // 時間経過で減少する・負数が出ないようにする
      callbackScope: this
    });
  }
  
  /** ゲームオーバー時にタイマーを止める */
  public removeTimerEvent(): void {
    this.scene.time.removeEvent(this.hpTimerEvent!);
    this.hpTimerEvent = undefined;
  }
  
  /** HP を更新する */
  public updateHp(newHp: number): void {
    this.hp = newHp;
    this.hpText.setText(String(newHp));
  }
}
