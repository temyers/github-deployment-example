import { gql, GraphQLClient } from "graphql-request";
import { RepositoryConfig } from "./environment";

export interface DeploymentsParams extends RepositoryConfig {
  environment: string,
  productionDeployJobName: string

}

export interface DeploymentResponse {
  SHA: string,
  commitTime: string,
  start: string,
  end: string,
  completion: string
}

export async function deployments(params: DeploymentsParams, client: GraphQLClient): Promise<DeploymentResponse[]> {

  const query = gql`query deployments($name: String!, $owner: String!, $environment: String!, $productionDeployJobName: String!) {
    repository(owner: $owner, name: $name) {
      deployments(environments: [$environment], last: 10) {
        totalCount
        nodes {
          id
          environment
          state
          task
          createdAt
          commitOid
          commit {
            oid
            checkSuites(last: 10) {
              nodes {
                status
                conclusion
                checkRuns(filterBy: {checkName: $productionDeployJobName}, last: 10) {
                  nodes {
                    conclusion
                    name
                    id
                    status
                    startedAt
                    completedAt
                  }
                }
              }
            }
            committedDate
            authoredDate
          }
        }
      }
    }
  }`
  const result = await client.request(query, params)


  return result.repository.deployments.nodes.map((deploymentNode: any) => {


    const SHA = deploymentNode.commit.oid
    const commitTime = deploymentNode.commit.committedDate
    const completedDeployments = deploymentNode.commit.checkSuites.nodes
      .filter((n: any) => n.status == "COMPLETED")
      .map((checkSuiteNode: any) => {
        return checkSuiteNode.checkRuns.nodes.map((checkRunNode: any) => {
          return {
            start: checkRunNode.startedAt,
            end: checkRunNode.completedAt,
            completion: checkRunNode.conclusion,
            SHA,
            commitTime
          }
        })
      })

    return completedDeployments
  }).flat().flat()


}

export interface CheckSuitesParams extends RepositoryConfig {
  productionDeployJobName: string
}
export async function checkSuites(params: CheckSuitesParams, client: GraphQLClient): Promise<DeploymentResponse[]> {

  const query = gql`query mainRefs($name: String!, $owner: String!, $productionDeployJobName: String!) {
    repository(owner: $owner, name: $name)  {
      defaultBranchRef {
        target {
          ... on Commit {
            id
            oid
            history {
              nodes {
                oid
                authoredDate
                committedDate
                checkSuites(last: 10) {
                  nodes {
                    id
                    conclusion
                    checkRuns(filterBy: {checkName: $productionDeployJobName}, last: 10) {
                      nodes {
                        id
                        name
                        conclusion
                        completedAt
                        startedAt
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`

  const result = await client.request(query, params)

  const mappedResponse = result.repository.defaultBranchRef.target.history.nodes.map((commitRef: any) => {

    return commitRef.checkSuites.nodes
      .filter((n: any) => n.checkRuns.nodes.length > 0)
      .flat()
      .map((checkSuiteNode: any) => {
        return checkSuiteNode.checkRuns.nodes
      })
      .flat()
      .map((checkRun: any) => {

        return {
          start: checkRun.startedAt,
          end: checkRun.completedAt,
          completion: checkRun.conclusion,
          SHA: commitRef.oid,
          commitTime: commitRef.committedDate
        }
      })

  }).flat().reverse()

  return mappedResponse

}
