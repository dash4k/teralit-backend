import { Pool } from 'pg';
import bcrypt from 'bcrypt';

class AuthenticationRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async verifyEmailExist(email) {
    const result = await this._pool.query({
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    });

    return result.rows.length > 0;
  }

  async verifyUserCredentials(email, password) {
    const result = await this._pool.query({
      text: 'SELECT id, email, password FROM users WHERE email = $1',
      values: [email],
    });

    if (!result.rows.length) return false;

    const { id, password: hashedPassword } = result.rows[0];
    const passwordCorrect = await bcrypt.compare(password, hashedPassword);

    if (!passwordCorrect) return false;

    return id;
  }

  async verifyRefreshToken(refreshToken) {
    const result = await this._pool.query({
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [refreshToken],
    });

    if (!result.rows.length) return false;

    return result.rows[0];
  }

  async deleteRefreshToken(refreshToken) {
    await this._pool.query({
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [refreshToken],
    });
  }
};

export default new AuthenticationRepositories();
