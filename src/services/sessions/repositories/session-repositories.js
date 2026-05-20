import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class SessionRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async createSession(userId) {
    const sessionId = nanoid(16);
    const status = 'pending';
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const result = await this._pool.query({
      text: 'INSERT INTO sessions VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [sessionId, userId, status, createdAt, updatedAt],
    });

    return result.rows[0];
  }

  async getUserSessions(userId) {
    const result = await this._pool.query({
      text: 'SELECT id, status, created_at, updated_at FROM sessions WHERE user_id = $1 ORDER BY updated_at DESC',
      values: [userId],
    });

    return result.rows.map((session) => ({
      id: session.id,
      status: session.status,
      createdAt: session.created_at,
      updatedAt: session.updated_at
    }));
  }

  async verifySessionId(sessionId) {
    const result = await this._pool.query({
      text: 'SELECT id FROM sessions WHERE id = $1',
      values: [sessionId],
    });

    return result.rows.length > 0;
  }

  async verifySessionOwner(userId, sessionId) {
    const result = await this._pool.query({
      text: 'SELECT user_id FROM sessions WHERE id = $1',
      values: [sessionId],
    });

    return result.rows[0].user_id === userId;
  }

  async getUserSession(sessionId) {
    const result = await this._pool.query({
      text: 'SELECT * FROM sessions WHERE id = $1',
      values: [sessionId],
    });

    return {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      status: result.rows[0].status,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
    };
  }

  async updateSessionStatus(sessionId, status) {
    const updatedAt = new Date().toISOString();

    const result = await this._pool.query({
      text: 'UPDATE sessions SET status = $1, updated_at = $2 WHERE id = $3 RETURNING id, status',
      values: [status, updatedAt, sessionId],
    });

    return result.rows[0];
  }

  async updateSessionTimestamp(sessionId) {
    const updatedAt = new Date().toISOString();

    const result = await this._pool.query({
      text: 'UPDATE sessions SET updated_at = $1 WHERE id = $2 RETURNING id, updated_at',
      values: [updatedAt, sessionId],
    });

    return {
      id: result.rows[0].id,
      updatedAt: result.rows[0].updated_at,
    };
  }

  async deleteSession(sessionId) {
    await this._pool.query({
      text: 'DELETE FROM sessions WHERE id = $1',
      values: [sessionId],
    });
  }
}

export default new SessionRepositories();
