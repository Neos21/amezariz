import { Context } from '@netlify/functions';

/** ランキングを更新する */
export default async (request: Request, _context: Context) => {
  try {
    const body = await request.json();
    console.log('[API update-rank] Request Body', body);
    
    // Validate
    if(!['sp', 'pc'].includes(body.device)) throw new Error('Invalid Device Name');
    if(!['normal', 'easy', 'hard', 'zarigani'].includes(body.level)) throw new Error('Invalid Level');
    if(body.score == null) throw new Error('Invalid Score');
    if(body.delete_id == null) throw new Error('Invalid Delete ID');
    // 名前は空欄を許容する
    const name = body.name == null || String(body.name).trim() === '' ? '名無し' : String(body.name).trim();
    
    // ランキングを登録する
    const insertResponse = await fetch(`https://app.neos21.net/db-api/sqlite/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        db_name: 'anago',
        db_credential: process.env.DB_CREDENTIAL,
        sql: 'INSERT INTO ranks (device, level, score, name) VALUES (?, ?, ?, ?)',
        params: [body.device, body.level, body.score, name]
      })
    });
    const insertJson = await insertResponse.json();
    if(insertJson.error) throw new Error(insertJson.error);
    
    // ランク外となった ID を削除する
    const deleteResponse = await fetch(`https://app.neos21.net/db-api/sqlite/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        db_name: 'anago',
        db_credential: process.env.DB_CREDENTIAL,
        sql: 'DELETE FROM ranks WHERE id = ?',
        params: [body.delete_id]
      })
    });
    const deleteJson = await deleteResponse.json();
    if(deleteJson.error) throw new Error(deleteJson.error);
    
    console.log('[API update-rank] Ranking Updated', insertJson, deleteJson);
    return new Response(JSON.stringify({ result: 'Ranking Updated' }), { status: 200 });
  }
  catch(error) {
    console.error('[API update-rank] Failed To Update Ranking', error);
    return new Response(JSON.stringify({ error: 'Failed To Update Ranking : ' + error.toString() }), { status: 500 });
  }
}
