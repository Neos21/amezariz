import Phaser from 'phaser';

import Constants from '../constants';
import States, { GameDevice, GameLevel, GameState, getStateNameFromGameLevel } from '../states';
import HpObject from '../objects/hp-object';
import ScoreObject from '../objects/score-object';
import ItemsObject from '../objects/items-object';
import ItemObject from '../objects/item-object';
import PlayerObject from '../objects/player-object';
import Button from '../objects/button-object';
import { fetchRanking, Ranking } from '../ranking';
import HighScoreObject from '../objects/high-score-object';

/** メインシーン */
export default class MainScene extends Phaser.Scene {
  /** 背景テクスチャのキー名 */
  private static readonly keyNameBackground: string = 'background';
  /** ゲームスタートサウンドのキー名 */
  private static readonly keyNameGameStart: string = 'game-start';
  /** ゲームオーバーサウンドのキー名 */
  private static readonly keyNameGameOver: string = 'game-over';
  
  /** 背景スプライト (横スクロールできるようにする) */
  private background!: Phaser.GameObjects.TileSprite;
  
  /** メッセージ */
  private message!: Phaser.GameObjects.Text;
  /** スタートボタン (SP Normal レベル) */
  private startButtonNormal!: Button;
  /** スタートボタン (Easy レベル) */
  private startButtonEasy!: Button;
  /** スタートボタン (Hard レベル) */
  private startButtonHard!: Button;
  /** スタートボタン (Zarigani レベル) */
  private startButtonZarigani!: Button;
  /** ランキング画面に遷移するボタン */
  private rankingButton!: Button;
  /** プレイ中のレベル表示 */
  private selectedLevel!: Phaser.GameObjects.Text;
  
  /** ボタン押下時に一瞬 `true` とすることでゲームを開始させる */
  private isStartGame: boolean = false;
  
  /** HP オブジェクト */
  private hpObject!: HpObject;
  /** スコアオブジェクト */
  private scoreObject!: ScoreObject;
  /** アイテム群オブジェクト */
  private itemsObject!: ItemsObject;
  /** プレイヤー */
  private player!: PlayerObject;
  /** ハイスコアオブジェクト */
  private highScoreObject!: HighScoreObject;
  
  constructor() {
    super({ key: 'MainScene', active: true });  // シーン定義・自動実行する (`active`)
  }
  
  /** プリロード */
  public preload(): void {
    this.load.image(MainScene.keyNameBackground, `/games/anago/${MainScene.keyNameBackground}.png`);
    this.load.image(PlayerObject.keyName       , `/games/anago/${PlayerObject.keyName}.png`);
    this.load.image(ItemObject.keyNameSora     , `/games/anago/${ItemObject.keyNameSora}.png`);
    this.load.image(ItemObject.keyNameEri      , `/games/anago/${ItemObject.keyNameEri}.png`);
    this.load.image(ItemObject.keyNameUnknown  , `/games/anago/${ItemObject.keyNameUnknown}.png`);
    this.load.image(ItemObject.keyNameEnemy    , `/games/anago/${ItemObject.keyNameEnemy}.png`);
    this.load.image(ItemObject.keyNameBomb     , `/games/anago/${ItemObject.keyNameBomb}.png`);
    this.load.audio(`sound-${MainScene.keyNameGameStart}`, `/games/anago/sound-${MainScene.keyNameGameStart}.mp3`);
    this.load.audio(`sound-${MainScene.keyNameGameOver}` , `/games/anago/sound-${MainScene.keyNameGameOver}.mp3`);
    this.load.audio(`sound-${ItemObject.keyNameSora}`    , `/games/anago/sound-${ItemObject.keyNameSora}.mp3`);
    this.load.audio(`sound-${ItemObject.keyNameEri}`     , `/games/anago/sound-${ItemObject.keyNameEri}.mp3`);
    this.load.audio(`sound-${ItemObject.keyNameUnknown}` , `/games/anago/sound-${ItemObject.keyNameUnknown}.mp3`);
    this.load.audio(`sound-${ItemObject.keyNameEnemy}`   , `/games/anago/sound-${ItemObject.keyNameEnemy}.mp3`);
    this.load.audio(`sound-${ItemObject.keyNameBomb}`    , `/games/anago/sound-${ItemObject.keyNameBomb}.mp3`);
  }
  
