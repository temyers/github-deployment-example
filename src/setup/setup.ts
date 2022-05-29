import { gql, GraphQLClient } from 'graphql-request'

import { config } from './environment'
import { getClient } from './githubGraphqlClient'

const { name, owner } = config()

const client = getClient()


export async function setup() {
  const repoId = await getRepositoryId(name, owner, client)

  await createEnvironment('CI', repoId, client)
  await createEnvironment('nonprod', repoId, client)
  await createEnvironment('production', repoId, client)

}

async function getRepositoryId(repoName: string, repoOwner: string, client: GraphQLClient) {
  const response = await client.request({
    document: gql`
    query {
      repository(owner:"${repoOwner}", name:"${repoName}") {
        id
      }
    }
    `,
  })
  return response.repository.id
}

async function createEnvironment(name: string, repostioryId: string, client: GraphQLClient) {
  const document = gql`
  mutation { 
    createEnvironment(input: {
      name: "${name}",
      repositoryId: "${repostioryId}"  
    }) {
      clientMutationId
    }
  }
  `
  await client.request({
    document,
  })

  console.log(`Created environment: ${name}`)
}
