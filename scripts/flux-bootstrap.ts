import '@johnlindquist/kit'
import {
  contextSelector,
  getKubeContextNames,
} from '../cli/utils/context-helpers'

export const metadata: Metadata = {
  name: 'FluxCD Bootstrap',
  keyword: 'fluxcd',
  group: 'Favorite',
  access: 'private',
  index: 0,
}

const [username, repositoryName, branchName, path, pat] = await fields([
  {
    label: 'Github Username',
    type: 'text',
    required: true,
  },
  {
    label: 'Repository Name',
    type: 'text',
    required: true,
  },
  {
    label: 'Branch Name',
    type: 'text',
    required: true,
  },
  {
    label: 'Path',
    type: 'text',
    required: true,
  },
  {
    label: 'Github PAT Token',
    type: 'password',
    required: true,
  },
])

const selectedContext = await contextSelector()

const { stdout } = await exec(
  `flux bootstrap github --token-auth --owner=${username} --repository=${repositoryName} --branch=${branchName} --path=${path} --context ${selectedContext} --personal`,
  {
    env: {
      GITHUB_TOKEN: pat,
    },
  },
)

console.log('STDOUT', stdout)
