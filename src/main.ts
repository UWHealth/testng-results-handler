/* eslint-disable  @typescript-eslint/no-explicit-any */
import * as core from '@actions/core'
import * as github from '@actions/github'
import { getResults, testngResults } from './results'
import { CommitStatus, setStatus, StatusState } from './status'

export async function run(): Promise<void> {
  try {
    const testngResultsPath: string = core.getInput('testng_results')
    const results: testngResults = await getResults(testngResultsPath)

    const commitStatusState = results.success ? StatusState.GOOD : StatusState.FAIL

    const skipStatus = core.getInput('skip_gihub_status_update') == 'true'

    const statusLabel: string = core.getInput('status_label')

    if (!skipStatus) {
      let sha = github.context.sha
      if (github.context.eventName === 'pull_request') {
        const PullRequestPayload = github.context.payload
        sha = PullRequestPayload.pull_request?.head?.sha
      }

      const commitStatus: CommitStatus = {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        sha: sha,
        state: commitStatusState,
        target_url: core.getInput('status_url') || '',
        description: `${process.env.LOCAL || ''}(√):${results.passed} + (×):${results.failed} + I:${
          results.ignored
        } + S:${results.skipped} = Tot:${results.total}`,
        context: `${process.env.TEST || ''}${statusLabel}`
      }

      const result = await setStatus(commitStatus)
      core.debug(`Created status: ${result}`)
      if (!result) {
        throw new Error(`GiHub Commit Status failed.`)
      }
    } else {
      console.log(`Github status with TestNG results skipped. Input(skip_gihub_status_update): ${skipStatus}`)
    }
  } catch (error: any) {
    core.error(error)
    core.setFailed(`Failinging worklfow: ${error.message}`)
  }
}

// Don't auto-execute in the test environment
if (process.env['NODE_ENV'] !== 'test') {
  run()
}
