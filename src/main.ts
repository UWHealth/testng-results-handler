import * as core from '@actions/core'
import * as github from '@actions/github'
import Webhooks from '@octokit/webhooks'
import { getResults, testngResults } from './results'
import { CommitStatus, setStatus, StatusState } from './status'

async function run(): Promise<void> {
  try {
    const testngResultsPath: string = core.getInput('testng_results')
    const results: testngResults = await getResults(testngResultsPath)

    const commitStatusState = results.success
      ? StatusState.GOOD
      : StatusState.FAIL

    let sha = github.context.sha
    if (github.context.eventName === 'pull_request') {
      const PullRequestPayload = github.context
        .payload as Webhooks.WebhookPayloadPullRequest
      sha = PullRequestPayload.pull_request.head.sha
    }

    const commitStatus: CommitStatus = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      sha: sha,
      state: commitStatusState,
      target_url: core.getInput('status_url') || '',
      description: `${process.env.LOCAL || ''}Pass: ${results.passed} + Fail: ${
        results.failed
      } + Ignore: ${results.ignored} + Skip: ${results.skipped} = Total: ${
        results.total
      }`,
      context: `${process.env.TEST || ''}End-to-End Test Results.`
    }

    const result = await setStatus(commitStatus)
    core.debug(`Created status: ${result}`)
    if (!result) {
      throw new Error(`GiHub Commit Status failed.`)
    }
  } catch (error) {
    core.error(error)
    core.setFailed(`Failinging worklfow: ${error.message}`)
  }
}

run()
