import { fail } from "assert"
import { expect } from "chai"
import { GraphQLClient } from "graphql-request"
import { checkSuites, deployments } from "../src/setup/deployments"
import { config } from "../src/setup/environment"
import { getClient } from "../src/setup/githubGraphqlClient"


const expectedResults = [
  {
    SHA: "2bc59361c5f30357d11859bdf9e965ed7601ee20",
    commitTime: "2022-05-29T07:36:55Z",
    start: "2022-05-29T07:37:11Z",
    end: "2022-05-29T07:37:15Z",
    completion: "SUCCESS"
  },
  {
    SHA: "eeb0d97b54bf23dce6641ddb67bbaaf0eca26c93",
    commitTime: "2022-05-29T07:46:31Z",
    start: "2022-05-29T07:47:10Z",
    end: "2022-05-29T07:47:12Z",
    completion: "SUCCESS"
  },
  {
    SHA: "a79d9924aa48522db90e65f65cf0d36b40795301",
    commitTime: "2022-05-29T07:47:30Z",
    start: "2022-05-29T07:48:12Z",
    end: "2022-05-29T07:48:17Z",
    completion: "SUCCESS"
  },
  {
    SHA: "83da74de83b51ce12e185065df89c0f6244fed25",
    commitTime: "2022-05-29T07:47:51Z",
    start: "2022-05-29T07:48:49Z",
    end: "2022-05-29T07:48:51Z",
    completion: "SUCCESS"
  },
  {
    SHA: "17c57fe343a6cde75fc9ac5ef8f0520e3091a088",
    commitTime: "2022-05-30T02:38:30Z",
    start: "2022-05-30T03:29:01Z",
    end: "2022-05-30T03:29:05Z",
    completion: "FAILURE"
  },
]

describe("deployments", () => {
  const client: GraphQLClient = getClient()


  it("should list all the deployments for the repository", async () => {
    const result = await deployments({ ...config(), environment: "production", productionDeployJobName: "Deploy-Production" }, client)

    // The repository re-attempted the deployment, meaning the last deployment is listed twice
    // See:
    // - https://github.com/temyers/github-deployment-example/actions/runs/2406428489
    // - https://github.com/temyers/github-deployment-example/actions/runs/2406428489/attempts/1

    // TODO - retrieve the correct start/end times for the attempt.
    expect(result).to.deep.equal(expectedResults.concat({
      SHA: "17c57fe343a6cde75fc9ac5ef8f0520e3091a088",
      commitTime: "2022-05-30T02:38:30Z",
      start: "2022-05-30T03:29:01Z",
      end: "2022-05-30T03:29:05Z",
      completion: "FAILURE"
    }))
  })
})

describe("checkSuites", () => {
  const client: GraphQLClient = getClient()


  it("should list all the deployments for the repository", async () => {
    const result = await checkSuites({ ...config(), productionDeployJobName: "Deploy-Production" }, client)
    expect(result).to.deep.equal(expectedResults)
  })
})