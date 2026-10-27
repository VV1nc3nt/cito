import type { Access, FieldAccess } from 'payload'

export const hasAdminRole = (user: object | null | undefined): boolean =>
  Boolean(user && 'role' in user && user.role === 'admin')

export const isAdmin: Access = ({ req: { user } }) => hasAdminRole(user)

export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user)

/** Admins see everyone; other users see only their own record. */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasAdminRole(user)) return true
  return { id: { equals: user.id } }
}

export const isAdminField: FieldAccess = ({ req: { user } }) => hasAdminRole(user)
