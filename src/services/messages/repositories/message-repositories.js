import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class MessageRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async createMessage(sessionId, message) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const { role, content } = message;

    await this._pool.query({
      text: 'INSERT INTO messages VALUES($1, $2, $3, $4, $5)',
      values: [id, sessionId, role, content, createdAt],
    });
  }

  async getMessages(sessionId) {
    const result = await this._pool.query({
      text: 'SELECT role, content, created_at FROM messages WHERE session_id = $1',
      values: [sessionId],
    });

    return result.rows.map((message) => ({
      role: message.role,
      content: message.content,
      createdAt: message.created_at,
    }));
  }
}

export default new MessageRepositories();
