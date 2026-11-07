// Queries are authored SQL with ? placeholders; values never enter SQL text.
export function createDatabase(executor) {
  class Statement {
    constructor(sql, values = []) { this.sql = sql; this.values = values; }
    bind(...values) { return new Statement(this.sql, values); }
    query() { let index = 0; return {sql:this.sql.replace(/\?/g,()=>`$${++index}`),values:this.values}; }
    /** @template T @returns {Promise<{results:T[],meta:{changes:number}}> } */
    async all() { const r=await executor.one(this.query()); return {results:r.rows,meta:{changes:r.rowCount??0}}; }
    /** @template T @returns {Promise<T|null>} */
    async first() { return (await this.all()).results[0]??null; }
    async run() { return this.all(); }
  }
  return {prepare(sql){return new Statement(sql);},async batch(statements){return (await executor.transaction(statements.map(s=>s.query()))).map(r=>({results:r.rows,meta:{changes:r.rowCount??0}}));}};
}
