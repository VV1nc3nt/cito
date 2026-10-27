import path from 'path'
import type { CollectionConfig, TextFieldSingleValidation } from 'payload'

import { isAuthenticated } from '@/access'

// Alt text is mandatory for images only; PDFs may be saved without it.
const validateAlt: TextFieldSingleValidation = (value, { data, req }) => {
  const mimeType = (data as { mimeType?: string }).mimeType ?? req.file?.mimetype
  if (mimeType?.startsWith('image/') && !value?.trim()) {
    return 'Укажите альтернативный текст для изображения'
  }
  return true
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Файл',
    plural: 'Медиа',
  },
  access: {
    read: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: 'alt',
      label: 'Альтернативный текст',
      type: 'text',
      admin: {
        description: 'Обязателен для изображений: кратко опишите, что на нём изображено.',
      },
      validate: validateAlt,
    },
  ],
  upload: {
    staticDir: process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
}
