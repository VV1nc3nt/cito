import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/Container'
import { Grid, GridItem } from '@/components/layout/Grid'
import { Image } from '@/components/ui/Image'

import { CssVar } from './CssVar'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Дизайн-токены — ЦИТО',
  robots: { index: false, follow: false },
}

type Swatch = { token: `--${string}`; usage: string }

const colors: Swatch[] = [
  { token: '--ink', usage: 'Основной текст, тёмные фоны' },
  { token: '--ink-2', usage: 'Тёмные карточки на тёмном фоне' },
  { token: '--ink-3', usage: 'Плитка портала на первом экране' },
  { token: '--blue-600', usage: 'Фирменный акцент: кнопки, плитка заголовка' },
  { token: '--blue-700', usage: 'Ссылки, акцентный текст на светлом' },
  { token: '--blue-300', usage: 'Акцентный текст и моно-метки на тёмном' },
  { token: '--blue-200', usage: 'Иконки на тёмном' },
  { token: '--red-500', usage: 'Акцент-точка, красная орбита' },
  { token: '--green-500', usage: 'Индикатор «онлайн» портала' },
  { token: '--muted', usage: 'Вторичный текст на светлом' },
  { token: '--muted-dark', usage: 'Вторичный текст на тёмном' },
  { token: '--muted-dark-2', usage: 'Вторичный текст на тёмном' },
  { token: '--muted-dark-3', usage: 'Вторичный текст на тёмном' },
  { token: '--bg', usage: 'Фон страницы' },
  { token: '--surface', usage: 'Карточки' },
  { token: '--line', usage: 'Границы карточек' },
  { token: '--line-2', usage: 'Границы кнопок' },
  { token: '--line-2-strong', usage: 'Границы полей' },
  { token: '--icon-bg', usage: 'Подложка иконок на светлом' },
  { token: '--error', usage: 'Обязательные поля *' },
]

const backgroundGrids = [
  { surface: 'dark', token: '--grid-line-dark', label: 'На тёмном' },
  { surface: 'blue', token: '--grid-line-blue', label: 'На синем' },
  { surface: undefined, token: '--grid-line-light', label: 'На светлом' },
] as const

const typeSamples = [
  { className: 'h1', label: 'H1', token: '--fs-h1', spec: '40–64px (≈4.4vw) / 44 / 34' },
  { className: 'h2', label: 'H2', token: '--fs-h2', spec: '44 / 36 / 30' },
  { className: 'h2-about', label: 'H2 «О центре»', token: '--fs-h2-about', spec: '42 / 32 / 26' },
  { className: 'lead', label: 'Лид', token: '--fs-lead', spec: '19 / 17 / 17, lh 1.55' },
  { className: 'text', label: 'Текст', token: '--fs-body', spec: '18 / 17 / 16, lh 1.6' },
] as const

const focusSurfaces = [
  { surface: undefined, label: 'Светлый фон --bg', ring: '--blue-700', contrast: '9,06:1' },
  { surface: 'dark', label: 'Тёмный фон --ink', ring: '#FFFFFF', contrast: '18,59:1' },
  { surface: 'blue', label: 'Синий фон --blue-600', ring: '#FFFFFF', contrast: '5,98:1' },
] as const

