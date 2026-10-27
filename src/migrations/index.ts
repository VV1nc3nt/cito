import * as migration_20261027_130256_initial from './20261027_130256_initial'

export const migrations = [
  {
    up: migration_20261027_130256_initial.up,
    down: migration_20261027_130256_initial.down,
    name: '20261027_130256_initial',
  },
]
