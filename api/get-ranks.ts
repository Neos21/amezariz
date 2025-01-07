import { Context } from '@netlify/functions';

/** ランキングを取得する */
export default async (_request: Request, _context: Context) => {
  try {
    const dbApiResponse = await fetch(`https://app.neos21.net/db-api/sqlite/all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        db_name: 'anago',
        db_credential: process.env.DB_CREDENTIAL,
        sql: 'SELECT id, device, level, score, name FROM ranks'
      })
    });
    const dbApiJson = await dbApiResponse.json();
    if(dbApiJson.error) throw new Error(dbApiJson.error);
    
    console.error('[API get-ranks] Get Ranks', dbApiJson);
    return new Response(JSON.stringify(dbApiJson), { status: 200 });
  }
  catch(error) {
    console.error('[API get-ranks] Failed To Get Ranks', error);
    return new Response(JSON.stringify({ error: 'Failed To Get Ranks' }), { status: 500 });
  }
}
