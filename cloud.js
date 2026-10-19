/* Persistencia compartida con control optimista de versiones. */
(function (root) {
  'use strict';
  class CloudConflict extends Error {
    constructor() { super('Otro equipo guardó cambios. Se cargarán los datos recientes; revisa y vuelve a guardar.'); this.name = 'CloudConflict'; }
  }
  class CloudRepository {
    constructor(client, validate) {
      this.client = client;
      this.validate = validate;
      this.table = 'transintercol_fleet';
      this.userId = null;
      this.revision = null;
    }
    clear() { this.userId = null; this.revision = null; }
    accept(row, userId) {
      if (!row || row.owner_id !== userId || !Number.isSafeInteger(row.revision) || row.revision < 1 || !this.validate(row.payload)) {
        throw new Error('La base de datos devolvió información no válida. No se ha reemplazado ningún registro.');
      }
      this.userId = userId;
      this.revision = row.revision;
      return structuredClone(row.payload);
    }
    async load(userId) {
      let result = await this.client.from(this.table).select('owner_id,payload,revision,updated_at').eq('owner_id', userId).maybeSingle();
      if (result.error) throw result.error;
      if (!result.data) {
        result = await this.client.from(this.table).insert({owner_id:userId,payload:{version:1,vehicles:[]},revision:1}).select('owner_id,payload,revision,updated_at').single();
        // Dos equipos pueden abrir la cuenta por primera vez a la vez.
        if (result.error && result.error.code === '23505') {
          result = await this.client.from(this.table).select('owner_id,payload,revision,updated_at').eq('owner_id',userId).maybeSingle();
        }
        if (result.error) throw result.error;
      }
      return this.accept(result.data, userId);
    }
    async commit(payload) {
      if (!this.userId || this.revision === null) throw new Error('Primero inicia sesión y carga los datos compartidos.');
      if (!this.validate(payload)) throw new Error('Los datos no son válidos. No se guardó ningún cambio.');
      if (new TextEncoder().encode(JSON.stringify(payload)).byteLength > 10000000) throw new Error('El respaldo supera el límite de 10 MB.');
      const owner = this.userId, revision = this.revision;
      const result = await this.client.from(this.table).update({payload,revision:revision+1})
        .eq('owner_id',owner).eq('revision',revision).select('owner_id,payload,revision,updated_at').maybeSingle();
      if (result.error) throw result.error;
      if (!result.data) throw new CloudConflict();
      return this.accept(result.data, owner);
    }
  }
  const api = {CloudRepository, CloudConflict};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof window !== 'undefined' ? window : globalThis);
