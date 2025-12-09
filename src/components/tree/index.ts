import type { InjectionKey } from 'vue'

export { default as Tree } from './Tree.vue'
export { default as TreeItem } from './TreeItem.vue'

export const treeContextKey = Symbol('tree-context') as InjectionKey<TreeContext>

export type TreeContext<T = unknown> = {
  hasChildren: (item: T) => boolean
  getChildren: (item: T) => T[]
  getItemKey: (item: T) => string | number
}

export const initializeTreeContext = <T>(root: T, context: TreeContext<T>) => {
  return {
    root,
    hasChildren: context.hasChildren,
    getChildren: context.getChildren,
    getItemKey: context.getItemKey,
  }
}
