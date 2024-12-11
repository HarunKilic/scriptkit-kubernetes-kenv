import '@johnlindquist/kit'
import { kubeConfigSchema } from '../types/kube-config-schema'
import ModernError from 'modern-errors'
import { CONTEXTS_FOLDER } from '../constants'
import { join } from '@johnlindquist/kit/globals/path.js'
import { mergeKubeConfigs } from './merge-context'
import { parseKubeContextYaml } from '../utils/context-helpers'

export async function addContext() {
  let configName = ''
  const yaml = await editor({
    language: 'yaml',
    validate: async (input): Promise<true | string> => {
      try {
        const config = parseKubeContextYaml(input)
        if (!config) {
          throw 'Invalid YAML'
        }

        kubeConfigSchema.safeParse(config)

        // Additional validation for references
        const clusterNames = config.clusters.map((c) => c.name)
        const userNames = config.users.map((u) => u.name)

        // Validate context references
        const invalidContexts = config.contexts.filter(
          (ctx) =>
            !clusterNames.includes(ctx.context.cluster) ||
            !userNames.includes(ctx.context.user),
        )

        if (invalidContexts.length > 0) {
          throw 'Invalid cluster or user references in contexts'
        }

        // Validate current-context exists
        if (
          !config.contexts.some((c) => c.name === config!['current-context'])
        ) {
          throw 'current-context references non-existent context'
        }

        configName = config['current-context']
        // Check if file exists with same name
        if (configName) {
          const exists = await pathExists(join(CONTEXTS_FOLDER, configName))
          if (exists) {
            const response = await arg('Overwrite existing context file?', [
              'yes',
              'no',
            ])
            if (response === 'yes') {
              return true
            } else {
              throw 'Context with the same name already exists'
            }
          }
        }

        return true
      } catch (error) {
        return ModernError.normalize(error).message
      }
    },
    highlightActiveIndentGuide: true,
  })

  if (!yaml || !configName) {
    return
  }

  // Write to contexts folder
  await ensureDir(CONTEXTS_FOLDER)
  await writeFile(join(CONTEXTS_FOLDER, configName), yaml)
  toast('Context added')
  await mergeKubeConfigs()
}
