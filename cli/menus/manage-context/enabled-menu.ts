import { refreshable } from '@josxa/kit-utils'
import { addContext } from '../../functions/add-context'
import { deleteContext } from '../../functions/delete-context'
import { disableContext } from '../../functions/disable-context'
import { mergeKubeConfigs } from '../../functions/merge-context'
import { setContextDefault } from '../../functions/set-context-default'
import {
  getKubeContextNames,
  getCurrentKubeContextName,
} from '../../utils/context-helpers'
import { AppState } from '@johnlindquist/kit'

type ContextActionState = {
  state: AppState
  configHandler: (name: string, disabled?: boolean) => Promise<string>
  actionType: 'enable' | 'disable' | 'delete'
  disabled?: boolean
}

export const contextAction = async ({
  state,
  configHandler,
  actionType,
}: ContextActionState) => {
  if (!state?.focused?.value) {
    setHint('No context selected')
    return
  }
  const configName = await configHandler(state.focused.value)

  toast(
    `${
      actionType.charAt(0).toUpperCase() + actionType.slice(1)
    }: "${configName}"`,
  )
  await mergeKubeConfigs()
}

const contextNames = await getKubeContextNames()
let currentContext = await getCurrentKubeContextName()
export const enabledContextMenu = async () => {
  await refreshable(async ({ refresh }) => {
    return await arg(
      {
        placeholder: 'Active Contexts',
        enter: 'Select as default',
        onSubmit: async (_, state) => {
          if (!state?.value) return

          if (state.value === currentContext) {
            setHint('Already set as default')
            return preventSubmit
          }
          try {
            currentContext = await setContextDefault(state.value)
            refresh()
          } catch (error) {
            setHint(
              `Failed to set "${state.value}" as default context: ${error}`,
            )
            return
          }
        },
      },
      [
        ...contextNames.map((context) => ({
          name: context,
          value: context,
          description: context === currentContext ? 'Current Default' : '',
        })),
      ],
      [
        {
          name: 'Merge Contexts',
          description: 'Merges your contexts into a single kubeconfig',
          onAction: async () => {
            await mergeKubeConfigs()
          },
          shortcut: `${cmd}+m`,
          group: 'Global',
        },
        {
          name: 'Add Context',
          visible: true,
          shortcut: `${cmd}+n`,
          onAction: async () => await addContext(),
          group: 'Global',
        },
        {
          name: 'Disable Context',
          description: 'Moves context to disabled folder',
          onAction: async (_, state) =>
            await contextAction({
              state,
              configHandler: disableContext,
              actionType: 'disable',
            }),
          group: 'Context Actions',
        },
        {
          name: 'Delete Context',
          description: 'Deletes context file',
          onAction: async (_, state) =>
            await contextAction({
              state,
              configHandler: deleteContext,
              actionType: 'delete',
            }),
          group: 'Context Actions',
        },
      ],
    )
  })
}
