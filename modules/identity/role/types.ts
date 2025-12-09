export type RoleType = 'FULL_ACCESS' | 'SCOPED' | 'SYSTEM' | 'PUBLIC'

export type Role = {
  id: string
  description: string
  isActive: boolean
  name: string
  roleCategory: number
  roleKind: string
  roleType: RoleType
  isScoped?: boolean
  permissionLevel: 'ADMIN' | 'WRITE' | 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | null
  sortOrder: null
  value: string
  parentId: string | null
  lineage: string
  depth: number
  sequence: number
  children: Role[]
}

export type Lookup = {
  id: number
  label: string
}
