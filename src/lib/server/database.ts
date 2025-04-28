declare module '$lib/server/database' {
    const sql: import('postgres').Sql<any>;
    export default sql;
  }