
import { configDotenv } from 'dotenv';
import pg from 'pg';

configDotenv();

type EnvName = 'prod' | 'preprod';

type shardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type ScriptSuccessResult = { shard: number, data: any[]}
export type ScriptFailureResult = { shard: number, error: string}
export type ScriptResult = ScriptFailureResult | ScriptSuccessResult;


export async function executeScript(sql: string, queryArguments: string[], env: EnvName, shards: shardIndex[]): Promise<ScriptResult[]> {
    const clients = await Promise.allSettled(
        shards.map(async (shardNumber) => await getClientFor(shardNumber, env))
    );

    const results: ScriptResult[] = [];

    for (let i = 0; i < clients.length; i++) {
        let client = clients[i];
        if (client.status == 'fulfilled') {
            try {
                const queryResult = await client.value.query(sql, queryArguments);
                results.push({ shard: i, data: queryResult.rows });
            } catch (e) {
                results.push({ shard: i, error: `${e}` });
            } finally {
                client.value.end()
            }
        } else {
            results.push({ shard: i, error: client.reason });
        }
    }
    return results;
}

async function getClientFor(shard: shardIndex, env: EnvName): Promise<pg.Client> {
    const client = new pg.Client(getClientConnectionForShard(shard, env))
    await client.connect();
    return client;
}

function getClientConnectionForShard(shardNumber: shardIndex, env: EnvName): pg.ClientConfig {
    const dbUrl = (
        process.env[getDatabaseVarName(env)] || ''
    ).replace(new RegExp("\\{shardIndex}", "gi"), shardNumber.toString());
    return {
        connectionString: dbUrl,
        ssl: {
            rejectUnauthorized: false,
        },
        statement_timeout: 120000,
        query_timeout: 120000,
    }
}

function getDatabaseVarName(env: EnvName) {
    return `TOAST_ORDERS_${env.toUpperCase()}`;
}
