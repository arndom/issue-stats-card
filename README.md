## Live Preview

<!-- <-ISSUE-STAT-HERE-> -->
| Issue Statistics | Values |
| - | :-: |
| Closed Issues 📪 | 1 |
| Open Issues 📫 | 0 |
| Total Issues 🔢 | 1 |
| Replied Issues ☑ | 0 |
| Not Replied Issues ➖ | 1 |
| Avg. Issue Response Time ⏱ | NA |
<!-- <-ISSUE-END-HERE-> -->

## How to use

1. Star this repo 😉
2. Go to your special repository(repo with name the same as git username).
3. Add the following section to your **README.md** file, you can give whatever title you want. Just make sure that you use `<!-- <-ISSUE-STAT-HERE-> --><!-- <-ISSUE-END-HERE-> -->` in your readme. The workflow will replace this comment with the actual blog post list:

   ```markdown
   # ISSUE STATS
   <!-- <-ISSUE-STAT-HERE-> -->
   <!-- <-ISSUE-END-HERE-> -->
   ```
4. Create a folder named `.github` and create a `workflows` folder inside it, if it doesn't exist.
5. Create a new file named `issue-stat-workflow.yml` with the following contents inside the workflow folder:

```yaml
name: Issue Stats Card

on:
  issues:
    types: [opened, edited, closed]
  issue_comment:
    types: [created, deleted]
  workflow_dispatch: # Run workflow manually (without waiting for the cron to be called), through the Github Actions Workflow page directly

jobs:
  get_repo_issue_stats:
    runs-on: ubuntu-latest
    name: Get repo issue stats
    steps:
    - name: Checkout
      uses: actions/checkout@v2
    - name: Get issue stats then generate card 
      uses: arndom/issue-stats-card@v1
```

6. Commit and wait for it to run automatically or you can also trigger it manually to see the result instantly.

## Special thanks to

- All users of the workflow
- All Collaborators of this project
- Dev.to for the github actions hackathon that inspired me to build this
- [@gautamkrishnar](https://github.com/gautamkrishnar) for writing awesome action code that helped me find my way around.

## Liked it?

Hope you like this, Don't forget to give this a star ⭐
