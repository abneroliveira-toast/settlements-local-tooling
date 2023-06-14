import { configDotenv } from 'dotenv';
import pg from 'pg';
import { EnvName, ScriptResult, ScriptExecutionArguments, shardIndex } from './types.js';

configDotenv();

export async function executeScript(
  scriptExecArguments: ScriptExecutionArguments
): Promise<ScriptResult[]> {
  const { shards, sql, queryArguments, env, shardAsLastQueryArgument } =
  scriptExecArguments;
  const clients = await Promise.allSettled(
    shards.map(async (shardNumber) => await getClientFor(shardNumber, env))
  );

  const results: ScriptResult[] = [];

  for (let i = 0; i < clients.length; i++) {
    let client = clients[i];
    if (client.status == 'fulfilled') {
      try {
        const queryArgumentsToPass = shardAsLastQueryArgument
          ? [...queryArguments, shards[i]]
          : queryArguments;
        const queryResult = await client.value.query(sql, queryArgumentsToPass);
        results.push({ shard: i, data: queryResult.rows });
      } catch (e) {
        results.push({ shard: i, error: `${e}` });
      } finally {
        client.value.end();
      }
    } else {
      results.push({ shard: i, error: client.reason });
    }
  }
  return results;
}

async function getClientFor(
  shard: shardIndex,
  env: EnvName
): Promise<pg.Client> {
  const client = new pg.Client(getClientConnectionForShard(shard, env));
  await client.connect();
  return client;
}

function getClientConnectionForShard(
  shardNumber: shardIndex,
  env: EnvName
): pg.ClientConfig {
  const dbUrl = (process.env[getDatabaseVarName(env)] || '').replace(
    new RegExp('\\{shardIndex}', 'gi'),
    shardNumber.toString()
  );
  return {
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false,
    },
    statement_timeout: 120000,
    query_timeout: 120000,
  };
}

function getDatabaseVarName(env: EnvName) {
  return `TOAST_ORDERS_${env.toUpperCase()}`;
}
