# Шрифты

Self-hosted woff2, подключаются через `next/font/local` в `src/app/(frontend)/fonts.ts`.
Каждый файл — одно начертание с подмножествами latin + cyrillic (диапазоны как у Google Fonts).

| Файл                                                 | Шрифт                | Начертание         |
| ---------------------------------------------------- | -------------------- | ------------------ |
| `Onest-400.woff2` … `Onest-700.woff2`                | Onest 2.001          | 400, 500, 600, 700 |
| `JetBrainsMono-400.woff2`, `JetBrainsMono-500.woff2` | JetBrains Mono 2.304 | 400, 500           |

## Источники

- **Onest** — `ofl/onest/Onest[wght].ttf` из [google/fonts](https://github.com/google/fonts/tree/4c1db3aec83c67dd223dd82a68c039cab30917a9/ofl/onest),
  коммит `4c1db3aec83c67dd223dd82a68c039cab30917a9` (upstream: [simpals/onest](https://github.com/simpals/onest), релиз 2.001).
  Вариативный файл, статические начертания получены через `fonttools varLib.instancer`.
- **JetBrains Mono** — `fonts/ttf/JetBrainsMono-Regular.ttf` и `JetBrainsMono-Medium.ttf` из официального релиза
  [v2.304](https://github.com/JetBrains/JetBrainsMono/releases/tag/v2.304).

## Лицензия

Оба шрифта распространяются под SIL Open Font License 1.1: `OFL-Onest.txt`, `OFL-JetBrainsMono.txt`.

## Пересборка

Нужен fontTools с brotli (`pip install fonttools brotli`, удобно во временном venv).
Положите в один каталог `Onest[wght].ttf`, `JetBrainsMono-Regular.ttf`, `JetBrainsMono-Medium.ttf` и выполните:

```sh
src/fonts/build.sh /path/to/sources
```

Скрипт перезапишет woff2 в этом каталоге.
