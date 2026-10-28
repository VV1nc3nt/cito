'use client'

import { useId, useRef, useState, type MouseEvent } from 'react'

import { EyeIcon } from '@/components/icons'
import { enableLowVision, isLowVisionOn } from '@/lib/low-vision/store'

import { LowVisionDialog } from './LowVisionDialog'
import styles from './LowVisionControl.module.css'

type LowVisionControlProps = {
  /** Text button, shown from 768px. */
  wideClassName?: string
  /** Icon-only button for the mobile layout. */
  mobileClassName?: string
}

/**
 * «Версия для слабовидящих» button. Off: turns the mode on and opens the settings.
 * On: «Настройки для слабовидящих» opens the settings. Both labels are rendered and one is
 * hidden by CSS, so the server markup does not depend on the stored settings.
 */
export function LowVisionControl({ wideClassName, mobileClassName }: LowVisionControlProps) {
  const [open, setOpen] = useState(false)
  const wideRef = useRef<HTMLButtonElement>(null)
  const mobileRef = useRef<HTMLButtonElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const dialogId = useId()

  const openSettings = (event: MouseEvent<HTMLButtonElement>) => {
    trigger.current = event.currentTarget
    if (!isLowVisionOn()) enableLowVision()
    setOpen(true)
  }

  // Large text may switch the header layout, so the button that opened the dialog can be hidden.
  const returnFocus = () => {
    const visible = [trigger.current, wideRef.current, mobileRef.current].find(
      (button) => button && button.getClientRects().length > 0,
    )
    visible?.focus()
  }

  const labels = (
    <>
      <span className={styles.labelOff}>Версия для слабовидящих</span>
      <span className={styles.labelOn}>Настройки для слабовидящих</span>
    </>
  )

  return (
    <>
      <button
        ref={wideRef}
        type="button"
        className={`${styles.button} ${wideClassName ?? ''}`}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        onClick={openSettings}
      >
        <EyeIcon size={18} className={styles.icon} />
        {labels}
      </button>
      <button
        ref={mobileRef}
        type="button"
        className={`${styles.button} ${styles.iconOnly} ${mobileClassName ?? ''}`}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        onClick={openSettings}
      >
        <EyeIcon size={20} className={styles.icon} />
        <span className="visually-hidden">{labels}</span>
      </button>
      <LowVisionDialog
        id={dialogId}
        open={open}
        onDismiss={() => setOpen(false)}
        onClosed={returnFocus}
      />
    </>
  )
}
