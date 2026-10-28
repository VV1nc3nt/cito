/**
 * Inline script that runs while the HTML is parsed, before the first paint.
 * On the client React would warn about rendering a <script>; the type swap avoids that and
 * suppressHydrationWarning accepts the difference (see the Next.js guide «Preventing flash
 * before hydration»).
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
