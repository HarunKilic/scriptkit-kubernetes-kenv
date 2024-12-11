import '@johnlindquist/kit'
import { join } from '@johnlindquist/kit/globals/path.js'
import { CONTEXTS_FOLDER, DISABLED_CONTEXTS_FOLDER } from '../constants'
import { getContextFileByName } from '../utils/context-helpers'

export async function deleteContext(contextName: string, disabled = false) {
  const contextFilesToDelete = await getContextFileByName(contextName)

  if (contextFilesToDelete.length === 0) {
    setHint('Nothing to delete')
    return
  }

  // Delete the context files
  for (const file of contextFilesToDelete) {
    await unlink(
      join(disabled ? DISABLED_CONTEXTS_FOLDER : CONTEXTS_FOLDER, file),
    )
  }

  return contextName
}
