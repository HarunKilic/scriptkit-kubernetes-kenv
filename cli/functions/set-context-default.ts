export async function setContextDefault(contextName: string): Promise<string> {
  try {
    await exec(`kubectl config use-context ${contextName}`)
    toast(`"${contextName}" is set as default context`)

    return contextName
  } catch (error) {
    throw new Error(
      `Failed to set "${contextName}" as default context: ${error}`,
    )
  }
}
