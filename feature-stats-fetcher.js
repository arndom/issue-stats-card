const { request } = require("./utils");
const core = require('@actions/core')

const fetchBaseStat = () => {
  return request(
    {
      query: `
        {
            repository(name: "${process.env.GITHUB_REPOSITORY.split("/")[1]}", owner: "${process.env.GITHUB_REPOSITORY.split("/")[0]}") {
                all_time_closedIssues: issues(states: CLOSED) {
                    totalCount
                }
                all_time_openIssues: issues(states: OPEN) {
                    totalCount
                }
                response_rate: issues(last: 50, orderBy: {field: CREATED_AT, direction: ASC}) {
                  nodes {
                    createdAt
                    comments(first: 1, orderBy: {field: UPDATED_AT, direction: ASC}) {
                      nodes {
                        createdAt
                      }
                    }
                  }
                }
            }
        }
      `
    },
    {
      Authorization: `bearer ${core.getInput('gh_token')}`,
    },
  );
};


// feature and bug label stats were removed cos it's not always clearly defined in that form by repo owners 

async function fetchIssueStats() {

  const res = await fetchBaseStat().then(res=>{
    return res
  })

  if (res.data.errors) {
    console.error(res.data.errors);
  }

  let closedIssues = res.data.data.repository.all_time_closedIssues.totalCount
  let openIssues = res.data.data.repository.all_time_openIssues.totalCount
  let totalIssues = closedIssues + openIssues

  console.log("all closed issues:",closedIssues)
  console.log("all open issues:",openIssues)
  console.log("all issues:",totalIssues)

  let baseIssues =  res.data.data.repository.response_rate.nodes
  let issuesCreated = baseIssues.map((issue) => issue.createdAt)
  let issuesResponse = baseIssues.map((issue) => issue.comments.nodes[0] !== undefined ? issue.comments.nodes[0].createdAt : "no comment reply")

  console.log("array of when issue were created:", issuesCreated)
  console.log("array of when issue was first responded to:", issuesResponse)


  let test = new Date(issuesCreated[0])
  console.log("test", test - test)

}

module.exports = fetchIssueStats;