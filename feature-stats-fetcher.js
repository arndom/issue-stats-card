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
    // throw Error(res.data.errors[0].message || "Could not fetch user");
  }

  console.log("all closed issues:",res.data.data.repository.all_time_closedIssues.totalCount)
  console.log("all open issues:",res.data.data.repository.all_time_openIssues.totalCount)
  console.log("response rate base array ",res.data.data.repository.response_rate.nodes)

}

module.exports = fetchIssueStats;