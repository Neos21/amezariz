/** ゲームの状態定義 */
export const GameState = {
  PLAY     : 'PLAY',
  GAME_OVER: 'GAME_OVER'
};
export type GameStateType = typeof GameState[keyof typeof GameState];

/** ゲームの難易度 */
export const GameLevel = {
  EASY    : 'Easy',
  HARD    : 'Hard',
  ZARIGANI: 'Zarigani'
};
export type GameLevelType = typeof GameLevel[keyof typeof GameLevel];

/** ステート管理 */
const States: {
  gameState: GameStateType,
  gameLevel: GameLevelType
} = {  // 初期状態
  gameState: GameState.GAME_OVER,
  gameLevel: GameLevel.EASY
};

export default States;
