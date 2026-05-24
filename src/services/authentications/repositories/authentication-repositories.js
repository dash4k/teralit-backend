import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import crypto from 'crypto';

class AuthenticationRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async verifyEmailExist(email) {
    const result = await this._pool.query({
      text: 'SELECT email, verified FROM users WHERE email = $1',
      values: [email],
    });

    if (!result.rows.lengt) return { emailExist: null, emailVerified: null };

    return {
      emailExist: result.rows[0].email,
      emailVerified: result.rows[0].verified,
    };
  }

  async createUser({ email, password, name }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const verified = false;
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const result = await this._pool.query({
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, verification_token',
      values: [id, email, hashedPassword, name, createdAt, updatedAt, verified, verificationToken, verificationTokenExpiry],
    });

    return {
      id: result.rows[0].id,
      verificationToken: result.rows[0].verification_token,
    };
  }

  async verifyToken(token) {
    const result = await this._pool.query({
      text: 'SELECT id, verification_token_expiry FROM users WHERE verification_token = $1',
      values: [token],
    });

    if (result.rows.length === 0) return null;

    const { id, verification_token_expiry: verificationTokenExpiry } = result.rows[0];
    return (verificationTokenExpiry > new Date() ? id : null);
  }

  async verifyUser(id) {
    await this._pool.query({
      text: 'UPDATE users SET verified = $1, verification_token = $2, verification_token_expiry = $3 WHERE id = $4',
      values: [true, null, null, id],
    });
  }

  async createToken(email) {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const result = await this._pool.query({
      text: 'UPDATE users SET verification_token = $1, verification_token_expiry = $2 WHERE email = $3 RETURNING verification_token',
      values: [verificationToken, verificationTokenExpiry, email],
    });

    return result.rows[0];
  }

  async verifyUserCredentials(email, password) {
    const result = await this._pool.query({
      text: 'SELECT id, password, verified FROM users WHERE email = $1',
      values: [email],
    });

    if (!result.rows.length) return { id: false, verified: false };

    const { id, password: hashedPassword, verified } = result.rows[0];
    const passwordCorrect = await bcrypt.compare(password, hashedPassword);

    if (!passwordCorrect) return { id: false, verified: false };

    return { id, verified };
  }

  async createAuthentication(token) {
    await this._pool.query({
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    });
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
