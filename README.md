# github-deployments-example

Simple exmaple to simulate CICD using GitHub actions.

[GitHub Actions](https://github.com/features/actions) provides a number of options to support Continuous Deployment pipelines all the way to production.

Depending on your subscription model, you may choose one of the following approaches:
* Use [Environments](https://docs.github.com/en/actions/deployment/using-environments-for-deployment) (GitHub Enterprise / public repos users) to target releases to a particular environment
* Use [Deployments](https://docs.github.com/en/actions/deployment/about-deployments/deploying-with-github-actions#introduction) *without* using Environments

## Pre-requisites

* Your repository has [Environments available](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
* You have admin access to the repository

## Setup


* Create a [Github personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) (PAT).  
  * Using a time limited token is recommended - e.g. 7 days. 
  * Grant the following permissions:
    ```
    repo
    workflow
    ```
    _NOTE_: modifying workflows requires the `repo` permission, granting full control to private repositories.



Run the setup script to configure environments in the repository.
The script assumes that the repository you are using is called `github-deployment-example`.  This can be overridden by setting the environment variable `GITHUB_REPOSITORY_NAME`

```
export GITHUB_TOKEN=<your-token-here>
export GITHUB_OWNER=<repository-owner>
npm run setup
```

## Pipeline analytics

Depending on your mode of execution, there are two different options for querying GitHub for pipeline data:
* Interrogate the `deployments` to filter for specific environment deployments
* Interrogate the `checkSuites` associated with specific commits (for a branch) and filter for the job names that perform deployment to the desired environment.

This repository provides an example of using both approaches to filter for 'production' deployments.

Both options require strong naming conventions to perform analysis across multiple repositories

## Limitations

* This example does not cover paging of results from the GitHub API
- Listing deployments shows retried deployments.  But it does not capture start/end times of retries properly - all retries are listed with the same start/end time.