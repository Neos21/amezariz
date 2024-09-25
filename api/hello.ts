import { Config, Context } from '@netlify/functions';

export default async (request: Request, context: Context) => {
  const body = await request.json();
  return new Response(JSON.stringify({ message: 'Welcome! ' + process.env.DB_CREDENTIAL + ' ' + request.method + ' ' + JSON.stringify(body) }));
}

export const config: Config = {
  method: 'POST'
};
