import { defineStore } from 'pinia'
import type { User } from '../types'
import { useRoleStore } from '~/role/store'
import { ref } from 'vue'
import { hasPermission } from './hasPermission'

export const useUserStore = defineStore('user', () => {
  const user = ref<User>({ roles: [], organizations: [] })
  const activeOrganizationId = ref<number | null>(null)
  const roleStore = useRoleStore()

  const initialize = (userData: User, activeOrgId?: number | null) => {
    user.value = userData
    activeOrganizationId.value = activeOrgId ?? null
  }

  const setActiveOrganization = (organizationId: number | null) => {
    activeOrganizationId.value = organizationId
  }

  const _hasPermission = (permission: string) => {
    return hasPermission(permission, activeOrganizationId.value, roleStore.allRoles, user.value.roles, user.value.organizations)
  }

  return {
    initialize,
    activeOrganizationId,
    setActiveOrganization,
    hasPermission: _hasPermission,
  }
})
