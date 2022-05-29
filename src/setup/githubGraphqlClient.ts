import { GraphQLClient } from 'graphql-request'



const authToken = process.env.GITHUB_TOKEN

if (!authToken) {
  throw new Error("Environment variable 'GITHUB_TOKEN' not configured.  'export GITHUB_TOKEN=<oauth-tokwn>'")
}

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    authorization: `Bearer ${authToken}`,
  },
})


export function getClient() {
  return client
}