export default function TokensPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <Container className={styles.page}>
      <header className={styles.intro}>
        <p className="mono-label">/dev/tokens · только для разработки</p>
        <h1>Дизайн-токены</h1>
        <p className="lead">
          Все значения берутся из <code>src/styles/tokens.css</code>. Размеры шрифтов, поля
          контейнера и сетка меняются на брейкпоинтах 1200 и 768&nbsp;px.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="colors">
        <h2 id="colors">Цвета</h2>
        <ul className={styles.swatches}>
          {colors.map(({ token, usage }) => (
            <li key={token} className={styles.swatch}>
              <span className={styles.chip} style={{ background: `var(${token})` }} />
              <span className={styles.swatchText}>
                <strong className="nowrap">{token}</strong>
                <CssVar name={token} />
                <span className={styles.usage}>{usage}</span>
              </span>
            </li>
          ))}
        </ul>

        <h3 className={styles.subheading}>Фоновая сетка (шаг 64px)</h3>
        <div className={styles.bgGrids}>
          {backgroundGrids.map(({ surface, token, label }) => (
            <div
              key={token}
              className={styles.bgGrid}
              data-surface={surface}
              style={{ '--line-color': `var(${token})` } as CSSProperties}
            >
              <strong>{label}</strong>
              <span className="mono-label">{token}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="type">
        <h2 id="type">Типографика</h2>
        <div className={styles.typeList}>
          {typeSamples.map(({ className, label, token, spec }) => (
            <div key={token} className={styles.typeRow}>
              <p className={`${styles.typeMeta} mono-label`}>
                <span>{label}</span> <span className="nowrap">{token}</span>{' '}
                <span className="nowrap">
                  сейчас <CssVar name={token} />
                </span>{' '}
                <span className="nowrap">{spec}</span>
              </p>
              <p className={className}>Цифровая инфраструктура для образования и науки</p>
            </div>
          ))}
          <div className={styles.typeRow}>
            <p className={`${styles.typeMeta} mono-label`}>
              Моно-метка · JetBrains Mono · uppercase · ls 0.04em · <CssVar name="--fs-mono" />
            </p>
            <p className="mono-label">/01 Эксплуатация · данные портала на 27.10.2026</p>
          </div>
          <div className={styles.typeRow}>
            <p className={`${styles.typeMeta} mono-label`}>Начертания Onest</p>
            <p className={styles.weights}>
              <span style={{ fontWeight: 400 }}>Regular 400</span>
              <span style={{ fontWeight: 500 }}>Medium 500</span>
              <span style={{ fontWeight: 600 }}>SemiBold 600</span>
              <span style={{ fontWeight: 700 }}>Bold 700</span>
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="grid">
        <h2 id="grid">Сетка</h2>
        <p className="text">
          Колонок: <CssVar name="--grid-columns" />, gap <CssVar name="--grid-gap" />, поля
          контейнера <CssVar name="--container-pad" />, padding плитки <CssVar name="--tile-pad" />.
        </p>
        <Grid className={styles.columns} aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className={styles.column}>
              {i + 1}
            </div>
          ))}
        </Grid>
        <Grid className={styles.tiles}>
          {['span 4 / tablet 3', 'span 4 / tablet 3', 'span 4 / tablet 6'].map((label, i) => (
            <GridItem key={i} span={4} tabletSpan={i < 2 ? 3 : 6} className={styles.tile}>
              <span className="mono-label">{label}</span>
              <p className="text">Плитка: радиус 24px, тень карточки, при наведении подъём.</p>
            </GridItem>
          ))}
        </Grid>
      </section>

      <section className={styles.section} aria-labelledby="controls">
        <h2 id="controls">Кнопка и бейдж</h2>
        <div className={styles.controls}>
          <button type="button" className={styles.button}>
            Подать обращение
          </button>
          <span className={styles.badge}>Онлайн · 24/7</span>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="focus">
        <h2 id="focus">Фокус</h2>
        <p className="text">
          Нажимайте Tab, чтобы увидеть кольцо фокуса. Рядом — статичный образец того же кольца.
          Контраст кольца к фону не ниже 3:1.
        </p>
        <div className={styles.focusSurfaces}>
          {focusSurfaces.map(({ surface, label, ring, contrast }) => (
            <div key={label} className={styles.focusPanel} data-surface={surface}>
              <p className={styles.focusLabel}>
                <strong>{label}</strong>
                <span className="mono-label">
                  Кольцо {ring} · {contrast}
                </span>
              </p>
              <div className={styles.controls}>
                <button
                  type="button"
                  className={surface === 'blue' ? styles.buttonInverse : styles.button}
                >
                  Кнопка
                </button>
                <span
                  className={`${surface === 'blue' ? styles.buttonInverse : styles.button} ${styles.focusSample}`}
                  aria-hidden="true"
                >
                  В фокусе
                </span>
                <a href="#focus" className={styles.link}>
                  Ссылка
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="low-vision">
        <h2 id="low-vision">Версия для слабовидящих</h2>
        <div className={styles.lvSample}>
          <p className="lead">
            Включите режим кнопкой в шапке и проверьте на этом блоке размер шрифта, цветовые схемы,
            интервалы и отключение изображений.
          </p>
          <p className="text">
            Центр создан для информационно-технического обеспечения развития и совершенствования
            исследований и разработок в области образования и науки.{' '}
            <a href="#low-vision" className={styles.link}>
              Ссылка в тексте
            </a>
          </p>
          <div className={styles.controls}>
            <button type="button" className={styles.button}>
              Оставить обращение
            </button>
            <span className={styles.badge}>Онлайн · 24/7</span>
          </div>
          <div className={styles.lvImages}>
            <figure className={styles.lvFigure}>
              <Image
                src="/images/logo-cito.png"
                alt="Логотип ФГБУ ЦИТО"
                width={120}
                height={120}
                className={styles.lvImage}
              />
              <figcaption>Содержательное: при «Изображения: выкл» — рамка с alt</figcaption>
            </figure>
            <figure className={styles.lvFigure}>
              <Image
                src="/images/logo-cito.png"
                alt=""
                width={120}
                height={120}
                className={styles.lvImage}
              />
              <figcaption>Декоративное (alt=&quot;&quot;): при «выкл» скрыто</figcaption>
            </figure>
          </div>
        </div>
      </section>
    </Container>
  )
}
