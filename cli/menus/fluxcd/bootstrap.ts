import '@johnlindquist/kit'

const [pat] = await fields([
  {
    label: 'Github PAT Token',
    type: 'password',
    required: true,
  },
  {
    label: 'Github Username',
    type: 'select',
  },
])

//