  /** 初期化処理 */
  public create(): void {
    // 背景 (横スクロールさせる) を配置する
    this.background = this.add.tileSprite(0, 0, Constants.width, Constants.fieldHeight, MainScene.keyNameBackground).setOrigin(0, 0);
    // ステータスバーを配置する
    this.add.rectangle(0, Constants.fieldHeight, Constants.width, Constants.height - Constants.fieldHeight, 0x3f48cc).setOrigin(0, 0).depth = 2000;  // ステータスバーのベースの重なり度にする
    
    // 初期状態のテキストを表示する (`setOrigin()` で中央揃えになるようにする)
    this.message = this.add.text(Constants.width / 2, Constants.fieldHeight / 2 - 90, 'レベルを選択してスタート', { color: '#f09', fontSize: 30, fontFamily: 'sans-serif', backgroundColor: '#f6f6f6', align: 'center' })
      .setPadding(10, 10, 10, 10)
      .setOrigin(.5, 0);
    
    if(Constants.isSpMode) {
      this.message.text = 'ボタンをタップしてスタート';
      this.startButtonNormal = new Button(this, Constants.width / 2, Constants.fieldHeight / 2 + 30, 'Normal', () => {
        States.gameDevice = GameDevice.SP;
        States.gameLevel  = GameLevel.SP;
        this.isStartGame  = true;
      });
    }
    else {
      // レベル別スタートボタンを配置する
      this.startButtonEasy = new Button(this, Constants.width / 4, Constants.fieldHeight / 2 + 30, 'Easy', () => {
        States.gameDevice = GameDevice.PC;
        States.gameLevel  = GameLevel.PC_EASY;
        this.isStartGame  = true;
      });
      this.startButtonHard = new Button(this, Constants.width / 4 * 2, Constants.fieldHeight / 2 + 30, 'Hard', () => {
        States.gameDevice = GameDevice.PC;
        States.gameLevel  = GameLevel.PC_HARD;
        this.isStartGame  = true;
      });
      this.startButtonZarigani = new Button(this, Constants.width / 4 * 3, Constants.fieldHeight / 2 + 30, 'Zarigani', () => {
        States.gameDevice = GameDevice.PC;
        States.gameLevel  = GameLevel.PC_ZARIGANI;
        this.isStartGame  = true;
      });
    }
    
    // ランキング画面へ遷移するボタン
    this.rankingButton = new Button(this, Constants.width - 80, 20, 'Rank', () => {
      this.scene.start('RankingScene');
    });
    
    // レベル表示のテキストオブジェクトを配置しておく
    this.selectedLevel = this.add.text(Constants.width / 2, Constants.statusBarTextY, 'Level', { color: '#fff', fontSize: 30, fontFamily: 'sans-serif', align: 'center' }).setOrigin(.5, 0);
    this.selectedLevel.depth = 2500;
    
    this.hpObject = new HpObject(this);        // HP 表示
    this.scoreObject = new ScoreObject(this);  // スコア表示
    this.itemsObject = new ItemsObject(this);  // アイテム群
    this.player = new PlayerObject(this, 50, Constants.fieldHeight / 2);  // プレイヤーを用意する
    this.highScoreObject = new HighScoreObject(this);  // ハイスコア登録ダイアログを用意しておく (コンストラクタ時点では非表示)
    
    // プレイヤーをカーソルに追従させる処理
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => this.player.onPointerMove(pointer, this.hpObject.hp));
    // プレイヤーとアイテムが重なった時の処理
    this.physics.add.overlap(this.player, this.itemsObject.items, (player, item) => this.onCollectItem(player as PlayerObject, item as ItemObject), undefined, this);
    // カーソルを調整する
    this.input.setDefaultCursor('crosshair');
  }
  
  /** メインループ */
  public update(): void {
    if(States.gameState === GameState.GAME_OVER) {
      if(this.isStartGame) {  // ゲーム開始の合図が出たらゲーム開始
        this.isStartGame = false;  // フラグは戻しておく
        
        this.hpObject.createTimerEvent();     // HP 監視を開始する
        this.scoreObject.createTimerEvent();  // スコア計測を開始する
        this.itemsObject.createTimerEvent();  // アイテム群の初期化・タイマー処理を開始する
        
        this.message.setVisible(false).setText('Game Over\nレベルを選択してリトライ');  // 各種ボタンを非表示にする
        if(Constants.isSpMode) {
          this.message.text = 'Game Over\nボタンをタップしてリトライ';
          this.startButtonNormal.text.setVisible(false);
        }
        else {
          this.startButtonEasy.text.setVisible(false);
          this.startButtonHard.text.setVisible(false);
          this.startButtonZarigani.text.setVisible(false);
        }
        this.rankingButton.text.setVisible(false);
        this.selectedLevel.setText(States.gameLevel);  // 難易度名
        
        this.sound.play(`sound-${MainScene.keyNameGameStart}`, { volume: .5 });
        States.gameState = GameState.PLAY;
      }
    }
    else if(States.gameState === GameState.PLAY) {
      this.background.tilePositionX += 10;  // 背景を横スクロールさせる
      
      if(this.hpObject.hp <= 0) {  // HP が 0 になったらプレイヤー落下開始
        this.player.setVelocityY(50);  // 直前までの Tween による挙動は残した方が面白そう・プレイヤー落下開始
        
        // プレイヤーが地面に付いたらゲームオーバー
        if(this.player.y >= this.player.playerMaxY) {
          this.player.setVelocityY(0);          // プレイヤーを止める
          this.hpObject.removeTimerEvent();     // HP タイマーを停止する
          this.scoreObject.removeTimerEvent();  // スコアタイマーを停止する
          this.itemsObject.removeTimerEvent();  // アイテムを止める
          
          this.sound.play(`sound-${MainScene.keyNameGameOver}`, { volume: .5 });
          States.gameState = GameState.GAME_OVER;
          
          // ハイスコアかどうかチェックする → ハイスコアなら名前入力 → 登録ボタンを用意する (名無しでの登録も可能とする) → ゲームオーバー表示に切り替える
          // ハイスコアでなければ直接ゲームオーバー表示に切り替える
          this.showGameOver();
        }
      }
      else {
        this.player.setVelocityY(0);  // HP 0 からの復帰時に重力を戻す
      }
    }
  }
  
  /** プレイヤーがアイテムを取得した時の処理 */
  private onCollectItem(player: PlayerObject, item: ItemObject): void {
    player.onCollectItem(item);                       // プレイヤーの点滅処理
    item.onCollectItem();                             // サウンド再生
    this.itemsObject.items.remove(item, true, true);  // アイテムを消す
    this.hpObject.updateHp(Math.max(this.hpObject.hp + item.point, 0));  // HP を回復 or 減少させる (負数にならないようにする)
    
    if(item.keyName === ItemObject.keyNameBomb) player.setY(player.playerMaxY);  // 爆弾を取った時に地面にぶつける = HP を減少させたことと合わせて即死にする
  }
  
  /** ゲームオーバー時のスコア判定・各種表示を行う */
  private showGameOver() {
    const score      = this.scoreObject.score;
    const gameDevice = States.gameDevice;
    const gameLevel  = States.gameLevel;
    const stateName  = getStateNameFromGameLevel(gameLevel);
    fetchRanking()
      .then(() => {
        const ranking = (States as any)[stateName] as Array<Ranking>;
        ranking.push({ id: Number.POSITIVE_INFINITY, device: gameDevice as any, level: gameLevel as any, score, name: '' });  // ダミーで今回のスコアを登録する
        // スコアの高い順・スコア同率の場合は `id` の大きい順のランキングに変換する
        ranking.sort((rankingA, rankingB) => {
          if(rankingA.score > rankingB.score) return -1;
          if(rankingA.score < rankingB.score) return  1;
          if(rankingA.id    > rankingB.id   ) return -1;
          if(rankingA.id    < rankingB.id   ) return  1;
          return 0;
        });
        const rankIndex = ranking.findIndex(rankingItem => rankingItem.id === Number.POSITIVE_INFINITY && rankingItem.score === score);
        if(rankIndex < 5) {  // ランキング入賞
          const deleteId = ranking[5].id;
          console.log('[MainScene#showGameOver()] Ranked In, Show Ranked In Dialog', { score, gameLevel, stateName, ranking, rankIndex });
          this.highScoreObject.show(rankIndex + 1, score, deleteId);
        }
        else {  // ランキング外のためゲームオーバー表示して終了する
          console.log('[MainScene#showGameOver()] Not Ranked, Show Default Game Over Dialog', { score, gameLevel, stateName, ranking, rankIndex });
          this.showDefaultGameOverDialog();
        }
      })
      .catch(error => {
        console.error('[MainScene#showGameOver()] Failed To Fetch Ranking, Show Default Game Over Dialog', error);
        this.showDefaultGameOverDialog();
      });
  }
  
  /** ゲームオーバー時の表示 : 各種ボタンを再表示にし最前面に配置する */
  public showDefaultGameOverDialog(): void {
    this.message.setVisible(true).depth = 1000;
    if(Constants.isSpMode) {
      this.startButtonNormal.text.setVisible(true).depth = 1000;
    }
    else {
      this.startButtonEasy.text.setVisible(true).depth = 1000;
      this.startButtonHard.text.setVisible(true).depth = 1000;
      this.startButtonZarigani.text.setVisible(true).depth = 1000;
    }
    this.rankingButton.text.setVisible(true).depth = 1000;
  }
}
