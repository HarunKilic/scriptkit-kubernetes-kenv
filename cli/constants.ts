import { Choices } from '@johnlindquist/kit'
import { join } from '@johnlindquist/kit/globals/path.js'
import { KubernetesContextActions } from './types/kubernetes-context-actions'

export const KUBE_CONFIG_FOLDER = join(home(), '.kube')
export const CONTEXTS_FOLDER = join(KUBE_CONFIG_FOLDER, 'contexts')
export const DISABLED_CONTEXTS_FOLDER = join(CONTEXTS_FOLDER, 'disabled')
export const KUBE_CONFIG_FILE = join(KUBE_CONFIG_FOLDER, 'config')

export const kubernetesManagementChoices: Choices<KubernetesContextActions> = [
  {
    name: 'Contexts',
    value: KubernetesContextActions.ManageContext,
    description: 'Add, remove, and manage kubectl contexts',
  },
  {
    name: 'FluxCD',
    value: KubernetesContextActions.FluxCD,
    description: 'Manage your FluxCD deployments',
  },
]
