import { parse } from 'yaml'
import { KubeConfig } from '../types/kube-config-schema'
import {
  KUBE_CONFIG_FILE,
  CONTEXTS_FOLDER,
  DISABLED_CONTEXTS_FOLDER,
} from '../constants'
import { join } from '@johnlindquist/kit/globals/path.js'

export const getKubeContextNames = async (): Promise<string[]> => {
  const { stdout } = await exec(
    'kubectl config get-contexts --no-headers -o name',
  )

  if (!stdout) {
    return []
  }

  return stdout.toString().trim().split('\n')
}

export const getCurrentKubeContextName = async (): Promise<string | null> => {
  try {
    const { stdout } = await exec('kubectl config current-context')

    return stdout.toString().trim()
  } catch (error) {
    return null
  }
}

export const parseKubeContextYaml = (input: string): KubeConfig => {
  return parse(input)
}

export const getContextFiles = async (
  disabled = false,
): Promise<
  {
    name: string
    folder: string
  }[]
> => {
  const folder = disabled ? DISABLED_CONTEXTS_FOLDER : CONTEXTS_FOLDER

  await ensureDir(folder)
  const contextFileNames = await readdir(folder, { withFileTypes: true })
  return contextFileNames
    .filter((file) => file.isFile())
    .map((file) => ({
      name: file.name,
      folder,
    }))
}

export const getDisabledContextNames = async (): Promise<string[]> => {
  const disabledContextFiles = await getContextFiles(true)

  const disabledContextNames: KubeConfig[] = []
  for (const file of disabledContextFiles) {
    disabledContextNames.push(
      await getParsedContextFile(DISABLED_CONTEXTS_FOLDER, file.name),
    )
  }

  return disabledContextNames.map((file) => file['current-context'])
}

export const getParsedContextFile = async (
  folder: string,
  file: string,
): Promise<KubeConfig> => {
  const contextFileContents = await readFile(join(folder, file), {
    encoding: 'utf-8',
  })

  return parseKubeContextYaml(contextFileContents)
}

export const getContextFileByName = async (
  contextName: string,
  disabled = false,
) => {
  const folder = disabled ? DISABLED_CONTEXTS_FOLDER : CONTEXTS_FOLDER
  // Find the context file by name current-context in the files by iterating over the files in the contexts folder
  const contextFiles = await getContextFiles(disabled)

  const foundFiles: string[] = []
  for (const file of contextFiles) {
    const parsedContext = await getParsedContextFile(folder, file.name)

    if (parsedContext['current-context'] === contextName) {
      foundFiles.push(file.name)
    }
  }

  return foundFiles
}

export const deleteContextFile = async () => {
  await unlink(join(KUBE_CONFIG_FILE))
}
