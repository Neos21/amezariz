import { PcRanking, Ranking, SpRanking } from './ranking';

/** ゲームの状態定義 */
export const GameState = {
  PLAY     : 'PLAY',
  GAME_OVER: 'GAME_OVER'
};
export type GameStateType = typeof GameState[keyof typeof GameState];

/** ゲームのデバイス定義 (小文字変換したモノを DB 登録に利用する) */
export const GameDevice = {
  SP: 'SP',
  PC: 'PC'
};
export type GameDeviceType = typeof GameDevice[keyof typeof GameDevice];

/** ゲームの難易度 (値は画面表示に利用している・小文字変換したモノを DB 登録に利用する) */
export const GameLevel = {
  SP         : 'Normal',
  PC_EASY    : 'Easy',
  PC_HARD    : 'Hard',
  PC_ZARIGANI: 'Zarigani'
};
export type GameLevelType = typeof GameLevel[keyof typeof GameLevel];

/** レベル名からランキングの State 名を取得する */
export function getStateNameFromGameLevel(gameLevel: GameLevelType): string {
  if(gameLevel === GameLevel.SP         ) return 'spRanking';
  if(gameLevel === GameLevel.PC_EASY    ) return 'pcEasyRanking';
  if(gameLevel === GameLevel.PC_HARD    ) return 'pcHardRanking';
  if(gameLevel === GameLevel.PC_ZARIGANI) return 'pcZariganiRanking';
  throw new Error('Invalid Game Level');
}

/** State 管理 */
const States: {
  gameState : GameStateType,
  gameDevice: GameDeviceType,
  gameLevel : GameLevelType,
  rawRanking       : Array<Ranking> | null,
  spRanking        : Array<SpRanking>,
  pcEasyRanking    : Array<PcRanking>,
  pcHardRanking    : Array<PcRanking>,
  pcZariganiRanking: Array<PcRanking>
} = {  // 初期状態
  gameState : GameState.GAME_OVER,
  gameDevice: GameDevice.PC,
  gameLevel : GameLevel.PC_EASY,
  rawRanking       : null,  // `null` でなくなった場合は以下の各ランキングも設定されている
  spRanking        : [],
  pcEasyRanking    : [],
  pcHardRanking    : [],
  pcZariganiRanking: []
};

export default States;
