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
  pgm.addColumns('users', {
    verified: {
      type: 'BOOLEAN',
      default: false,
      notNull: true,
    },
    verification_token: {
      type: 'TEXT',
      default: null,
      notNull: false,
    },
    verification_token_expiry: {
      type: 'TIMESTAMPTZ',
      default: null,
      notNull: false,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropColumns('users', [
    'verified',
    'verification_token',
    'verification_token_expiry',
  ]);
};
