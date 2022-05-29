import { getClient } from "../src/setup/githubGraphqlClient"
import { setup } from "../src/setup/setup"
import { config } from "../src/setup/environment"
import { GraphQLClient, gql } from 'graphql-request'

import { expect } from "chai"

describe('Setup', () => {
  const client: GraphQLClient = getClient()
  const { name, owner } = config()

  interface Environment {
    name: string
  }

  before(async function () {
    this.timeout(30 * 1000)
    await setup()

  })

  describe('Github repository environments', () => {
    let environments: String[];
    before(async () => {
      const document = gql`query{
        repository(owner:"${owner}", name:"${name}") {
          environments(last:10){
            nodes {
              name
            }
          }
        }
      }`
      const data = await client.request(document)
      const responseNodes = data.repository.environments.nodes
      environments = responseNodes.map((e: Environment) => e.name)
    })

    it('should include a CI environment', () => {
      expect(environments).to.contain("CI")
    })
    it('should include a nonprod environment', () => {
      expect(environments).to.contain("nonprod")
    })
    it('should include a production environment', () => {
      expect(environments).to.contain("production")
    })
  })

})
