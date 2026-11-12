export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const ROLES_WITH_FULL_ACCESS: string[] = [ROLES.ADMIN];