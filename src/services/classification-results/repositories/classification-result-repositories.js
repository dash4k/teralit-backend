import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class ClassificationResultRepositories {
  constructor() {
    this._pool = new Pool();
  }

  async createClassificationResult(sessionId, modelResponse) {
    const { diagnosis, confidence, riskLevel } = modelResponse;
    const details = {
      predictedClass: modelResponse.predictedClass,
      probabilities: modelResponse.probabilities
    };
    const id = nanoid(16);
    const createdAt = new Date().toISOString();

    const result = await this._pool.query({
      text: 'INSERT INTO classification_results VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, sessionId, diagnosis, confidence, riskLevel, details, createdAt],
    });

    return result.rows[0];
  }

  async getClassificationResult(sessionId) {
    const result = await this._pool.query({
      text: 'SELECT * FROM classification_results WHERE session_id = $1',
      values: [sessionId],
    });

    return {
      id: result.rows[0].id,
      sessionId: result.rows[0].session_id,
      diagnosis: result.rows[0].diagnosis,
      confidence: result.rows[0].confidence,
      riskLevel: result.rows[0].risk_level,
      details: result.rows[0].details,
      createdAt: result.rows[0].created_at,
    };
  }
}

export default new ClassificationResultRepositories();
