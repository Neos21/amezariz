import States from './states';

/** スマホ版ランキング */
export type SpRanking = {
  id    : number,
  device: 'sp',
  level : 'normal',
  score : number,
  name  : string
};
/** PC 版ランキング */
export type PcRanking = {
  id    : number,
  device: 'pc',
  level : 'easy' | 'hard' | 'zarigani',
  score : number,
  name  : string
};
/** ランキング */
export type Ranking = SpRanking | PcRanking;

/** ランキングを API から取得し State に保存する */
export async function fetchRanking(isForceFetch: boolean = false): Promise<Array<Ranking>> {
  if(!isForceFetch && States.rawRanking != null) return States.rawRanking;
  return await fetch('/api/get-ranks')
    .then(response => response.json())
    .then(json => {
      console.log('[fetchRanking()] Ranking Fetched', json.results);
      setRankingToState(json.results, 'sp', 'normal'  , 'spRanking'        );
      setRankingToState(json.results, 'pc', 'easy'    , 'pcEasyRanking'    );
      setRankingToState(json.results, 'pc', 'hard'    , 'pcHardRanking'    );
      setRankingToState(json.results, 'pc', 'zarigani', 'pcZariganiRanking');
      States.rawRanking = json.results as Array<Ranking>;
      return States.rawRanking;
    });
  
  /** 各ランキングを State に保存する */
  function setRankingToState(results: Array<Ranking>, device: string, level: string, stateName: string): void {
    (States as any)[stateName] = results
      .filter(item => item.device === device && item.level === level)
      .sort((itemA, itemB) => {  // スコアの高い順に並べる
        if(itemA.score > itemB.score) return -1;
        if(itemA.score < itemB.score) return  1;
        return 0;
      })
      .slice(0, 5);  // 上5件だけに確実に絞る (5件未満の場合はその数になる)
  }
}

