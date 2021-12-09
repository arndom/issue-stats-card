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

            const stats = await fetchIssuesStat();

            const markdown =`| Issue Statistics | Values |\n| - | :-: |\n| Closed Issues 📪 | ${stats.closed} |\n| Open Issues 📫 | ${stats.open} |\n| Total Issues 🔢 | ${stats.total} |\n| Replied Issues ☑ | ${stats.replied} |\n| Not Replied Issues ➖ | ${stats.noReply} |\n| Avg. Issue Response Time ⏱ | ${stats.rate !== undefined ? (stats.rate,"mins") : "NA" } |`
            
            const getReadme = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner: username,
                repo: repo,
                path: core.getInput('readme_path'),
              }).then( res => { 
                return res.data
              }     
              ).catch(e => {
                console.error("Failed:", e.message, "🔔")
                // core.setFailed("Failed: ", e.message)
              }
            )   

            const sha = getReadme.sha

            const contentb64 = getReadme.content      
            let buff = Buffer.from(contentb64, 'base64')
            let content = buff.toString('ascii')

            // content = content.replace("<!-- <-ISSUE-STAT-HERE-> -->\n", `<!-- <-ISSUE-STAT-HERE-> -->\n\n${markdown}\n`)
            content = content.replace("/<!-- <-ISSUE-STAT-HERE-> -->\n.*\n<!-- <-ISSUE-END-HERE-> -->/", `<!-- <-ISSUE-STAT-HERE-> -->\n\n${markdown}\n\n<!-- <-ISSUE-END-HERE-> -->`)
            
            await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
              owner: username,
              repo: repo,
              path: core.getInput('readme_path'),
              message: '(Automated) Update README.md',
              content: Buffer.from(content, "utf8").toString('base64'),
              sha: sha,
            }).then(() => {
              core.setOutput("result", (markdown))
            }).catch((e) => {
              console.error("Failed: ", e.message, "🔔")
            //   core.setFailed("Failed: ", e.message)
            })

        }catch(error){
            core.setFailed(error.message);
        }

    }
)()