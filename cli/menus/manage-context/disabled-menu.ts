import { deleteContext } from '../../functions/delete-context'
import { backToActionMenu } from '../../utils/menu-helpers'
import { KubernetesContextActions } from '../../types/kubernetes-context-actions'
import { enableContext } from '../../functions/enable-context'
import { AppState } from '@johnlindquist/kit'
import { mergeKubeConfigs } from '../../functions/merge-context'
import { getDisabledContextNames } from '../../utils/context-helpers'

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
  disabled = false,
}: ContextActionState) => {
  if (state?.selected?.length <= 0) {
    setHint('No context selected')
    return
  }

  const configNames: string[] = []
  for (const name of state.selected) {
    configNames.push(await configHandler(name, disabled))
  }

  toast(
    `${
      actionType.charAt(0).toUpperCase() + actionType.slice(1)
    }: "${configNames.join(', ')}"`,
  )
  await mergeKubeConfigs()
}

const disabledContextNames = Array.from(
  new Set(await getDisabledContextNames()),
)

export async function disabledContextMenu(): Promise<void> {
  await select(
    {
      placeholder: 'Disabled Contexts',
      shortcuts: [
        {
          name: 'Toggle All',
          key: `${cmd}+a`,
          onPress: async (input, state) => {
            toggleAllSelectedChoices()
          },
          bar: 'right',
          visible: true,
        },
      ],
    },
    disabledContextNames.map((context) => ({
      name: context,
      value: context,
    })),
    [
      {
        name: 'Enable Selected Contexts',
        description: 'Moves context to enabled folder',
        onAction: async (_, state) =>
          await contextAction({
            state,
            configHandler: enableContext,
            actionType: 'enable',
          }),
        group: 'Context Actions',
      },
      {
        name: 'Delete Selected Contexts',
        description: 'Deletes context file',
        onAction: async (_, state) =>
          await contextAction({
            state,
            configHandler: deleteContext,
            actionType: 'delete',
            disabled: true,
          }),
        group: 'Context Actions',
      },
    ],
  )
}
