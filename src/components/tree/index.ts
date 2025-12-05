import type { InjectionKey } from 'vue'

export const treeContextKey = Symbol('tree-context') as InjectionKey<TreeContext>

export type TreeContext<T = unknown> = {
  hasChildren: (item: T) => boolean
  getChildren: (item: T) => T[]
  getItemKey: (item: T) => string | number
}
