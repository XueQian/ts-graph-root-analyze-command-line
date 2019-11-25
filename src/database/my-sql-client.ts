import { createPool, Pool } from "mysql2/promise";
import { DbClient } from "./DbClient";

class MySql implements DbClient {
  private pool: Pool;

  public constructor(host: string, user: string, password: string, database: string, connectionLimit = 5) {
    this.pool = createPool({
      host,
      database,
      user,
      password,
      connectionLimit
    });
  }

  public async query(sql: string): Promise<any> {
    console.log(`Query mysql: ${sql}`);
    const connection = await this.pool.getConnection();
    try {
      const [items] = await connection.query(sql);
      return items;
    } catch (e) {
      console.error(`Error happened when execute the query to mysql: ${e}`);
      throw e;
    } finally {
      console.log(`release current db connection...`);
      await connection.release();
    }
  }

  public async close() {
    console.log("close mysql pool...");
    await this.pool.end();
  }
}

export { MySql };
