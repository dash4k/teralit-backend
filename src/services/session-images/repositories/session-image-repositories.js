import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class SessionImageRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async createSessionImage(sessionId, { filename, path, mimetype }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();

    const result = await this._pool.query({
      text: 'INSERT INTO session_images VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, mimetype',
      values: [id, sessionId, path, filename, mimetype, createdAt],
    });

    return result.rows[0];
  }

  async getSessionImage(sessionId) {
    const result = await this._pool.query({
      text: 'SELECT file_name, file_path FROM session_images WHERE session_id = $1',
      values: [sessionId],
    });

    return {
      filename: result.rows[0].file_name,
      path: result.rows[0].file_path,
    };
  }
}

export default new SessionImageRepositories();
