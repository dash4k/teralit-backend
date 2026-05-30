import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import CacheService from '../../../cache/redis-service.js';

class SessionRepositories {
  constructor() {
    this._pool = new Pool();
    this._cacheService = new CacheService();
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

    const cacheKey = `${process.env.REDIS_KEY}:sessions:${userId}`;
    await this._cacheService.delete(cacheKey);

    return result.rows[0];
  }

  async getUserSessions(userId) {
    const cacheKey = `${process.env.REDIS_KEY}:sessions:${userId}`;

    try {
      const sessions = await this._cacheService.get(cacheKey);
      return JSON.parse(sessions);
    } catch (_error) {
      const result = await this._pool.query({
        text: 'SELECT sessions.id, sessions.status, sessions.created_at, sessions.updated_at, classification_results.diagnosis FROM sessions LEFT JOIN classification_results ON classification_results.session_id = sessions.id WHERE user_id = $1 ORDER BY updated_at DESC',
        values: [userId],
      });

      const sessions = result.rows.map((session) => ({
        id: session.id,
        status: session.status,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
        diagnosis: session.diagnosis || null,
      }));

      await this._cacheService.set(cacheKey, JSON.stringify(sessions));

      return sessions;
    }
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

  async updateSessionStatus(userId, sessionId, status) {
    const updatedAt = new Date().toISOString();

    const result = await this._pool.query({
      text: 'UPDATE sessions SET status = $1, updated_at = $2 WHERE id = $3 RETURNING id, status',
      values: [status, updatedAt, sessionId],
    });

    const cacheKey = `${process.env.REDIS_KEY}:sessions:${userId}`;
    await this._cacheService.delete(cacheKey);

    return result.rows[0];
  }

  async updateSessionTimestamp(userId, sessionId) {
    const updatedAt = new Date().toISOString();

    const result = await this._pool.query({
      text: 'UPDATE sessions SET updated_at = $1 WHERE id = $2 RETURNING id, updated_at',
      values: [updatedAt, sessionId],
    });

    const cacheKey = `${process.env.REDIS_KEY}:sessions:${userId}`;
    await this._cacheService.delete(cacheKey);

    return {
      id: result.rows[0].id,
      updatedAt: result.rows[0].updated_at,
    };
  }

  async deleteSession(userId, sessionId) {
    await this._pool.query({
      text: 'DELETE FROM sessions WHERE id = $1',
      values: [sessionId],
    });

    const cacheKey = `${process.env.REDIS_KEY}:sessions:${userId}`;
    await this._cacheService.delete(cacheKey);
  }

  async getSessionImage(sessionId) {
    const result = await this._pool.query({
      text: 'SELECT file_path as path, mimetype, file_name as filename FROM session_images WHERE session_id = $1',
      values: [sessionId],
    });

    return result.rows[0];
  }
}

export default new SessionRepositories();
