'use client'

import { useEffect, useLayoutEffect, useRef, type ComponentPropsWithoutRef } from 'react'

import styles from './Dialog.module.css'

type DialogProps = Omit<ComponentPropsWithoutRef<'dialog'>, 'open' | 'onCancel' | 'onClose'> & {
  open: boolean
  /** The dialog asks to be closed (Esc). The owner sets `open` to false. */
  onDismiss: () => void
  /** Runs right after showModal(): initial focus, opening animation. */
  onShow?: (dialog: HTMLDialogElement) => void
  /** Runs right after close(): the owner decides where the focus goes. */
  onClosed?: () => void
  variant?: 'fullscreen' | 'centered'
}

/**
 * Modal dialog on the native <dialog> and showModal(): the rest of the page becomes inert,
 * so the focus stays inside; Esc fires `cancel`. While it is open the page does not scroll.
 */
export function Dialog({
  open,
  onDismiss,
  onShow,
  onClosed,
  variant = 'centered',
  className,
  children,
  ...rest
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  // Latest callbacks without re-running the open/close effect.
  const callbacks = useRef({ onDismiss, onShow, onClosed })
  useLayoutEffect(() => {
    callbacks.current = { onDismiss, onShow, onClosed }
  })

  // Layout effect: open and close in the same task as the click, before a link navigates.
  const isOpen = useRef(open)
  useLayoutEffect(() => {
    isOpen.current = open
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      callbacks.current.onShow?.(dialog)
    } else if (!open && dialog.open) {
      dialog.close()
      callbacks.current.onClosed?.()
    }
  }, [open])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const onCancel = (event: Event) => {
      event.preventDefault()
      callbacks.current.onDismiss()
    }
    // Closed by the browser itself (e.g. a repeated close request): keep the owner in sync.
    const onClose = () => {
      if (isOpen.current) callbacks.current.onDismiss()
    }
    dialog.addEventListener('cancel', onCancel)
    dialog.addEventListener('close', onClose)
    return () => {
      dialog.removeEventListener('cancel', onCancel)
      dialog.removeEventListener('close', onClose)
    }
  }, [])

  return (
    <dialog
      ref={ref}
      className={`${styles.dialog} ${styles[variant]} ${className ?? ''}`}
      {...rest}
    >
      {children}
    </dialog>
  )
}
