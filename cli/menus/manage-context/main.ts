import { getDisabledContextNames } from '../../utils/context-helpers'
import { disabledContextMenu } from './disabled-menu'
import { enabledContextMenu } from './enabled-menu'

delete arg?.pass
delete arg?.keyword

setInput('')

onTab('Enabled Contexts', async (input) => {
  await enabledContextMenu()
})

onTab('Disabled Contexts', async (input = '') => {
  await disabledContextMenu()
})
