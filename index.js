const core = require('@actions/core')
const { Octokit } = require('@octokit/core');
const fetchIssuesStat = require('./feature-stats-fetcher')

const octokit = new Octokit({ auth: core.getInput('gh_token') });

(
    async () => {

        try{
            const username = process.env.GITHUB_REPOSITORY.split("/")[0]
            const repo = process.env.GITHUB_REPOSITORY.split("/")[1]

            console.log("Hello", username,  ", the workflow is being deployed in the", repo, "repo")

            const getIssueStats = await fetchIssuesStat();
            console.log(getIssueStats) 

        }catch(error){
            core.setFailed(error.message);
        }

    }
)()