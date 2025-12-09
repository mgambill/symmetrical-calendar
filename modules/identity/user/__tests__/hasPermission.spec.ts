import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../store'
import { UserRole } from '../../role/UserRoles'

import type { User } from '../types'
describe('hasPermission', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  describe('Admin role', () => {
    it('should grant access to all permissions when user has System.Admin role', () => {
      const user: User = { roles: [UserRole.SystemAdmin], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      expect(store.hasPermission(UserRole.AdmissionReader)).toBe(true)
      expect(store.hasPermission(UserRole.PatientWriter)).toBe(true)
      expect(store.hasPermission(UserRole.OrganizationAdmin)).toBe(true)
      expect(store.hasPermission(UserRole.AuthorizationApprover)).toBe(true)
    })

    it('should grant access to all permissions when user has Admin role', () => {
      const user: User = { roles: [UserRole.SystemAdmin], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      expect(store.hasPermission(UserRole.AdmissionReader)).toBe(true)
      expect(store.hasPermission(UserRole.UserWriter)).toBe(true)
    })
  })

  describe('Primary role hierarchy', () => {
    it('should grant parent permission when user has ADMIN level role', () => {
      const user = { roles: [UserRole.OrganizationAdmin], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      // Admin should have access to all child permissions
      expect(store.hasPermission(UserRole.OrganizationAdmin)).toBe(true)
      expect(store.hasPermission(UserRole.OrganizationWriter)).toBe(true)
      expect(store.hasPermission(UserRole.OrganizationReader)).toBe(true)
    })

    it('should grant parent permission when user has WRITE level role', () => {
      const user = { roles: [UserRole.PatientWriter], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      // Write should have access to itself and Read child
      expect(store.hasPermission(UserRole.PatientWriter)).toBe(true)
      expect(store.hasPermission(UserRole.PatientReader)).toBe(true)
    })

    it('should NOT grant parent permission when user only has READ level role', () => {
      const user = { roles: [UserRole.PatientReader], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      // Read should only have access to itself
      expect(store.hasPermission(UserRole.PatientReader)).toBe(true)
      expect(store.hasPermission(UserRole.PatientWriter)).toBe(false)
    })

    it('should respect multi-level hierarchy (ADMIN > WRITE > READ)', () => {
      const user = { roles: [UserRole.AuthorizationAdmin], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      // Authorization.Administrator should have access to all descendants
      expect(store.hasPermission(UserRole.AuthorizationAdmin)).toBe(true)
      expect(store.hasPermission(UserRole.AuthorizationWriter)).toBe(true)
      expect(store.hasPermission(UserRole.AuthorizationReader)).toBe(true)
      expect(store.hasPermission(UserRole.AuthorizationApprover)).toBe(true)
    })
  })

  describe('Scoped organization enforcement', () => {
    it('should deny scoped role access when user is not in the organization', () => {
      const user = { roles: [UserRole.PatientWriter], organizations: [2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      expect(store.hasPermission(UserRole.PatientWriter)).toBe(false)
      expect(store.hasPermission(UserRole.PatientReader)).toBe(false)
    })

    it('should allow non-scoped role without organization membership', () => {
      const user = { roles: [UserRole.OrganizationAdmin], organizations: [] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)
      

      expect(store.hasPermission(UserRole.OrganizationWriter)).toBe(true)
    })
  })

  describe('Supplementary roles', () => {
    it('should NOT grant access to supplementary role without explicit assignment', () => {
      const user = { roles: [UserRole.PatientWriter], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      // Patient.ReadWrite should NOT automatically grant Patient.Import (supplementary)
      expect(store.hasPermission(UserRole.PatientWriter)).toBe(true)
      expect(store.hasPermission(UserRole.PatientImport)).toBe(false)
    })

    it('should grant access to supplementary role when explicitly assigned', () => {
      const user = { roles: [UserRole.PatientImport], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      expect(store.hasPermission(UserRole.PatientImport)).toBe(true)
    })

    it('should NOT grant parent primary role when user has supplementary role', () => {
      const user = { roles: [UserRole.AuthorizationApprover], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      // Supplementary role should NOT grant access to parent primary roles
      expect(store.hasPermission(UserRole.AuthorizationApprover)).toBe(true)
      expect(store.hasPermission(UserRole.AuthorizationWriter)).toBe(false)
      expect(store.hasPermission(UserRole.AuthorizationReader)).toBe(false)
    })

    it('should grant supplementary role when user has ancestor primary role', () => {
      const user = { roles: [UserRole.AuthorizationAdmin], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      // Admin should have access to supplementary child role
      expect(store.hasPermission(UserRole.AuthorizationApprover)).toBe(true)
    })

    it('should handle pathway template writer supplementary role correctly', () => {
      const user = { roles: [UserRole.PathwayWriter], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      // Pathway.ReadWrite should NOT automatically grant PathwayTemplate.ReadWrite
      expect(store.hasPermission(UserRole.PathwayWriter)).toBe(true)
      expect(store.hasPermission(UserRole.PathwayTemplateWriter)).toBe(false)
    })
  })

  describe('Multiple roles', () => {
    it('should grant permissions from all assigned roles', () => {
      const user = { roles: [UserRole.PatientReader, UserRole.ProviderWriter], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      expect(store.hasPermission(UserRole.PatientReader)).toBe(true)
      expect(store.hasPermission(UserRole.ProviderWriter)).toBe(true)
      expect(store.hasPermission(UserRole.ProviderReader)).toBe(true)
    })

    it('should combine primary and supplementary roles correctly', () => {
      const user = { roles: [UserRole.PatientWriter, UserRole.PatientImport], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      expect(store.hasPermission(UserRole.PatientWriter)).toBe(true)
      expect(store.hasPermission(UserRole.PatientReader)).toBe(true)
      expect(store.hasPermission(UserRole.PatientImport)).toBe(true)
    })
  })

  // describe('Active organization handling', () => {
  //   it('should fall back to the active organization when none is provided', () => {
  //     const user = { roles: ['Patient.ReadWrite'], organizations: [5] }
  //     const organizationId = 2
  //     const store = useUserStore()
  //     store.initialize(user, organizationId)

  //     const { can, activeOrganizationId } = usePermission()

  //     expect(activeOrganizationId.value).toBeNull()
  //     expect(can('Patient.Read')).toBe(false)

  //     store.setActiveOrganization(5)
  //     expect(activeOrganizationId.value).toBe(5)
  //     expect(can('Patient.Read')).toBe(true)

  //     store.setActiveOrganization(10)
  //     expect(activeOrganizationId.value).toBe(10)
  //     expect(can('Patient.Read')).toBe(false)
  //   })
  // })

  describe('Edge cases', () => {
    it('should deny all permissions when user has no roles', () => {
      const user = { roles: [], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      expect(store.hasPermission(UserRole.PatientReader)).toBe(false)
      expect(store.hasPermission(UserRole.SystemAdmin)).toBe(false)
    })

    it('should deny access to unrelated role hierarchies', () => {
      const user = { roles: [UserRole.PatientWriter], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      // Patient.ReadWrite should NOT grant Provider permissions
      expect(store.hasPermission(UserRole.ProviderWriter)).toBe(false)
      expect(store.hasPermission(UserRole.OrganizationReader)).toBe(false)
    })

    it('should handle non-existent permission requests', () => {
      const user = { roles: [UserRole.PatientWriter], organizations: [1, 2, 3] }
      const organizationId = 1
      const store = useUserStore()
      store.initialize(user, organizationId)

      expect(store.hasPermission('NonExistent.Permission')).toBe(false)
    })
  })
})
