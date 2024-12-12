import { contextSelector } from '../../utils/context-helpers'

const selectedContext = await contextSelector()
const command = `flux check --pre --context ${selectedContext}`
const { stderr } = await exec(command)

div(
  md(`
 # FluxCD Precheck
 ## Context: ${selectedContext}
 ${stderr.toString().trim().split('\n').join('\n\n')}    
`),
)
