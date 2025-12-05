import type { Options } from 'unplugin-vue-router'

export default {
  routesFolder: [
    {
      src: 'src/pages',
      path: '',
    },
    {
      src: 'modules/role/pages',
      path: 'roles/',
    },
  ],
} satisfies Options
