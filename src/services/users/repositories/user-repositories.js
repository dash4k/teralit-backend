import { Pool } from 'pg';

class UserRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async getUser(id) {
    const result = await this._pool.query({
      text: 'SELECT email, name, updated_at FROM users WHERE id = $1',
      values: [id],
    });

    return {
      email: result.rows[0].email,
      name: result.rows[0].name,
      updatedAt: result.rows[0].updated_at,
    };
  }

  async updateUser(id, name) {
    const updatedAt = new Date().toISOString();

    const result = await this._pool.query({
      text: 'UPDATE users SET name = $1, updated_at = $2 WHERE id = $3',
      values: [name, updatedAt, id],
    });

    return result.rows[0];
  }

  async deleteUser(id) {
    await this._pool.query({
      text: 'DELETE FROM users WHERE id = $1',
      values: [id],
    });
  }
}

export default new UserRepositories();
