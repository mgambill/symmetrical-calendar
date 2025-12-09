import { defineStore } from 'pinia'
import type { Role, Lookup } from './types'
import { CATEGORIES , ROOT, PERMISSION_LEVELS } from './dataset'

export const useRoleStore = defineStore('role', () => {
  const categories = CATEGORIES
  const root = ROOT
  const permissionLevels = PERMISSION_LEVELS

  const flattenRoles = (role: Role): Role[] => {
    const roles: Role[] = [role]
    if (role.children) {
      role.children.forEach((child) => {
        roles.push(...flattenRoles(child))
      })
    }
    return roles
  }

  const allRoles = flattenRoles(root).map((r) => {
    const { children: _children, ...rest } = r
    const isScoped = rest.isScoped ?? rest.roleType === 'SCOPED'
    return { ...rest, isScoped }
  })
  return {
    root,
    allRoles,
    categories,
    permissionLevels,
    getCategory: (role: Role) => categories.find((c) => c.id == role.roleCategory),
    getCategoryChildren: (category: Lookup) => {
      return root.children?.filter((child) => child.roleCategory === category.id) || []
    },
    getRolesByCategory(categoryId: number) {
      return allRoles.filter((role) => role.roleCategory === categoryId)
    },
  }
})
