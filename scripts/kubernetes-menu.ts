import '@johnlindquist/kit'
import { cliShortcuts } from '@johnlindquist/kit'
import { kubernetesManagementChoices } from '../cli/constants'

export const metadata: Metadata = {
  name: 'Kubernetes',
  description:
    'Kubernetes Management for adding, removing, and managing contexts',
  // enter: 'Add/Remove/Manage Context',
  keyword: 'kubernetes',
}

let cliScript = await arg(
  {
    placeholder: 'Kubernetes Management',
    enter: 'Select',
    shortcuts: cliShortcuts,
  },
  kubernetesManagementChoices,
)

await run(kenvPath('kenvs', 'kubernetes', 'cli', 'menus', cliScript, 'main.ts'))
