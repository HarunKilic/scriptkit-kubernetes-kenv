import '@johnlindquist/kit'
import {
  deleteContextFile,
  getContextFiles,
  getKubeContextNames,
} from '../utils/context-helpers'
import { KUBE_CONFIG_FILE } from '../constants'
import { backToActionMenu, backToMainMenu } from '../utils/menu-helpers'
import { KubernetesContextActions } from '../types/kubernetes-context-actions'

export async function mergeKubeConfigs() {
  const response = await arg('Merge Kube Configs?', [
    {
      name: 'Yes',
      value: true,
    },
    {
      name: 'No',
      value: false,
    },
  ])

  if (response) {
    await mergeKubeConfigFiles()
  }
}

async function mergeKubeConfigFiles() {
  // Store original KUBECONFIG
  let originalKubeConfig = process.env.KUBECONFIG

  if (!originalKubeConfig) {
    originalKubeConfig = KUBE_CONFIG_FILE
  }

  // Get current contexts from main config
  let currentContexts: string[] = []

  try {
    currentContexts = await getKubeContextNames()
  } catch (error) {
    currentContexts = []
  }

  setHint('Merging contexts from contexts folder')

  // Get all config files from contexts folder
  const contextFilesInFolder = await getContextFiles()

  const contextFiles = contextFilesInFolder.map(
    (contextFile) => `${contextFile.folder}/${contextFile.name}`,
  )

  if (contextFiles.length === 0) {
    const response = await arg(
      {
        hint: 'No config files found in contexts folder, this will delete all contexts from the main config file. Do you want to continue?',
      },
      [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ],
    )

    if (response) {
      await deleteContextFile()
    }
    setHint('No config files found in contexts folder')
    return
  }

  // Temporarily set KUBECONFIG for merging
  const tempKubeconfig = contextFiles.join(';')
  process.env.KUBECONFIG = tempKubeconfig

  // Get context from the context folder
  let newContexts: string[] = []
  try {
    newContexts = await getKubeContextNames()
  } catch (error) {
    newContexts = []
  }

  // Create new config with contexts folder configs
  const { stdout: newConfigResult } = await exec(
    'kubectl config view --flatten',
  )
  const newConfig = newConfigResult.toString()

  await writeFile(KUBE_CONFIG_FILE, newConfig, {
    encoding: 'ascii',
  })

  // Restore original KUBECONFIG
  process.env.KUBECONFIG = originalKubeConfig

  // Compare and show differences
  const added = newContexts.filter((ctx) => !currentContexts.includes(ctx))
  const removed = currentContexts.filter((ctx) => !newContexts.includes(ctx))

  const updatedInfos: UpdateInfo[] = []
  if (added.length > 0) {
    updatedInfos.push({ header: 'Added contexts', items: added, added: true })
  }

  if (removed.length > 0) {
    updatedInfos.push({
      header: 'Removed contexts',
      items: removed,
      added: false,
    })
  }

  if (added.length === 0 && removed.length === 0) {
    updatedInfos.push({ header: 'No changes' })
  }

  const currentContextNames = await getKubeContextNames()
  updatedInfos.push({
    header: 'Current contexts',
    items: currentContextNames,
  })

  await div({
    html: contextInfoView(updatedInfos),
    className: 'p-4 m-4',
    height: 500,
    shortcuts: [
      {
        key: 'escape',
        name: 'Context Menu',
        bar: 'right',
        onPress: async () => {
          await backToActionMenu(KubernetesContextActions.ManageContext)
        },
      },
      {
        key: `${cmd}+m`,
        name: 'Main Menu',
        bar: 'right',
        onPress: async () => {
          await backToMainMenu()
        },
      },
    ],
  })
}

type UpdateInfo = {
  header: string
  items?: string[]
  added?: boolean | null
}

function updatedInfoView({ header, items, added = null }: UpdateInfo) {
  let itemsBody = ''

  if (items && items?.length > 0) {
    itemsBody = items
      .map(
        (item) =>
          `${added !== null ? (added === true ? '+' : '-') : '*'} ${item}`,
      )
      .join('\n')
  }

  return `
    <div class="p-4 m-4 bg-primary rounded-lg shadow-md">
      <h3 class="text-lg font-semibold mb-2">${header}</h3>
      ${
        items && items?.length > 0
          ? `<pre class="bg-secondary p-4 rounded-lg overflow-auto">${itemsBody}</pre>`
          : ''
      }
    </div>
  `
}

function contextInfoView(updatedInfos: UpdateInfo[]) {
  return updatedInfos.map((info) => updatedInfoView(info)).join('</br>')
}
