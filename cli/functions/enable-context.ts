import { join } from '@johnlindquist/kit/globals/path.js'
import { CONTEXTS_FOLDER, DISABLED_CONTEXTS_FOLDER } from '../constants'
import { getContextFileByName } from '../utils/context-helpers'

export async function enableContext(contextName: string) {
  try {
    const contextFilesToEnable = await getContextFileByName(contextName, true)

    if (contextFilesToEnable.length === 0) {
      setHint('Nothing to enable')
      return
    }

    // Move files to a disabled folder
    for (const file of contextFilesToEnable) {
      await move(
        join(DISABLED_CONTEXTS_FOLDER, file),
        join(CONTEXTS_FOLDER, file),
      )
    }

    return contextName
  } catch (error) {
    console.error('ERROR', error)
  }
}
