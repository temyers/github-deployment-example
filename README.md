# github-deployments-example

Simple exmaple to use GitHub actions to deploy to AWS.


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

