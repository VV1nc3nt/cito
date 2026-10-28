'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent } from 'react'

import { ChevronIcon, MailIcon, PhoneIcon } from '@/components/icons'
import { Dialog } from '@/components/ui/Dialog'
import { appealHref, contacts, isCurrentSection, mainNav } from '@/config/navigation'
import { isMotionAllowed, useMotionAllowed } from '@/lib/motion'

import { LogoMark } from './LogoMark'
import styles from './MobileMenu.module.css'

/** Where the focus goes after the menu closes. */
type FocusTarget = { kind: 'button' } | { kind: 'hash'; id: string } | { kind: 'none' }

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]'

const stagger = (i: number) => ({ '--i': i }) as CSSProperties

/** «Меню» button and the full-screen menu dialog (mobile layout). */
export function MobileMenu({ buttonClassName }: { buttonClassName?: string }) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const focusAfterClose = useRef<FocusTarget>({ kind: 'button' })
  const dialogId = useId()
  const pathname = usePathname()
  const motion = useMotionAllowed()

  const close = (target: FocusTarget) => {
    focusAfterClose.current = target
    setOpen(false)
  }

  // The window got wider and the «Меню» button is no longer displayed.
  useEffect(() => {
    const button = buttonRef.current
    if (!open || !button) return
    const observer = new ResizeObserver(() => {
      if (button.getClientRects().length === 0) close({ kind: 'button' })
    })
    observer.observe(button)
    return () => observer.disconnect()
  }, [open])

  const onShow = (dialog: HTMLDialogElement) => {
    closeRef.current?.focus()
    const button = buttonRef.current
    if (!button || !isMotionAllowed()) return
    // Reveal as a circle growing from the centre of the «Меню» button.
    const rect = button.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    dialog.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
      ],
      { duration: 550, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
    )
  }

  const onClosed = () => {
    const target = focusAfterClose.current
    if (target.kind === 'button') {
      buttonRef.current?.focus()
    } else if (target.kind === 'hash') {
      // After the router has moved to the anchor; the anchor does the scrolling.
      setTimeout(() => {
        const element = document.getElementById(target.id)
        if (!element) {
          buttonRef.current?.focus()
          return
        }
        if (!element.matches(FOCUSABLE)) element.setAttribute('tabindex', '-1')
        element.focus({ preventScroll: true })
      })
    }
    // kind 'none': another page is opening; leave the focus to the browser and the router.
  }

  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const url = new URL(event.currentTarget.href, location.href)
    if (url.origin !== location.origin) {
      // tel: and mailto: keep the current page.
      close({ kind: 'button' })
    } else if (url.pathname !== location.pathname) {
      close({ kind: 'none' })
    } else if (url.hash.length > 1) {
      close({ kind: 'hash', id: decodeURIComponent(url.hash.slice(1)) })
    } else {
      close({ kind: 'button' })
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.menuButton} ${buttonClassName ?? ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => setOpen(true)}
      >
        <span className={styles.burger} aria-hidden="true">
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </span>
        Меню
      </button>

      <Dialog
        id={dialogId}
        open={open}
        onDismiss={() => close({ kind: 'button' })}
        onShow={onShow}
        onClosed={onClosed}
        variant="fullscreen"
        aria-label="Меню"
        className={styles.menu}
        data-surface="dark"
        data-animate={motion || undefined}
      >
        <svg
          className={styles.orbits}
          viewBox="0 0 600 600"
          aria-hidden="true"
          focusable="false"
          data-decor
        >
          <ellipse cx="300" cy="300" rx="262" ry="52" stroke="var(--orbit-red)" />
          <ellipse
            cx="300"
            cy="300"
            rx="72"
            ry="282"
            transform="rotate(30 300 300)"
            stroke="var(--orbit-blue)"
          />
          <ellipse
            cx="300"
            cy="300"
            rx="62"
            ry="235"
            transform="rotate(-25 300 300)"
            stroke="var(--orbit-grey)"
          />
        </svg>

        <div className={styles.top}>
          <LogoMark />
          <span className={styles.name}>ЦИТО</span>
          <button
            ref={closeRef}
            type="button"
            className={styles.menuButton}
            onClick={() => close({ kind: 'button' })}
          >
            <span className={`${styles.burger} ${styles.cross}`} aria-hidden="true">
              <span className={styles.bar} />
              <span className={styles.bar} />
              <span className={styles.bar} />
            </span>
            Закрыть
          </button>
        </div>

        <div className={styles.body}>
          <nav aria-label="Основная навигация" className={styles.nav}>
            {mainNav.map(({ label, href, icon: Icon }, i) => (
              <Link
                key={href}
                href={href}
                className={`${styles.item} ${styles.stagger}`}
                style={stagger(i)}
                aria-current={isCurrentSection(pathname, href) ? 'page' : undefined}
                onClick={onLinkClick}
              >
                <span className={styles.itemIcon} data-decor>
                  <Icon size={20} />
                </span>
                <span className={styles.itemLabel}>{label}</span>
                <ChevronIcon size={18} className={styles.chevron} />
              </Link>
            ))}
          </nav>

          <Link
            href={appealHref}
            className={`${styles.appeal} ${styles.stagger}`}
            style={stagger(mainNav.length)}
            onClick={onLinkClick}
          >
            Оставить обращение
          </Link>

          <div className={`${styles.direct} ${styles.stagger}`} style={stagger(mainNav.length + 1)}>
            <p className={`mono-label ${styles.directLabel}`}>Связаться напрямую</p>
            <a href={contacts.phone.href} className={styles.tile} onClick={onLinkClick}>
              <PhoneIcon size={20} className={styles.tileIcon} />
              <span className={styles.tileText}>
                <span className={styles.tileLabel}>Позвонить</span>
                <span className={`${styles.tileValue} nowrap`}>{contacts.phone.label}</span>
              </span>
            </a>
            <a href={contacts.email.href} className={styles.tile} onClick={onLinkClick}>
              <MailIcon size={20} className={styles.tileIcon} />
              <span className={styles.tileText}>
                <span className={styles.tileLabel}>Написать письмо</span>
                <span className={styles.tileValue}>{contacts.email.label}</span>
              </span>
            </a>
          </div>
        </div>
      </Dialog>
    </>
  )
}
