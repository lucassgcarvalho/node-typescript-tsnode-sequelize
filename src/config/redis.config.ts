import redis, {RedisClient} from 'redis';
import asyncRedis from 'async-redis';
//import AsyncRedis = require("../../node_modules/@types/async-redis")
import winston from "winston";


require('dotenv').config();

export default class RedisServer {
    public static redisClient: RedisConfig;

    constructor() {
        RedisServer.redisClient = new RedisConfig();
    }
}

class RedisConfig {
    private asyncRedis: RedisClient;

    constructor() {
        // @ts-ignore
        this.asyncRedis = asyncRedis.createClient({
            host: `${process.env["REDIS_HOST"]}`,
            port: Number(`${process.env.REDIS_PORT}`),
            password: `${process.env.REDIS_PASSWORD}`
        });
    }

    private onError() {
        /* this.asyncRedis.on("error", function (error) {
             winston.error(error);
         });*/
    }

    public async put(key: string, value: string): Promise<void> {
        await this.asyncRedis.set(key, value);
    }

    public async setKeyValueExpiration(key: string, value: string, expirationTimeMilliseconds: number = (60 * 60000)): Promise<boolean> {
        const inserted =  await this.asyncRedis.psetex(key, expirationTimeMilliseconds, value );
        return inserted;
    }

    public async get(key: string): Promise<any> {
        const get = await this.asyncRedis.send_command(`get`, [`${key}`] );
        return get;
    }

    public async getListOf(key: string): Promise<any> {
        const get2 = await this.asyncRedis.keys(`${key}*`);
        return get2;
    }

    public async getValueOfList(keys: []): Promise<any> {
        const list = await this.asyncRedis.mget(keys);
        return list;
    }

    public async delete(key: string, field?: string): Promise<any> {
        let execution = [key]
        if(field)
            execution = [key, field]
        const removed =  await this.asyncRedis.send_command("hdel", execution );
        return removed;
    }

    public async hGet(key: string, field: string): Promise<any> {
        const result = await this.asyncRedis.hget(key, field);
        return result;

    }
}

/*class RedisConfig {

    //private readonly redisClient!: redis.RedisClient;
    //private _asyncRedisClient!:RedisClient;

    constructor() {
        this.redisClient = redis.createClient({
            host: `${process.env["REDIS_HOST"]}`,
            port: Number(`${process.env.REDIS_PORT}`),
            password: `${process.env.REDIS_PASSWORD}`
        });
        this.onError();
        this._asyncRedisClient =  asyncRedis.decorate(this.redisClient);
        // this.redisClient.set("key", "value2", redis.print);
        //this.redisClient.get("key", redis.print);
        /!*    this.put('key', 'teste');
            this.get('key');*!/
    }

    private onError() {
        this.redisClient.on("error", function (error) {
            winston.error(error);
        });
    }
    get asyncRedisClient() {
        return this._asyncRedisClient;
    }

    public async put(key: string, value: string): Promise<void> {
        this._asyncRedisClient.set(key, value);
    }

    public async hSetnx(key: string, field: string, value: string): Promise<void> {
        this.redisClient.hsetnx(key, field, value);
    }

    public async expire(key: string, value: string, expirationTimeMilliseconds: number): Promise<void> {
        this.redisClient.psetex(key, expirationTimeMilliseconds, value);
    }

    public async get(key: string): Promise<any> {
        return this.redisClient.get(key, redis.print);
    }

    public async delete(key: string, field: string): Promise<any> {
        return this.redisClient.rpushx(key, field, function (err, reply) {
            if(err)
                winston.error(`Couldn't to remove [${field}] from ${key} on error ${err}`)
            else
                winston.info(`Removed [${field}] from ${key} with reply ${reply}`)
        });
    }

    public hGet(key: string, field: string): any {
        return this.redisClient.hget(key, field, function (err, reply) {
            if(err)
                winston.error(`No [${field}] from ${key} on error ${err}`)
            else
                winston.info(`Retrieved [${field}] from ${key} with reply ${reply}`)
            return reply;
        });
    }

}*/
