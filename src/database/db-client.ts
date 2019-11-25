interface DbClient {
  query(sql: string): any;

  close(): void;
}

export { DbClient };
