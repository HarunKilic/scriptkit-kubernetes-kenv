import { join } from '@johnlindquist/kit/globals/path.js'
import { CONTEXTS_FOLDER, DISABLED_CONTEXTS_FOLDER } from '../constants'
import { getContextFileByName } from '../utils/context-helpers'

export async function disableContext(contextName: string) {
  const contextFilesToDisable = await getContextFileByName(contextName)

  if (contextFilesToDisable.length === 0) {
    setHint('Nothing to disable')
    return
  }

  // Move files to a disabled folder
  for (const file of contextFilesToDisable) {
    await move(
      join(CONTEXTS_FOLDER, file),
      join(DISABLED_CONTEXTS_FOLDER, file),
    )
  }

  return contextName
}
