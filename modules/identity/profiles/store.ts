import { useLocalStorage } from '@vueuse/core'

import { UserRole } from '~/identity/role/UserRoles'
import { organizations } from '~/organization/dataset'
import type { Profile } from './types'

export const useProfileStore = defineStore('profile', () => {
  const defaultProfiles: Profile[] = [
    { id: 1, name: 'Logan',         alias: 'Wolverine',       organizations: [1],     roles: [UserRole.SystemAdmin, UserRole.AssessmentAdmin] },
    { id: 2, name: 'Steve Rogers',  alias: 'Captain America', organizations: [2],     roles: [UserRole.UserAccessAdmin] },
    { id: 3, name: 'Peter Quill',   alias: 'Star-Lord',       organizations: [3],     roles: [] },
    { id: 4, name: 'Susan Storm',   alias: 'Invisible Woman', organizations: [4],     roles: [UserRole.PatientImport, UserRole.PatientReader] },
    { id: 5, name: 'Peter Parker',  alias: 'Spider-Man',      organizations: [1, 2],  roles: [UserRole.UserReader] }
  ]

  const profiles = useLocalStorage('profile-store', defaultProfiles)

  return { profiles, organizations }
})
