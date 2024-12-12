import '@johnlindquist/kit'
import { homedir } from 'os'
import { join } from 'path'
import { addContext } from '../cli/functions/add-context'
import { deleteContext } from '../cli/functions/delete-context'
import { mergeKubeConfigs } from '../cli/functions/merge-context'
import { disableContext } from '../cli/functions/disable-context'
import { enableContext } from '../cli/functions/enable-context'
import {
  contextSelector,
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
const selectedContext = await contextSelector()
const command = `flux check --pre --context ${selectedContext}`
const { stderr } = await exec(command)

div(
  md(`
 # FluxCD Precheck
 ## Context: ${selectedContext}
 ${stderr.toString().trim().split('\n').join('\n\n')}    
`),
)
