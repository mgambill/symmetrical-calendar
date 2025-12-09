import type { Role } from '~/roles/types'

export const hasPermission = (
  permission: string,
  organizationId: number | null | undefined,
  allRoles: Partial<Role>[],
  userRoles: string[],
  userOrganizations: number[],
) => {
  const roleLookup = (value: string) => allRoles.find((role) => role.value === value)
  const isScopedRole = (role?: Partial<Role>) => (role?.isScoped ?? role?.roleType === 'SCOPED') === true
  const hasOrgAccess = (role?: Partial<Role>) => {
    if (!role) return false
    if (!isScopedRole(role)) return true
    if (organizationId === null || organizationId === undefined) return false
    return userOrganizations.includes(organizationId)
  }

  // Check for Admin role (grants all permissions)
  if (userRoles.includes('System.Admin')) {
    return true
  }

  const requestedRole = roleLookup(permission)
  if (!requestedRole) {
    return false
  }

  // Check for exact match first (respecting scope)
  if (userRoles.includes(permission)) {
    const userRoleData = roleLookup(permission)
    return hasOrgAccess(userRoleData)
  }

  // Supplementary roles must be explicitly assigned
  // Primary roles with ancestors can be inherited
  if (requestedRole.roleKind === 'SUPPLEMENTARY') {
    // Supplementary roles can only be granted if the user has an ancestor with ADMIN permission level
    for (const userRole of userRoles) {
      const userRoleData = roleLookup(userRole)
      if (!userRoleData || !hasOrgAccess(userRoleData)) {
        continue
      }

      // Check if user has an ancestor role with ADMIN permission level
      if (
        requestedRole.lineage.includes(userRoleData.lineage) &&
        requestedRole.lineage !== userRoleData.lineage &&
        userRoleData.roleKind === 'PRIMARY' &&
        userRoleData.permissionLevel === 'ADMIN'
      ) {
        return true
      }
    }
    return false
  }

  // For PRIMARY roles, check hierarchical permissions
  for (const userRole of userRoles) {
    const userRoleData = roleLookup(userRole)
    if (!userRoleData) {
      continue
    }

    // Check if the user's role lineage contains the requested role's lineage
    // This means the user has a parent/ancestor role
    if (requestedRole.lineage.includes(userRoleData.lineage) && requestedRole.lineage !== userRoleData.lineage) {
      // Only grant permission if the user's role is a PRIMARY role with a permissionLevel
      if (userRoleData.roleKind === 'PRIMARY' && userRoleData.permissionLevel !== null) {
        // If the user's role is not scoped, they have access regardless of organization
        if (!isScopedRole(userRoleData)) {
          return true
        }
        // If the user's role is scoped, they must have org access
        if (hasOrgAccess(userRoleData)) {
          return true
        }
      }
    }
  }

  return false
}
