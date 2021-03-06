const { request } = require("./utils");
const core = require('@actions/core')

const fetcher = () => {
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

  const res = await fetcher().then(res=>{
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
  console.log("all time issues:",totalIssues)

  let baseIssues =  res.data.data.repository.response_rate.nodes
  let issuesCreated = baseIssues.map((issue) => issue.createdAt)
  let issuesResponse = baseIssues.map((issue) => issue.comments.nodes[0] !== undefined ? issue.comments.nodes[0].createdAt : "no comment reply")

  let _noCommentsIndex = issuesResponse.map( (issue, index) => {
    if(issue == 'no comment reply'){
      return index
    }
  }).filter((issue) => issue !== undefined)

  console.log("")
  console.log("the last 50 issues are being analysed......")
  console.log("number of not replied issues", _noCommentsIndex.length )

  issuesCreated = issuesCreated.filter((issue, index) => _noCommentsIndex.indexOf(index) === -1)
  issuesResponse = issuesResponse.filter((issue, index) => _noCommentsIndex.indexOf(index) === -1)

  let noValidIssues =  issuesResponse.length
  let timeDifference = issuesResponse.map((issue, index) => Math.round( (new Date(issue) - new Date(issuesCreated[index])) / (1000 * 60) )  )

  console.log("number of replied issues:", noValidIssues)

  let averageResponseRate;

  if(timeDifference.length < 2){
    console.log("not enough issues to analyse")
  }else{
    averageResponseRate = timeDifference.reduce((prev, curr) => prev + curr) / noValidIssues
    console.log("your average response rate in minutes is:", averageResponseRate, "mins")
  }

  let stats = {
    closed: closedIssues,
    open: openIssues,
    total: totalIssues,
    noReply:  _noCommentsIndex.length,
    replied:  noValidIssues,
    rate: averageResponseRate
  }

  return stats

}
module.exports = fetchIssueStats;