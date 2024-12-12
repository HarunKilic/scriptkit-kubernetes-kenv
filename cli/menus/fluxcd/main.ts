import '@johnlindquist/kit'

const fluxScript = await arg('fluxcd', [
  {
    name: 'Bootstrap',
    value: 'bootstrap',
  },
  {
    name: 'Precheck',
    value: 'precheck',
  },
])

await run(projectPath('cli', 'menus', 'fluxcd', fluxScript + '.ts'))
