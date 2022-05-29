const name =
  process.env.GITHUB_REPOSITORY_NAME || 'github-deployment-example'
const owner = process.env.GITHUB_OWNER


export interface RepositoryConfig {
  name: string,
  owner: string
}

export function config(): RepositoryConfig {
  if (!owner) {
    throw new Error('Environment Variable `GITHUB_OWNER` not defined.  Define using: "export GITHUB_OWNER=<owner>"')
  }
  return {
    name, owner
  }
}