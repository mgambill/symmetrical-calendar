import {type Organization} from '~/organization/types'
import {type Role} from '../role/types'

export type Profile = {
  id: number
  name: string
  organizations: Organization['id'][]
  roles: Role['value'][]
  alias?: string
}
