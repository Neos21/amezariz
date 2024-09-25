import Phaser from 'phaser';

import Constants from '../constants';
import Button from '../objects/button-object';

type SpRanking = {
  device: 'sp',
  level : 'normal',
  score : number,
  name  : string
};
type PcRanking = {
  device: 'pc',
  level : 'easy' | 'hard' | 'zarigani',
  score : number,
  name  : string
};
type Ranking = SpRanking | PcRanking;

/** スコアの高い順にソートする */
const sortByScoreDesc = (itemA: Ranking, itemB: Ranking) => {
  if(itemA.score > itemB.score) return -1;
  if(itemA.score < itemB.score) return  1;
  return 0;
};

/** ランキングシーン */
export default class RankingScene extends Phaser.Scene {
  private readonly pcEasyX     : number =  25;
  private readonly pcHardX     : number = 350;
  private readonly pcZariganiX : number = 675;
  private readonly levelNameY  : number = 120;
  private readonly scorePadding: number = 250;
  private readonly scoreHeight : number =  50;
  
  private readonly levelTitleStyle: Phaser.Types.GameObjects.Text.TextStyle = { color: '#fff', fontSize: 30, fontStyle: 'bold', fontFamily: 'sans-serif'                 };
  private readonly nameStyle      : Phaser.Types.GameObjects.Text.TextStyle = { color: '#fff', fontSize: 30,                    fontFamily: 'sans-serif', align: 'left'  };
  private readonly scoreStyle     : Phaser.Types.GameObjects.Text.TextStyle = { color: '#fff', fontSize: 30,                    fontFamily: 'sans-serif', align: 'right' };
  
  constructor() {
    super({ key: 'RankingScene', active: false });  // シーン定義・自動実行しない
  }
  
  /** 初期化処理 */
  public create(): void {
    // 背景
    this.add.rectangle(0, 0, Constants.width, Constants.height, 0x6699ff).setOrigin(0, 0);
    
    this.add.text(Constants.width / 2, 20, 'スコアランキング', { color: '#fff', fontSize: 40, fontStyle: 'bold', fontFamily: 'sans-serif', align: 'center' }).setOrigin(0.5, 0);
    
    // メインシーンに戻るボタン
    new Button(this, 80, 20, 'Back', () => {
      this.scene.start('MainScene');
    });
    
    // カーソルを調整する
    this.input.setDefaultCursor('crosshair');
    
    // ランキングデータを取得する
    fetch('/api/get-ranks')
      .then(response => response.json())
      .then(json => this.showRanking(json.results))
      .catch(error => {
        console.error('Failed To Get Ranks', error);
        this.add.text(Constants.width / 2, Constants.height / 2, 'ランキングの読み込みに失敗しました', { color: '#f00', fontSize: 30, fontStyle: 'bold', fontFamily: 'sans-serif', align: 'center' }).setOrigin(0.5, 0);
      });
  }
  
  private showRanking(results: Array<Ranking>): void {
    this.showRankingColumn(results, 'Easy'    , 'pc', 'easy'    , this.pcEasyX);
    this.showRankingColumn(results, 'Hard'    , 'pc', 'hard'    , this.pcHardX);
    this.showRankingColumn(results, 'Zarigani', 'pc', 'zarigani', this.pcZariganiX);
  }
  
  private showRankingColumn(results: Array<Ranking>, title: string, device: string, level: string, titleX: number) {
    this.add.text(titleX, this.levelNameY, title, this.levelTitleStyle);
    results
      .filter((item: Ranking) => item.device === device && item.level === level)
      .sort(sortByScoreDesc)
      .slice(0, 5)  // 上5件だけに確実に絞る (5件未満の場合はその数になる)
      .forEach((item: Ranking, index: number) => {
        this.add.text(titleX                    , this.levelNameY + 10 + (this.scoreHeight * (index + 1)), String(item.name) , this.nameStyle)
        this.add.text(titleX + this.scorePadding, this.levelNameY + 10 + (this.scoreHeight * (index + 1)), String(item.score), this.scoreStyle).setOrigin(1, 0);
      });
  }
}
