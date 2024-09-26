import Phaser from 'phaser';

import Constants from '../constants';
import States from '../states';
import { fetchRanking, Ranking } from '../ranking';
import Button from '../objects/button-object';

/** ランキングシーン */
export default class RankingScene extends Phaser.Scene {
  // 画面左から程良く間隔を開けて表示する
  private readonly pcEasyX    : number =  25;
  private readonly pcHardX    : number = 350;
  private readonly pcZariganiX: number = 675;
  
  // 画面上から程良く間隔を開けて表示する
  private readonly levelNameY  : number = 120;
  private readonly scorePadding: number = 250;
  private readonly scoreHeight : number =  50;
  
  private readonly levelTitleStyle: Phaser.Types.GameObjects.Text.TextStyle = { color: '#fff', fontSize: 30, fontStyle: 'bold', fontFamily: 'sans-serif'                 };
  private readonly nameStyle      : Phaser.Types.GameObjects.Text.TextStyle = { color: '#fff', fontSize: 25,                    fontFamily: 'sans-serif', align: 'left' , fixedWidth: 150 };  // 名前がスコアに被らないように幅を指定しておく
  private readonly scoreStyle     : Phaser.Types.GameObjects.Text.TextStyle = { color: '#fff', fontSize: 25,                    fontFamily: 'sans-serif', align: 'right' };
  
  constructor() {
    super({ key: 'RankingScene', active: false });  // シーン定義・自動実行しない
  }
  
  /** 初期化処理 */
  public create(): void {
    // 背景
    this.add.rectangle(0, 0, Constants.width, Constants.height, 0x6699ff).setOrigin(0, 0);
    
    this.add.text(Constants.width / 2, 20, 'スコアランキング', { color: '#fff', fontSize: 40, fontStyle: 'bold', fontFamily: 'sans-serif', align: 'center' }).setOrigin(.5, 0);
    
    // メインシーンに戻るボタン
    new Button(this, 80, 20, 'Back', () => {
      this.scene.start('MainScene');
    });
    
    // カーソルを調整する
    this.input.setDefaultCursor('crosshair');
    
    // ランキングデータを取得・表示する
    fetchRanking(true)  // 必ずフェッチする
      .then(() => this.showRanking())
      .catch(error => {
        console.error('[RankingScene] Failed To Fetch Ranking', error);
        this.add.text(Constants.width / 2, Constants.height / 2, 'ランキングの読み込みに失敗しました', { color: '#f00', fontSize: 30, fontStyle: 'bold', fontFamily: 'sans-serif', align: 'center' }).setOrigin(.5, 0);
      });
  }
  
  private showRanking(): void {
    this.showRankingColumn('pcEasyRanking'    , 'Easy'    , this.pcEasyX);
    this.showRankingColumn('pcHardRanking'    , 'Hard'    , this.pcHardX);
    this.showRankingColumn('pcZariganiRanking', 'Zarigani', this.pcZariganiX);
  }
  
  private showRankingColumn(stateName: string, title: string, titleX: number): void {
    this.add.text(titleX, this.levelNameY, title, this.levelTitleStyle);
    (States as any)[stateName].forEach((item: Ranking, index: number) => {
      this.add.text(titleX                    , this.levelNameY + 10 + (this.scoreHeight * (index + 1)), String(item.name) , this.nameStyle)
      this.add.text(titleX + this.scorePadding, this.levelNameY + 10 + (this.scoreHeight * (index + 1)), String(item.score), this.scoreStyle).setOrigin(1, 0);
    });
  }
}
