import type { App, Ref } from 'vue'
import { RouterView, type RouteLocationRaw } from 'vue-router'
import DefaultLayout from './DefaultLayout.vue'
import EmptyLayout from './EmptyLayout.vue'
import ModalLayout from './ModalLayout.vue'
import AdminLayout from './AdminLayout.vue'
import { createInjectionState, useSessionStorage } from '@vueuse/core'

export type BreadcrumbItem = { name: string; to?: RouteLocationRaw; current?: boolean }

// just a helper function to make it easier to use with typescript
export const withBreadcrumbs = (items: BreadcrumbItem[]) => items

export const useLayouts = {
  install: (app: App): void => {
    app.component('Layout', DefaultLayout)
    app.component('EmptyLayout', EmptyLayout)
    app.component('DefaultLayout', DefaultLayout)
    app.component('ModalLayout', ModalLayout)
    app.component('AdminLayout', AdminLayout)
  },
}

export type LayoutProvider = {
  expanded: Readonly<Ref<boolean>>
  updateExpandedState: (state: boolean) => void
}

export const layoutInjectionKey = Symbol() as InjectionKey<LayoutProvider>

const [useProvideLayoutStore, _useLayoutStore] = createInjectionState((defaultValue: boolean) => {
  const expanded = useSessionStorage('toggleState', defaultValue ?? false)
  const updateExpandedState = (state: boolean) => {
    expanded.value = state
  }
  return { expanded, updateExpandedState }
})
export { useProvideLayoutStore }

export function useLayoutStore() {
  const store = _useLayoutStore()
  if (store == null)
    throw new Error('Please call `useProvideLayoutStore` on the appropriate parent component')
  return store
}

export const DefaultIndexPage = {
  setup() {
    const route = useRoute()
    return () => h(RouterView, { key: route?.fullPath })
  },
}
