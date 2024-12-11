import { KubernetesContextActions } from '../types/kubernetes-context-actions'

export const backToActionMenu = async (menuName: KubernetesContextActions) => {
  await run(
    kenvPath('kenvs', 'kubernetes', 'cli', 'menus', menuName, 'main.ts'),
  )
}

export const backToMainMenu = async () => {
  await run(kenvPath('kenvs', 'kubernetes', 'scripts', 'kubernetes-menu.ts'))
}
