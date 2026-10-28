/**
 * Low-vision mode settings: format, storage and the attributes on <html>.
 * Stored in localStorage under one key; functional, no personal data, no cookies.
 * Shared by the inline script (before the first paint) and the settings dialog.
 */

export const STORAGE_KEY = 'cito-a11y'
export const FORMAT_VERSION = 1

export const OPTIONS = {
  size: ['1', '2', '3'],
  scheme: ['bw', 'wb', 'blue'],
  letter: ['1', '2', '3'],
  line: ['1', '2', '3'],
  images: ['on', 'off'],
} as const

export type Prefs = { [K in keyof typeof OPTIONS]: (typeof OPTIONS)[K][number] }
export type PrefKey = keyof Prefs

export type Settings = Prefs & {
  /** Mode on. When off, the chosen values are kept for the next time. */
  on: boolean
}

/** First switch-on: large text, black on white, normal spacing, images shown. */
export const DEFAULT_PREFS: Prefs = {
  size: '2',
  scheme: 'bw',
  letter: '1',
  line: '1',
  images: 'on',
}

export const OFF: Settings = { on: false, ...DEFAULT_PREFS }

export const ON_ATTR = 'data-lv'

export const ATTRS: Record<PrefKey, string> = {
  size: 'data-lv-size',
  scheme: 'data-lv-scheme',
  letter: 'data-lv-letter',
  line: 'data-lv-line',
  images: 'data-lv-images',
}

const PREF_KEYS = Object.keys(OPTIONS) as PrefKey[]

const isOption = <K extends PrefKey>(key: K, value: unknown): value is Prefs[K] =>
  (OPTIONS[key] as readonly unknown[]).includes(value)

/**
 * Parses the stored value. Anything unreadable or of another format version gives null;
 * an unknown value of a single setting falls back to its default.
 */
export function parseSettings(raw: string | null | undefined): Settings | null {
  if (!raw) return null
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return null
  }
  if (typeof data !== 'object' || data === null) return null
  const record = data as Record<string, unknown>
  if (record.v !== FORMAT_VERSION) return null

  const settings: Settings = { ...OFF, on: record.on === true }
  for (const key of PREF_KEYS) {
    const value = record[key]
    if (isOption(key, value)) (settings as Record<PrefKey, string>)[key] = value
  }
  return settings
}

/** localStorage, or null where it is unavailable (disabled, sandboxed, server). */
export function getStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

export function readSettings(storage: Storage | null = getStorage()): Settings | null {
  try {
    return parseSettings(storage?.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export function writeSettings(settings: Settings, storage: Storage | null = getStorage()): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify({ v: FORMAT_VERSION, ...settings }))
  } catch {
    // Full or blocked storage: the mode still works until the page is reloaded.
  }
}

/** Sets the attributes on <html>; when the mode is off, removes all of them. */
export function applySettings(root: HTMLElement, settings: Settings | null): void {
  if (settings?.on) {
    root.setAttribute(ON_ATTR, 'on')
    for (const key of PREF_KEYS) root.setAttribute(ATTRS[key], settings[key])
  } else {
    root.removeAttribute(ON_ATTR)
    for (const key of PREF_KEYS) root.removeAttribute(ATTRS[key])
  }
}

/**
 * Source of the inline script in <head>. It marks that JavaScript runs (data-js) and applies
 * the stored settings before the first paint. Same rules as parseSettings + applySettings;
 * the constants are embedded so both stay in step. Never throws, never logs.
 */
export function buildInlineScript(): string {
  const config = JSON.stringify({
    k: STORAGE_KEY,
    v: FORMAT_VERSION,
    on: ON_ATTR,
    a: ATTRS,
    o: OPTIONS,
    d: DEFAULT_PREFS,
  })
  return `(function(c){var r=document.documentElement;r.setAttribute('data-js','');try{var s=JSON.parse(localStorage.getItem(c.k));if(!s||s.v!==c.v||s.on!==true)return;var p={};for(var n in c.o){p[n]=c.o[n].indexOf(s[n])>-1?s[n]:c.d[n]}r.setAttribute(c.on,'on');for(n in p)r.setAttribute(c.a[n],p[n])}catch(e){}})(${config})`
}
