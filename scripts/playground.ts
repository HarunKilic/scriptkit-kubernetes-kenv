import '@johnlindquist/kit'
import { homedir } from 'os'
import { join } from 'path'
import { addContext } from '../cli/functions/add-context'
import { deleteContext } from '../cli/functions/delete-context'
import { mergeKubeConfigs } from '../cli/functions/merge-context'
import { disableContext } from '../cli/functions/disable-context'
import { enableContext } from '../cli/functions/enable-context'
import {
  getDisabledContextNames,
  getKubeContextNames,
} from '../cli/utils/context-helpers'
import { disabledContextMenu } from '../cli/menus/manage-context/disabled-menu'
import { enabledContextMenu } from '../cli/menus/manage-context/enabled-menu'

export const metadata: Metadata = {
  name: 'Kubernetes Playground',
  keyword: 'playground',
  shortcode: 'pl',
}
delete arg?.pass
delete arg?.keyword

setInput('')

const disabledContextNames = Array.from(
  new Set(await getDisabledContextNames()),
)

onTab('Enabled', async (input) => {
  await enabledContextMenu()
})

onTab('Disabled', async (input = '') => {
  await disabledContextMenu(disabledContextNames)
})

// await DisabledContextMenu()
// await getKubeContextNames()
// await disabledContextMenu()
// await kubeMenu()
// await enableContext('homelab-cluster')
// await disableContext('homelab-cluster')
// await editor({
//   validate(input) {
//     return false
//   },
// })
