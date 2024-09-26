import Phaser from 'phaser';
import InputText from 'phaser3-rex-plugins/plugins/inputtext';

import Constants from '../constants';
import Button from './button-object';
import MainScene from '../scenes/main-scene';
import States from '../states';

/** ハイスコア登録ダイアログ */
export default class HighScoreObject extends Phaser.GameObjects.Container {
  /** ダイアログボックス枠 */
  private dialogBox!: Phaser.GameObjects.Rectangle;
  /** メッセージ */
  private message!: Phaser.GameObjects.Text;
  /** テキストボックス */
  private inputText!: InputText;
  /** 登録ボタン */
  private registerButton!: Button;
  
  /** 登録するハイスコア */
  private score: number | null = null;
  /** ランキング更新により削除する ID */
  private deleteId: number | null = null;
  
  /** 登録ボタンの二度押し防止用 */
  private isClicked: boolean = false;
  
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.scene = scene;
    
    // ダイアログ枠
    this.dialogBox = this.scene.add.rectangle(Constants.width / 2, Constants.fieldHeight / 2, 480, 250, 0x0088ff).setOrigin(.5, .5);  // PC でも SP でも枠のサイズは同じにする
    this.dialogBox.depth = 3000;  // ベースの重なり度合いにする
    
    // メッセージ
    this.message = this.scene.add.text(Constants.width / 2, Constants.fieldHeight / 2 - 90, 'ランクインしました!', { color: '#fff', fontSize: 27, fontStyle: 'bold', fontFamily: 'sans-serif', align: 'center' })
      .setPadding(10, 10, 10, 10)
      .setOrigin(.5, 0);
    this.message.depth = 3050;
    
    // テキストボックス
    this.inputText = new InputText(this.scene, Constants.width / 2, Constants.fieldHeight / 2, (Constants.width / 2) - 40, 45, {
      type: 'text',
      // Element Properties
      text        : '',
      placeholder : '名前を入力',
      spellCheck  : false,
      maxLength   : 6,  // ランキング画面に表示できる幅に合わせて…
      autoComplete: 'off',
      // Styles
      color          : '#fff',
      fontSize       : '30px',
      fontFamily     : 'sans-serif',
      paddingTop     : '20px',
      paddingRight   : '10px',
      paddingBottom  : '20px',
      paddingLeft    : '10px',
      backgroundColor: '#b0b0b0'
    })
      .setDepth(3050);
    this.scene.add.existing(this.inputText);
    
    // 登録ボタン
    this.registerButton = new Button(this.scene, Constants.width / 2, Constants.fieldHeight / 2 + 50, '登録', () => {
      if(this.isClicked) return console.log('二度押し防止');
      this.isClicked = true;
      
      const device    = States.gameDevice.toLowerCase();  // DB 格納値に合わせる
      const level     = States.gameLevel.toLowerCase();   // DB 格納値に合わせる
      const score     = this.score;
      const name      = this.inputText.text.trim() || '名無し';
      const delete_id = this.deleteId;  // API コール用にスネークケースにする
      fetch('/api/update-rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device, level, score, name, delete_id })
      })
        .then(response => response.json())
        .then(json => {
          console.log('[HighScoreObject] Score Updated', json);
          this.score = this.deleteId = null;  // ハイスコア登録用の情報を削除しておく
          this.hide();  // このダイアログを隠す
          (this.scene as MainScene).showDefaultGameOverDialog();  // ゲームオーバー画面を出す
          this.isClicked = false;  // フラグを戻しておく
        })
        .catch(error => {
          console.error('[HighScoreObject] Failed To Update Score', error);
          alert('ハイスコア登録に失敗しました。ゴメンネ！');  // どうしようもないので…
          this.score = this.deleteId = null;  // ハイスコア登録用の情報を削除しておく
          this.hide();  // このダイアログを隠す
          (this.scene as MainScene).showDefaultGameOverDialog();  // ゲームオーバー画面を出す
          this.isClicked = false;  // フラグを戻しておく
        });
    });
    this.registerButton.text.depth = 3050;
    
    this.hide();  // コンストラクタ時点では非表示とし任意タイミングで表示させる
  }
  
  /** 全ての要素を表示する */
  public show(rankNumber: number, score: number, deleteId: number): void {
    this.inputText.text = '';
    this.score          = score;
    this.deleteId       = deleteId;
    
    this.message.text = `あなたは ${rankNumber}位 にランクインしました!`;
    this.dialogBox.visible = this.message.visible = this.inputText.visible = this.registerButton.text.visible = true;
  }
  
  /** 全ての要素を隠す */
  public hide(): void {
    this.dialogBox.visible = this.message.visible = this.inputText.visible = this.registerButton.text.visible = false;
  }
}
