'use client'

import { useSyncExternalStore } from 'react'

import {
  DEFAULT_PREFS,
  OFF,
  STORAGE_KEY,
  applySettings,
  readSettings,
  writeSettings,
  type Prefs,
  type Settings,
} from './settings'

// The inline script has already applied the stored settings; this mirrors them for React.
let current: Settings | null = null
const listeners = new Set<() => void>()

function getSnapshot(): Settings {
  current ??= readSettings() ?? OFF
  return current
}

function set(next: Settings) {
  current = next
  applySettings(document.documentElement, next)
  writeSettings(next)
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // Another tab changed the settings.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return
    current = readSettings() ?? OFF
    applySettings(document.documentElement, current)
    listeners.forEach((l) => l())
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useLowVision(): Settings {
  return useSyncExternalStore(subscribe, getSnapshot, () => OFF)
}

/** Turns the mode on with the previously chosen values (defaults the first time). */
export const enableLowVision = () => set({ ...getSnapshot(), on: true })

/** «Обычная версия сайта»: the mode goes off, the chosen values stay for next time. */
export const disableLowVision = () => set({ ...getSnapshot(), on: false })

export const resetLowVision = () => set({ ...DEFAULT_PREFS, on: true })

export const updateLowVision = (patch: Partial<Prefs>) => set({ ...getSnapshot(), ...patch })

export const isLowVisionOn = () => getSnapshot().on
