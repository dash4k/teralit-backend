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
    verificationToken: {
      type: 'TEXT',
      default: null,
      notNull: false,
    },
    verificationTokenExpiry: {
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
    'verificationToken',
    'verificationTokenExpiry',
  ]);
};
