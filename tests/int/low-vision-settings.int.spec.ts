import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  ATTRS,
  DEFAULT_PREFS,
  OFF,
  ON_ATTR,
  STORAGE_KEY,
  applySettings,
  buildInlineScript,
  parseSettings,
  readSettings,
  writeSettings,
  type Settings,
} from '@/lib/low-vision/settings'

const stored = (data: object) => JSON.stringify({ v: 1, ...data })

const lvAttributes = () =>
  Object.fromEntries(
    [...document.documentElement.attributes]
      .filter((attr) => attr.name.startsWith('data-lv'))
      .map((attr) => [attr.name, attr.value]),
  )

const throwingStorage = () =>
  ({
    getItem: () => {
      throw new Error('SecurityError')
    },
    setItem: () => {
      throw new Error('QuotaExceededError')
    },
  }) as unknown as Storage

// Node 26 has its own global localStorage (undefined without --localstorage-file) that
// shadows the jsdom one; use an in-memory storage for every test.
const memoryStorage = (): Storage => {
  const items = new Map<string, string>()
  return {
    get length() {
      return items.size
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => void items.delete(key),
    setItem: (key, value) => void items.set(key, String(value)),
  }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', memoryStorage())
})

afterEach(() => {
  vi.unstubAllGlobals()
  applySettings(document.documentElement, null)
  document.documentElement.removeAttribute('data-js')
  vi.restoreAllMocks()
})

describe('parseSettings', () => {
  it('reads a valid value', () => {
    const settings: Settings = {
      on: true,
      size: '3',
      scheme: 'blue',
      letter: '2',
      line: '3',
      images: 'off',
    }
    expect(parseSettings(stored(settings))).toEqual(settings)
  })

  it.each([null, '', '{garbage', 'null', '42', '"text"', '[]'])('rejects %j', (raw) => {
    expect(parseSettings(raw)).toBeNull()
  })

  it('rejects another format version', () => {
    expect(parseSettings(JSON.stringify({ v: 2, on: true, size: '3' }))).toBeNull()
    expect(parseSettings(JSON.stringify({ on: true, size: '3' }))).toBeNull()
  })

  it('falls back to defaults for unknown values', () => {
    expect(parseSettings(stored({ on: true, size: '9', scheme: 'red', images: true }))).toEqual({
      on: true,
      ...DEFAULT_PREFS,
    })
  })

  it('treats anything but on: true as off', () => {
    expect(parseSettings(stored({ on: 'yes', size: '3' }))).toEqual({ ...OFF, size: '3' })
  })
})

describe('storage', () => {
  it('round-trips through localStorage', () => {
    const settings: Settings = { ...OFF, on: true, scheme: 'wb' }
    writeSettings(settings)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toMatchObject({ v: 1, scheme: 'wb' })
    expect(readSettings()).toEqual(settings)
  })

  it('survives unavailable storage', () => {
    expect(readSettings(throwingStorage())).toBeNull()
    expect(() => writeSettings(OFF, throwingStorage())).not.toThrow()
    expect(readSettings(null)).toBeNull()
  })
})

describe('applySettings', () => {
  it('sets every attribute when on and removes them all when off', () => {
    applySettings(document.documentElement, { ...DEFAULT_PREFS, on: true })
    expect(lvAttributes()).toEqual({
      [ON_ATTR]: 'on',
      [ATTRS.size]: '2',
      [ATTRS.scheme]: 'bw',
      [ATTRS.letter]: '1',
      [ATTRS.line]: '1',
      [ATTRS.images]: 'on',
    })

    applySettings(document.documentElement, { ...DEFAULT_PREFS, on: false })
    expect(lvAttributes()).toEqual({})
  })
})

describe('inline script', () => {
  const run = () => new Function(buildInlineScript())()

  it.each([
    stored({ on: true, size: '3', scheme: 'wb', letter: '3', line: '2', images: 'off' }),
    stored({ on: true, size: '7', scheme: 'red' }),
    stored({ on: false, size: '3' }),
    '{garbage',
    'null',
    JSON.stringify({ v: 2, on: true }),
  ])('applies %s like applySettings(parseSettings())', (raw) => {
    localStorage.setItem(STORAGE_KEY, raw)
    run()
    const fromScript = lvAttributes()
    expect(document.documentElement.hasAttribute('data-js')).toBe(true)

    applySettings(document.documentElement, null)
    applySettings(document.documentElement, parseSettings(raw))
    expect(fromScript).toEqual(lvAttributes())
  })

  it('sets no data-lv attribute when the mode is off or nothing is stored', () => {
    run()
    expect(lvAttributes()).toEqual({})
    localStorage.setItem(STORAGE_KEY, stored({ ...DEFAULT_PREFS, on: false }))
    run()
    expect(lvAttributes()).toEqual({})
  })

  it('does not throw or log when localStorage is unavailable', () => {
    const error = vi.spyOn(console, 'error')
    vi.stubGlobal('localStorage', throwingStorage())
    expect(run).not.toThrow()
    expect(lvAttributes()).toEqual({})
    expect(error).not.toHaveBeenCalled()
  })
})
