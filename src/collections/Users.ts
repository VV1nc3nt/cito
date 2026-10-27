import type { CollectionConfig } from 'payload'

import { hasAdminRole, isAdmin, isAdminField, isAdminOrSelf } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Пользователь',
    plural: 'Пользователи',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
    // Editors never see the collection in the admin panel.
    hidden: ({ user }) => !hasAdminRole(user),
  },
  auth: true,
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: isAdmin,
    // Non-admins can read only themselves: required for the session and /me.
    read: isAdminOrSelf,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      // The very first account (created from /admin/create-first-user) becomes an admin.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        if (totalDocs === 0) return { ...data, role: 'admin' }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'role',
      label: 'Роль',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Администратор', value: 'admin' },
        { label: 'Редактор', value: 'editor' },
      ],
      access: {
        create: isAdminField,
        update: isAdminField,
      },
    },
  ],
}
