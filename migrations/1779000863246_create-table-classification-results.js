/* eslint-disable camelcase */

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('classification_results', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    session_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    diagnosis: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    confidence: {
      type: 'REAL',
      notNull: true,
    },
    risk_level: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    details: {
      type: 'JSONB',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
    },
  });

  pgm.createConstraint('classification_results', 'fk_classification_results.session_id_sessions.id', 'FOREIGN KEY(session_id) REFERENCES sessions(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('classification_results');
};
