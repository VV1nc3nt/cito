// Runs once when the Next.js server starts. In production this initialises Payload eagerly so
// pending migrations (`prodMigrations`) are applied before the server takes traffic. If that
// fails, the process exits with a non-zero code instead of serving a half-working site.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (process.env.NODE_ENV !== 'production') return
  if (process.env.NEXT_PHASE === 'phase-production-build') return

  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')

  try {
    await getPayload({ config })
  } catch (error) {
    console.error('Payload initialisation failed, shutting down.', error)
    process.exit(1)
  }
}
