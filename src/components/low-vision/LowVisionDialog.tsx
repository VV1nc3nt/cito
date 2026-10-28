'use client'

import { useId, useRef } from 'react'

import { CloseIcon } from '@/components/icons'
import { Dialog } from '@/components/ui/Dialog'
import type { PrefKey, Prefs } from '@/lib/low-vision/settings'
import {
  disableLowVision,
  resetLowVision,
  updateLowVision,
  useLowVision,
} from '@/lib/low-vision/store'

import styles from './LowVisionDialog.module.css'

type Group = {
  [K in PrefKey]: { key: K; legend: string; options: [Prefs[K], string][] }
}[PrefKey]

const groups: Group[] = [
  {
    key: 'size',
    legend: 'Размер шрифта',
    options: [
      ['1', 'Обычный'],
      ['2', 'Крупный'],
      ['3', 'Очень крупный'],
    ],
  },
  {
    key: 'scheme',
    legend: 'Цветовая схема',
    options: [
      ['bw', 'Чёрным по белому'],
      ['wb', 'Белым по чёрному'],
      ['blue', 'Тёмно-синим по голубому'],
    ],
  },
  {
    key: 'letter',
    legend: 'Межбуквенный интервал',
    options: [
      ['1', 'Обычный'],
      ['2', 'Увеличенный'],
      ['3', 'Большой'],
    ],
  },
  {
    key: 'line',
    legend: 'Межстрочный интервал',
    options: [
      ['1', 'Обычный'],
      ['2', 'Увеличенный'],
      ['3', 'Большой'],
    ],
  },
  {
    key: 'images',
    legend: 'Изображения',
    options: [
      ['on', 'Показывать'],
      ['off', 'Не показывать'],
    ],
  },
]

type LowVisionDialogProps = {
  id: string
  open: boolean
  onDismiss: () => void
  onClosed: () => void
}

/** Settings of the low-vision mode. Every change applies and is saved at once. */
export function LowVisionDialog({ id, open, onDismiss, onClosed }: LowVisionDialogProps) {
  const settings = useLowVision()
  const closeRef = useRef<HTMLButtonElement>(null)
  const uid = useId()
  const titleId = `${uid}-title`

  return (
    <Dialog
      id={id}
      open={open}
      onDismiss={onDismiss}
      onShow={() => closeRef.current?.focus()}
      onClosed={onClosed}
      aria-labelledby={titleId}
      data-surface="light"
    >
      <div className={styles.body}>
        <div className={styles.head}>
          <h2 id={titleId} className={styles.title}>
            Версия для слабовидящих
          </h2>
          <button ref={closeRef} type="button" className={styles.button} onClick={onDismiss}>
            <CloseIcon size={18} className={styles.icon} />
            Закрыть
          </button>
        </div>

        {groups.map((group) => (
          <fieldset key={group.key} className={styles.group}>
            <legend className={styles.legend}>{group.legend}</legend>
            <div className={styles.options}>
              {group.options.map(([value, label]) => (
                <label key={value} className={styles.option}>
                  <input
                    type="radio"
                    className={styles.radio}
                    name={`${uid}-${group.key}`}
                    value={value}
                    checked={settings[group.key] === value}
                    onChange={() => updateLowVision({ [group.key]: value })}
                  />
                  {group.key === 'scheme' && (
                    <span className={styles.sample} data-scheme={value} aria-hidden="true">
                      Аа
                    </span>
                  )}
                  <span className={styles.optionText}>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={resetLowVision}>
            Сбросить настройки
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              disableLowVision()
              onDismiss()
            }}
          >
            Обычная версия сайта
          </button>
        </div>
      </div>
    </Dialog>
  )
}
