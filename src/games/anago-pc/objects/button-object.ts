import Phaser from 'phaser';

/** ボタンオブジェクト */
export default class Button extends Phaser.GameObjects.Container {
  /** テキストオブジェクト */
  public text: Phaser.GameObjects.Text;
  
  constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClickFunction: Function = () => null) {
    super(scene, x, y);
    this.scene = scene;
    this.scene.add.existing(this);
    
    this.text = this.scene.add.text(x, y, text, { color: '#08f', fontSize: 30, fontFamily: 'sans-serif', backgroundColor: '#f6f6f6', align: 'center' })
      .setPadding(20, 10, 20, 10)
      .setOrigin(0.5, 0)
      .setInteractive({ useHandCursor: true })  // インタラクティブ対応する・マウスポインタにする
      .on('pointerover', () => {  // ポインタが重なった時
        this.text.setColor('#f09');
      })
      .on('pointerout', () => {  // ポインタが外れた時
        this.text.setColor('#08f');
      })
      .on('pointerdown', () => {  // 押下した時
        this.text.setColor('#0c3');
      })
      .on('pointerup', () => {  // 離した時
        onClickFunction();  // クリックされた時のコールバックを実行する
        this.text.setColor('#f09');  // `pointerover` 時と同じにすると自然
      });
  }
}

// - 参考 : https://snowbillr.github.io/blog/2018-07-03-buttons-in-phaser-3/
// - 参考 : https://qiita.com/S-Kaito/items/85a1c90c86e61156c87d
// - 参考 : https://ysko909.github.io/posts/make-button-class-with-phaserjs/
